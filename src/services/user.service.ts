import threadDBClient from "../threaddb.config";
import { Community, User, ValidationResponseModel } from "../models";
import { CommunitiesCollection, MessagesCollection, UsersCollection } from "../constants/constants";
import { getCommunityMembers, updateScarcityScore } from "./community.service";
import { calculateInitialCreditsAmount } from "./skills.service";
import { Where } from "@textile/hub";

export async function validateUser(user: User): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    if (!user.username) {
        response.isValid = false;
        response.message = 'Username is required field';
        return response;
    }
    if (!user.communityID) {
        response.isValid = false;
        response.message = 'Community is required field';
        return response;
    }
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
    await updateScarcityScore(user.communityID);
    return { credits: credits, userID: existingUser[0]._id };
}

export async function getMessages(email: string) {
    // email = 'mimonova13@gmail.com';
    const userQuery = new Where('email').eq(email);
    const user = (await threadDBClient.filter(UsersCollection, userQuery))[0] as any;

    const key = await threadDBClient.getCommunityPrivKey(user.communityID);
    // const messages = await threadDBClient.getAll(MessagesCollection, key.privKey, key.threadID);

    const messages = await threadDBClient.getAllMessages(key.privKey);
    console.log(messages);
    return messages;

}