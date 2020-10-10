import { Gig, ValidationResponseModel } from '../models';
import { GigsCollection, CommunitiesCollection } from '../constants/constants';
import threadDBClient from '../threaddb.config';

export async function acceptGig(gigID: string, acceptedUser: string) {
    let gig: any = await threadDBClient.getByID(GigsCollection, gigID);
    gig.isOpen = false;
    gig.acceptedUser = acceptedUser;
    await threadDBClient.save(GigsCollection, [gig]);
}
export async function validateAcceptingGig(gigID: string): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    const gig = await threadDBClient.getByID(GigsCollection, gigID);
    const gigTyped = gig as Gig;
    if (!gigTyped.isOpen) {
        response.isValid = false;
        response.message = 'The gig has already been accepted.'
    } 
    return response;
}
export async function validateGig(gig: Gig): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    if (!gig.title) {
        response.isValid = false;
        response.message = 'Title is required field';
    }
    else if (!gig.description) {
        response.isValid = false;
        response.message = 'Description is required field';
    }
    else if (gig.creditsOffered <= 0) {
        response.isValid = false;
        response.message = 'Credits offered should be greater than 0.';
    }
    else if (!gig.skills) {
        response.isValid = false;
        response.message = 'Skills should be selected.';
    }
    else if (gig.skills.length === 0) {
        response.isValid = false;
        response.message = 'Skills should be selected.';
    } else if (!gig.communityID) {
        response.isValid = false;
        response.message = 'CommunityID is required.';
    } else {
        const community = await threadDBClient.getByID(CommunitiesCollection, gig.communityID);
        if (!community) {
            response.isValid = false;
            response.message = 'Community not found.';
        }
    }
    return response;
};
