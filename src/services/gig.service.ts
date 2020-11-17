import { Gig, ValidationResponseModel, User, CommunityKey, UserSkill, Community } from '../models';
import { CommunitiesCollection, GigsCollection, UsersCollection } from '../constants/constants';
import threadDBClient from '../threaddb.config';
import { Where } from '@textile/hub';
import { validateUser } from './user.service';
import { getCommunityMembers } from './community.service';

export async function getGigs(email: string, isOpen: boolean, isProject: boolean) {
    const userQuery = new Where('email').eq(email);
    const user = (await threadDBClient.filter(UsersCollection, userQuery))[0] as User;
    const communityKey = await threadDBClient.getCommunityPrivKey(user.communityID);
    if (isOpen) {
        const skills = user.skills.map(us => us.skill);
        const gigQuery = new Where('isOpen').eq(isOpen).and('isProject').eq(isProject).and('communityID').eq(user.communityID);
        const openGigs = (await threadDBClient.filter(GigsCollection, {}, communityKey.privKey, communityKey.threadID)) as Gig[];
        console.log(openGigs);
        return openGigs.filter(gig => gig.skills.every(skill => skills.includes(skill)));
    } else {
        const gigQuery = new Where('isOpen').eq(isOpen).and('isProject').eq(isProject).and('communityID').eq(user.communityID).and('acceptedUser').eq(user._id);
        const completedGigs = (await threadDBClient.filter(GigsCollection, gigQuery, communityKey.privKey, communityKey.threadID)) as Gig[];
        return completedGigs;
    }
}
export async function acceptGig(gigID: string, userEmail: string) {
    const userQuery = new Where('email').eq(userEmail);
    const user = (await threadDBClient.filter(UsersCollection, userQuery))[0] as User;
    const communityKeys = await threadDBClient.getCommunityPrivKey(user.communityID);
    let gig: any = await threadDBClient.getByID(GigsCollection, gigID, communityKeys.privKey, communityKeys.threadID);
    gig.isOpen = false;
    gig.acceptedUser = user._id;
    await threadDBClient.save(GigsCollection, [gig], communityKeys.privKey, communityKeys.threadID);
}
export async function validateAcceptingGig(gigID: string, userID: string): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    const user = (await threadDBClient.getByID(UsersCollection, userID)) as User;
    const communityKeys = await threadDBClient.getCommunityPrivKey(user.communityID);
    const gig = await threadDBClient.getByID(GigsCollection, gigID, communityKeys.privKey, communityKeys.threadID);
    const gigTyped = gig as Gig;
    if (!gigTyped.isOpen) {
        response.isValid = false;
        response.message = 'The gig has already been accepted.'
    }
    return response;
}
export async function validateGig(gig: Gig, userEmail: string): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    
    const user = await threadDBClient.filter(UsersCollection, new Where('email').eq(userEmail))[0] as User;
    const validUser = await validateUser(user)

    if(!validUser.isValid) {
        return validUser;
    }

    const communityMembers = await getCommunityMembers(gig.communityID);
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
    else if (communityMembers.length < 3) {
        response.isValid = false;
        response.message = 'The community is not yet active.';
    }
        return response;
};

export async function createGig(email: string, gig: Gig): Promise<string> {
    const query = new Where('email').eq(email);
    const user = (await threadDBClient.filter(UsersCollection, query))[0] as User;
    gig.communityID = user.communityID;
    gig.userID = user._id;
    gig.isRated = false;
    const communityKeys = await threadDBClient.getCommunityPrivKey(user.communityID);
    const inserted = await threadDBClient.insert(GigsCollection, gig, communityKeys.privKey, communityKeys.threadID);
    return inserted[0];
}

export async function rateGig(gigCreatorEmail: string, gigID: string, rate: number) {
    const query = new Where('email').eq(gigCreatorEmail);
    const user = (await threadDBClient.filter(UsersCollection, query))[0] as User;
    const communityKeys = await threadDBClient.getCommunityPrivKey(user.communityID);
    const gig = (await threadDBClient.getByID(GigsCollection, gigID, communityKeys.privKey, communityKeys.threadID)) as Gig;
    const skills = gig.skills;
    for (const userSkill of user.skills) {
        if (skills.includes(userSkill.skill)) {
            if (!userSkill.rates)
                userSkill.rates = [];
            userSkill.rates.push(rate);
            if (userSkill.rates.length >= 5) {
                userSkill.level = Math.round(userSkill.rates.reduce((a, b) => a + b) / userSkill.rates.length);
            }
        }
    }

    gig.isRated = true;
    await threadDBClient.update(GigsCollection, gig._id, gig, communityKeys.privKey, communityKeys.threadID);
    await threadDBClient.update(UsersCollection, user._id, user);
}
export async function getGigsToRate(email: string): Promise<Gig[]> {
    const query = new Where('email').eq(email);
    const user = (await threadDBClient.filter(UsersCollection, query))[0] as User;
    const communityKeys = await threadDBClient.getCommunityPrivKey(user.communityID);

    const gigQuery = new Where('userID').eq(user._id).and('isRated').eq(false).and('isOpen').eq(false);
    const gigsToRate = (await threadDBClient.filter(GigsCollection, gigQuery, communityKeys.privKey, communityKeys.threadID)) as Gig[];
    return gigsToRate;
}
