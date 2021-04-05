import { Gig, ValidationResponseModel, GigStatus, Project, skillNames } from '../models';
import { GigsCollection, ProjectsCollection } from '../constants/constants';
import threadDBClient from '../threaddb.config';
import { Where } from '@textile/hub';
import { getGigStringForHashing, getHash } from '../utils/hash.service';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';

export async function getGigs(tokenId: number, isOpen: boolean) {
    const communityId = await SkillWalletContracts.getCurrentCommunity(tokenId);
    const skills = await SkillWalletContracts.getSkills(tokenId);
    const userSkills = [];
    userSkills.push(skillNames[skills.skill1.displayStringId]);
    if (skills.skill2)
        userSkills.push(skillNames[skills.skill2.displayStringId]);
    if (skills.skill3)
        userSkills.push(skillNames[skills.skill3.displayStringId]);

    if (isOpen) {
        const gigQuery = new Where('status').eq(0).and('communityID').eq(communityId);
        const openGigs = await threadDBClient.filter(GigsCollection, gigQuery) as Gig[];
        return openGigs.filter(gig => gig.skills.every(skill => userSkills.includes(skill)));
    } else {
        const gigQuery = new Where('status').ne(0).and('communityID').eq(communityId).and('takerUserID').eq(tokenId);
        const completedGigs = (await threadDBClient.filter(GigsCollection, gigQuery)) as Gig[];
        return completedGigs;
    }
}

export async function takeGig(gigID: string, takerSkillWalletID: number): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    const gig = await threadDBClient.getByID(GigsCollection, gigID) as Gig;
    const gigTyped = gig as Gig;
    if (gigTyped.status !== GigStatus.Open) {
        response.isValid = false;
        response.message = 'The gig has already been taken.'
    } 
    // else if (!gig.skills.every(gigSkill => user.skillWallet.findIndex(us => us.skill === gigSkill) !== -1)) {
    //     response.isValid = false;
    //     response.message = 'The gig taker does not have the needed skills.'
    // } 
    else {
        gig.status = GigStatus.TakenNotAccepted;
        gig.taker = takerSkillWalletID;
        await threadDBClient.save(GigsCollection, [gig]);
    }
    return response;
}

export async function startGig(gigID: string, takerID: number, creatorID: number): Promise<ValidationResponseModel> {
    const response: ValidationResponseModel = { isValid: true };
    // const creator = await getSkillWalletByID(creatorID);
    let gig = await threadDBClient.getByID(GigsCollection, gigID) as Gig;
    if (gig.status !== GigStatus.TakenNotAccepted) {
        response.isValid = false;
        response.message = 'Gig is not yet taken';
    } else if (gig.creator !== creatorID) {
        response.isValid = false;
        response.message = 'Only the creator can start the gig';
    } else if (gig.taker !== takerID) {
        response.isValid = false;
        response.message = 'The taker has not requested this gig';
    } else {
        gig.status = GigStatus.TakenAccepted;
        await threadDBClient.save(GigsCollection, [gig]);
    }
    return response;
}

export async function submitGig(gigID: string, takerSkillWalletID: number): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    let gig = await threadDBClient.getByID(GigsCollection, gigID) as Gig;
    if (gig.status !== GigStatus.TakenAccepted) {
        response.isValid = false;
        response.message = 'Gig is not yet taken';
    } else if (gig.taker !== takerSkillWalletID) {
        response.isValid = false;
        response.message = 'Only the taker can submit the gig.';
    } else {
        gig.status = GigStatus.Submited;
        await threadDBClient.save(GigsCollection, [gig]);
    }
    return response;
}

export async function completeGig(gigID: string, creatorID: number): Promise<ValidationResponseModel> {
    const response: ValidationResponseModel = { isValid: true };
    let gig = await threadDBClient.getByID(GigsCollection, gigID) as Gig;
    if (gig.status !== GigStatus.Submited) {
        response.isValid = false;
        response.message = 'Gig is not submited by the taker';
    } else if (gig.creator !== creatorID) {
        response.isValid = false;
        response.message = 'Only the creator can complete the gig';
    } else {
        gig.status = GigStatus.Completed;
        await threadDBClient.save(GigsCollection, [gig]);
    }
    return response;
}

export async function validateGig(gig: Gig, skillWalletID: number): Promise<ValidationResponseModel> {
    let response: ValidationResponseModel = { isValid: true }
    // const communityMembers = await getCommunityMembers(user.communityID);
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
    // else if (communityMembers.length < 3) {
    //     response.isValid = false;
    //     response.message = 'The community is not yet active.';
    // }
    return response;
};

export async function createGig(skillWalletID: number, gig: Gig): Promise<any> {
    let id = undefined;
    const communityAddress = await SkillWalletContracts.getCurrentCommunity(skillWalletID);
    if (gig.isProject) {
        const project: Project = {
            _id: undefined,
            gigs: [],
            title: gig.title,
            description: gig.description,
            owner: skillWalletID,
        };
        const inserted = await threadDBClient.insert(ProjectsCollection, project);
        id = inserted[0];
        return { id: id }
    } else {
        gig.communityID = communityAddress;
        gig.creator = skillWalletID;
        gig.isRated = false;
        gig.status = GigStatus.Open;
        gig.taker = 0;
        gig.hash = "";
        const inserted = await threadDBClient.insert(GigsCollection, gig);
        const gigID = inserted[0];
        const hashData = getGigStringForHashing(gigID, gig.communityID, gig.creator, gig.creditsOffered);
        gig.hash = getHash(JSON.stringify(hashData));
        threadDBClient.update(GigsCollection, gigID, gig);
        return {
            id: id,
            hash: '0x3664393134656463333665313464366338383063396335356264613562633034'
        }
    }

}

export async function validateHash(communityID: string, hash: string): Promise<boolean> {
    const query = new Where('hash').eq(hash);
    const gigs = await threadDBClient.filter(GigsCollection, query) as Gig[];
    const gig = gigs[0];
    const hashData = getGigStringForHashing(gig._id, gig.communityID, gig.creator, gig.creditsOffered);
    const generatedHash = getHash(JSON.stringify(hashData));
    return generatedHash === hash;
}

export async function getGigsToRate(skillWalletID: string): Promise<Gig[]> {
    const gigQuery = new Where('userID').eq(skillWalletID).and('isRated').eq(false).and(status).eq(4);
    const gigsToRate = await threadDBClient.filter(GigsCollection, gigQuery) as Gig[];
    return gigsToRate;
}

