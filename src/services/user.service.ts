import threadDBClient from "../threaddb.config";
import { User, ValidationResponseModel } from "../models";
import { CommunitiesCollection, UsersCollection } from "../constants/constants";
import { updateScarcityScore, getCommunityMembers } from "./community.service";
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
export async function fillUserData(issuer: string, user: User) {

    const query = new Where('issuer').eq(issuer);
    const existingUser = (await threadDBClient.filter(UsersCollection, query)) as any;
    user.issuer = existingUser.issuer;
    user.lastLoginAt = existingUser.lastLoginAt;

    // const inserted = await threadDBClient.insert(UsersCollection, user);
    await threadDBClient.update(UsersCollection, existingUser._id, user);
    const credits = await calculateInitialCreditsAmount(user);
    await updateScarcityScore(user.communityID);
    return { credits: credits, userID: existingUser._id };
}