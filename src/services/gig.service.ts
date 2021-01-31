import { Gig, ValidationResponseModel, User, GigStatus } from '../models';
import { GigsCollection } from '../constants/constants';
import threadDBClient from '../threaddb.config';
import { Where } from '@textile/hub';
import { getCommunityMembers, getSkillWalletByID } from '../skillWallet/skillWallet.client';

export async function getGigs(skillWalletID: string, isOpen: boolean, isProject: boolean) {
    const user = await getSkillWalletByID(skillWalletID);
    const communityKey = await threadDBClient.getCommunityPrivKey(user.communityID);
    if (isOpen) {
        const skills = user.skillWallet.map(us => us.skill);
        const gigQuery = new Where('status').eq(0).and('isProject').eq(isProject).and('communityID').eq(user.communityID);
        const openGigs = (await threadDBClient.filter(GigsCollection, gigQuery, communityKey.privKey, communityKey.threadID)) as Gig[];
        return openGigs.filter(gig => gig.skills.every(skill => skills.includes(skill)));
    } else {
        const gigQuery = new Where('status').ne(0).and('isProject').eq(isProject).and('communityID').eq(user.communityID).and('takerUserID').eq(user._id);
        const completedGigs = (await threadDBClient.filter(GigsCollection, gigQuery, communityKey.privKey, communityKey.threadID)) as Gig[];
        return completedGigs;
    }
}
export async function takeGig(gigID: string, takerSkillWalletID: string): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    const user = await getSkillWalletByID(takerSkillWalletID);
    const communityKeys = await threadDBClient.getCommunityPrivKey(user.communityID);
    const gig = await threadDBClient.getByID(GigsCollection, gigID, communityKeys.privKey, communityKeys.threadID) as Gig;
    const gigTyped = gig as Gig;
    if (gigTyped.status !== GigStatus.Open) {
        response.isValid = false;
        response.message = 'The gig has already been taken.'
    } else if (!gig.skills.every(gigSkill => user.skillWallet.findIndex(us => us.skill === gigSkill) !== -1)) {
        response.isValid = false;
        response.message = 'The gig taker does not have the needed skills.'
    } else {
        gig.status = GigStatus.TakenNotAccepted;
        gig.takerUserID = user._id;
        await threadDBClient.save(GigsCollection, [gig], communityKeys.privKey, communityKeys.threadID);
    }
    return response;
}


export async function startGig(gigID: string, takerID: string, creatorID: string): Promise<ValidationResponseModel> {
    const response: ValidationResponseModel = { isValid: true };
    const creator = await getSkillWalletByID(creatorID);
    const communityKeys = await threadDBClient.getCommunityPrivKey(creator.communityID);
    let gig = await threadDBClient.getByID(GigsCollection, gigID, communityKeys.privKey, communityKeys.threadID) as Gig;
    if (gig.status !== GigStatus.TakenNotAccepted) {
        response.isValid = false;
        response.message = 'Gig is not yet taken';
    } else if (gig.userID !== creatorID) {
        response.isValid = false;
        response.message = 'Only the creator can start the gig';
    } else if (gig.takerUserID !== takerID) {
        response.isValid = false;
        response.message = 'The taker has not requested this gig';
    } else {
        gig.status = GigStatus.TakenAccepted;
        await threadDBClient.save(GigsCollection, [gig], communityKeys.privKey, communityKeys.threadID);
    }
    return response;
}

export async function submitGig(gigID: string, takerSkillWalletID: string): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    const taker = await getSkillWalletByID(takerSkillWalletID);

    const communityKeys = await threadDBClient.getCommunityPrivKey(taker.communityID);
    let gig = await threadDBClient.getByID(GigsCollection, gigID, communityKeys.privKey, communityKeys.threadID) as Gig;
    if (gig.status !== GigStatus.TakenAccepted) {
        response.isValid = false;
        response.message = 'Gig is not yet taken';
    } else if (gig.takerUserID !== taker._id) {
        response.isValid = false;
        response.message = 'Only the taker can submit the gig.';
    } else {
        gig.status = GigStatus.Submited;
        await threadDBClient.save(GigsCollection, [gig], communityKeys.privKey, communityKeys.threadID);
    }
    return response;
}


export async function completeGig(gigID: string, creatorID: string): Promise<ValidationResponseModel> {
    const response: ValidationResponseModel = { isValid: true };
    const creator = await getSkillWalletByID(creatorID);
    const communityKeys = await threadDBClient.getCommunityPrivKey(creator.communityID);
    let gig = await threadDBClient.getByID(GigsCollection, gigID, communityKeys.privKey, communityKeys.threadID) as Gig;
    if (gig.status !== GigStatus.Submited) {
        response.isValid = false;
        response.message = 'Gig is not submited by the taker';
    } else if (gig.userID !== creatorID) {
        response.isValid = false;
        response.message = 'Only the creator can complete the gig';
    } else {
        gig.status = GigStatus.Completed;
        await threadDBClient.save(GigsCollection, [gig], communityKeys.privKey, communityKeys.threadID);
    }
    return response;
}

export async function validateGig(gig: Gig, skillWalletID: string): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    const user = await getSkillWalletByID(skillWalletID);

    const communityMembers = await getCommunityMembers(user.communityID);
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

export async function createGig(skillWalletID: string, gig: Gig): Promise<string> {
    const user = await getSkillWalletByID(skillWalletID);
    gig.communityID = user.communityID;
    gig.userID = user._id;
    gig.isRated = false;
    gig.status = GigStatus.Open;
    const communityKeys = await threadDBClient.getCommunityPrivKey(user.communityID);
    const inserted = await threadDBClient.insert(GigsCollection, gig, communityKeys.privKey, communityKeys.threadID);
    return inserted[0];
}

// export async function rateGig(gigCreatorSkillWalletID: string, gigID: string, rate: number) {
//     const user = await getSkillWalletByID(gigCreatorSkillWalletID);
//     const communityKeys = await threadDBClient.getCommunityPrivKey(user.communityID);
//     const gig = (await threadDBClient.getByID(GigsCollection, gigID, communityKeys.privKey, communityKeys.threadID)) as Gig;
//     const skills = gig.skills;
//     for (const userSkill of user.skillWallet) {
//         if (skills.includes(userSkill.skill)) {
//             if (!userSkill.rates)
//                 userSkill.rates = [];
//             userSkill.rates.push(rate);
//             if (userSkill.rates.length >= 5) {
//                 userSkill.level = Math.round(userSkill.rates.reduce((a, b) => a + b) / userSkill.rates.length);
//             }
//         }
//     }

//     gig.isRated = true;
//     await threadDBClient.update(GigsCollection, gig._id, gig, communityKeys.privKey, communityKeys.threadID);
//     await threadDBClient.update(UsersCollection, user._id, user);
// }
export async function getGigsToRate(skillWalletID: string): Promise<Gig[]> {
    const user = await getSkillWalletByID(skillWalletID);
    const communityKeys = await threadDBClient.getCommunityPrivKey(user.communityID);

    const gigQuery = new Where('userID').eq(user._id).and('isRated').eq(false).and(status).eq(4);
    const gigsToRate = (await threadDBClient.filter(GigsCollection, gigQuery, communityKeys.privKey, communityKeys.threadID)) as Gig[];
    return gigsToRate;
}
