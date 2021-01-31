import threadDBClient from "../threaddb.config";
import { User, ValidationResponseModel } from "../models";
import { CommunitiesCollection } from "../constants/constants";
import { updateScarcityScore } from "./community.service";
import { getCommunityMembers, getSkillWalletByID, storeSkillWallet } from "../skillWallet/skillWallet.client";

export async function validateRegisteredUser(skillWalletID: string) {
    const user = await getSkillWalletByID(skillWalletID);

    if (!user.communityID) {
        return { valid: false, message: 'User has not joined a community.' }
    }
    if (!user.skillWallet || user.skillWallet.length < 1) {
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


export async function updateCommunityID(skillWalletID: string, communityID: string) {
    const existingUser = await getSkillWalletByID(skillWalletID);
    existingUser.communityID = communityID;
    updateCommunityID(skillWalletID, communityID);
    updateScarcityScore(communityID);
}

export async function getMessages(skillWalletID: string) {
    const user = await getSkillWalletByID(skillWalletID);
    const key = await threadDBClient.getCommunityPrivKey(user.communityID);
    const messages = await threadDBClient.getAllMessages(key.privKey);
    return messages;
}


// export async function getInvitationLink(skillWalletID: string): Promise<string> {
//     const user = await getSkillWalletByID(skillWalletID);

//     if (user.communityID) {
//         const guid = uuidv4();
//         if (!user.invites) {
//             user.invites = []
//         }

//         user.invites.push({
//             guid: guid,
//             time: Date.now()
//         });

//         await threadDBClient.update(UsersCollection, user._id, user);
//         const community = await threadDBClient.getByID(CommunitiesCollection, user.communityID) as Community;
//         return `https://distributed.town/community/invite?communityId=${community._id}&communityName=${encodeURIComponent(community.name)}`;
//     } else {
//         return undefined;
//     }

// }