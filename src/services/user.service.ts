import threadDBClient from "../threaddb.config";
import { CreateUser, ValidationResponseModel } from "../models";
import { CommunitiesCollection, UsersCollection } from "../constants/constants";
import { Where } from "@textile/hub";

export async function validateUser(user: CreateUser): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    if(!user.username){
        response.isValid = false;
        response.message = 'Username is required field';
        return response;
    } 
    if(!user.communityId) {
        response.isValid = false;
        response.message = 'Community is required field';
        return response;
    }
    const community = await threadDBClient.getByID(CommunitiesCollection, user.communityId)
    if(!community) {
        response.isValid = false;
        response.message = 'Community not found';
        return response;
    }

    const query = new Where('communityId').eq(user.communityId);
    const communityMembers = await threadDBClient.filter(UsersCollection, query);
    if(communityMembers.length >= 24) {
        response.isValid = false;
        response.message = 'Community cannot exceed 24 members';
        return response;
    }

    return response;
}