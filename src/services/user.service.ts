import threadDBClient from "../threaddb.config";
import { CreateUser, ValidationResponseModel } from "../models";
import { OrganizationsCollection, UsersCollection } from "../constants/constants";
import { Where } from "@textile/hub";

export async function validateUser(user: CreateUser): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    if(!user.username){
        response.isValid = false;
        response.message = 'Username is required field';
        return response;
    } 
    if(!user.organizationId) {
        response.isValid = false;
        response.message = 'Organization is required field';
        return response;
    }
    const organization = await threadDBClient.getByID(OrganizationsCollection, user.organizationId)
    if(!organization) {
        response.isValid = false;
        response.message = 'Organization not found';
        return response;
    }

    const query = new Where('organizationId').eq(user.organizationId);
    const organizationMembers = await threadDBClient.filter(UsersCollection, query);
    if(organizationMembers.length >= 24) {
        response.isValid = false;
        response.message = 'Organization cannot exceed 24 members';
        return response;
    }

    return response;
}