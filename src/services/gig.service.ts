import { Gig, ValidationResponseModel, User } from '../models';
import { GigsCollection, UsersCollection } from '../constants/constants';
import threadDBClient from '../threaddb.config';
import { Where } from '@textile/hub';

export async function getGigs(email: string, isOpen: boolean) {
    const query = new Where('email').eq(email);
    const user = (await threadDBClient.filter(UsersCollection, query))[0] as User;
    if (isOpen) {
        const skills = user.skills.map(us => us.skill);
        const gigQuery = new Where('isOpen').eq(isOpen).and('communityID').eq(user.communityID);
        const openGigs = (await threadDBClient.filter(GigsCollection, gigQuery)) as Gig[];
        return openGigs.filter(gig => gig.skills.every(skill => skills.includes(skill)));
    } else {
        const gigQuery = new Where('isOpen').eq(isOpen).and('communityID').eq(user.communityID).and('acceptedUserID').eq(user._id);
        const completedGigs = (await threadDBClient.filter(GigsCollection, gigQuery)) as Gig[];
        return completedGigs;
    }
}
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
    }
    return response;
};


export async function createGig(email: string, gig: Gig): Promise<string> {
    const query = new Where('email').eq(email);
    const user = (await threadDBClient.filter(UsersCollection, query)) as User[];
    gig.communityID = user[0].communityID;
    gig.userID = user[0]._id;
    const inserted = await threadDBClient.insert(GigsCollection, gig);
    return inserted[0];
}