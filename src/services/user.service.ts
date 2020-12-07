import threadDBClient from "../threaddb.config";
import { Community, communitySchema, User, ValidationResponseModel } from "../models";
import { CommunitiesCollection, MessagesCollection, UsersCollection } from "../constants/constants";
import { getCommunityMembers, updateScarcityScore } from "./community.service";
import { calculateInitialCreditsAmount } from "./skills.service";
import { Where } from "@textile/hub";
import { v4 as uuidv4 } from 'uuid';

export async function validateRegisteredUser(email: string) {
    const userQuery = new Where('email').eq(email);
    const user = (await threadDBClient.filter(UsersCollection, userQuery))[0] as User;

    if (!user.communityID) {
        return { valid: false, message: 'User has not joined a community.' }
    }
    if (!user.skills || user.skills.length < 1) {
        return { valid: false, message: 'User has not selected skills.' }
    }
    return { valid: true }
}

export async function validateUser(user: User): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    if (!user.username) {
        response.isValid = false;
        response.message = 'Username is required field';
        return response;
    }
    if (user.communityID) {
        try {
            await threadDBClient.getByID(CommunitiesCollection, user.communityID)
        } catch (err) {
            response.isValid = false;
            response.message = 'Community not found';
            return response;
        }
        const communityMembers = await getCommunityMembers(user.communityID);
        if (communityMembers.length >= 24) {
            response.isValid = false;
            response.message = 'Community cannot exceed 24 members';
            return response;
        }
    }
    return response;
}


// validate
// insert 
// update scarcity score
export async function fillUserData(email: string, user: User) {
    const query = new Where('email').eq(email);
    const existingUser = (await threadDBClient.filter(UsersCollection, query)) as any[];
    user.issuer = existingUser[0].issuer;
    user.email = existingUser[0].email;
    user.lastLoginAt = existingUser[0].lastLoginAt;
    user._id = existingUser[0]._id;
    await threadDBClient.update(UsersCollection, existingUser[0]._id, user);
    const credits = await calculateInitialCreditsAmount(user);
    return { credits: credits, userID: existingUser[0]._id };
}


export async function updateCommunityID(email: string, communityID: string) {
    const query = new Where('email').eq(email);
    const existingUser = (await threadDBClient.filter(UsersCollection, query))[0] as User;
    existingUser.communityID = communityID;
    await threadDBClient.update(UsersCollection, existingUser._id, existingUser);
    await updateScarcityScore(communityID);
}

export async function getMessages(email: string) {
    const userQuery = new Where('email').eq(email);
    const user = (await threadDBClient.filter(UsersCollection, userQuery))[0] as any;

    const key = await threadDBClient.getCommunityPrivKey(user.communityID);

    const messages = await threadDBClient.getAllMessages(key.privKey);
    console.log(messages);
    return messages;
}


export async function getInvitationLink(email: string): Promise<string> {
    const userQuery = new Where('email').eq(email);
    const user = (await threadDBClient.filter(UsersCollection, userQuery))[0] as User;

    if (user.communityID) {
        const guid = uuidv4();
        if (!user.invites) {
            user.invites = []
        }

        user.invites.push({
            guid: guid,
            time: Date.now()
        });

        await threadDBClient.update(UsersCollection, user._id, user);
        const community = await threadDBClient.getByID(CommunitiesCollection, user.communityID) as Community;
        return `https://distributed.town/community/invite?communityId=${community._id}&communityName=${encodeURIComponent(community.name)}`;
    } else {
        return undefined;
    }

}