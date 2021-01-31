import { PublicKey, Where } from '@textile/hub';
import { getCommunityMembers, storeSkillWallet } from '../skillWallet/skillWallet.client';
import {
    CommunitiesCollection,
    GigsCollection,
    GeneralSkillsCollection
} from '../constants/constants';
import { Community, CreateCommunity, SkillsCategory, User } from '../models';
import threadDBClient from '../threaddb.config';
 import { updateCommunityID } from './user.service';

export async function getCommunityByID(communityID: string) {
    const community = (await threadDBClient.getByID(CommunitiesCollection, communityID)) as Community;
    const gigsPerCommunityQuery = new Where('communityID').eq(communityID).and('status').ne(4);
    const communityPrivKey = await threadDBClient.getCommunityPrivKey(communityID);
    const openGigs = (await threadDBClient.filter(GigsCollection, gigsPerCommunityQuery, communityPrivKey.privKey, communityPrivKey.threadID));
    const members = await getCommunityMembers(communityID);
    return { ...community, members: members.length, openGigs: openGigs.length }

}

export async function updateScarcityScore(communityID: string): Promise<void> {
    const community = (await threadDBClient.getByID(CommunitiesCollection, communityID)) as Community;
    const usersPerCommunity = await getCommunityMembers(communityID);
    const userSkills = usersPerCommunity.flatMap(user => user.skillWallet.map(skill => skill.skill));
    const totalSkills = [... new Set(userSkills)];
    const totalSkillsCount = totalSkills.length;
    const filledMemberSlots = usersPerCommunity.length;
    let uniqueSkills = 0;

    const skillsQuery = new Where('main').eq(community.category);
    const communitySkills = (await threadDBClient.filter(GeneralSkillsCollection, skillsQuery)) as SkillsCategory[];
    const comSkillsFlatMap = communitySkills[0].categories.flatMap(cat => cat.skills);
    comSkillsFlatMap.forEach(comSkill => {
        if (userSkills.includes(comSkill))
            uniqueSkills++;
    });

    const varietyCoefficient = (uniqueSkills / totalSkillsCount) * (filledMemberSlots / 2)
    community.scarcityScore = Math.floor(varietyCoefficient * 100);
    await threadDBClient.update(CommunitiesCollection, communityID, community);

    if (community.scarcityScore < 48) {
        // signal(community);
        console.log('send signal');
    }
}

export async function getCommunities(blockchain: string, category: string) {
    let communities = [];
    if (category) {
        const communitiesQuery = new Where('category').eq(category);
        communities = await threadDBClient.filter(CommunitiesCollection, communitiesQuery) as Community[];
    } else {
        communities = await threadDBClient.getAll(CommunitiesCollection) as Community[];
    }
    const blockchainCommunities = communities.filter(c => c.addresses.findIndex(a => a.blockchain === blockchain) >= 0);
    return await Promise.all(blockchainCommunities.map(async com => {
        return {
            _id: com._id,
            scarcityScore: com.scarcityScore,
            category: com.category,
            name: com.name,
            address: com.addresses.find(a => a.blockchain == blockchain).address,
            members: (await getCommunityMembers(com._id)).length
        }
    }));
}

export async function signal(community: Community) {
    const comFilter = new Where('category').eq(community.category).and('_id').ne(community._id);
    const communities = (await threadDBClient.filter(CommunitiesCollection, comFilter)) as Community[];
    const comKey = await threadDBClient.getCommunityPrivKey(community._id);

    const message = `Community ${community.name} needs you help. If you want to join follow the link ..`
    communities.forEach(async community => {
        const pubKey = PublicKey.fromString(community.pubKey)
        await threadDBClient.sendMessage(comKey.privKey, pubKey, message);
    })
}

export async function createCommunity(ownerSkillWalletID: string, community: CreateCommunity): Promise<any> {
    let ownerID: string = undefined;

    const communityModel: Community = {
        scarcityScore: 0,
        category: community.category,
        addresses: community.addresses,
        name: community.name,
    } as Community;

    const communityID = await threadDBClient.createCommunity(communityModel);

    if (!community.ownerID) {
        const skillWalletID = await storeSkillWallet({
            _id: undefined,
            username: community.owner.username,
            communityID: communityID,
            skillWallet: community.owner.skillWallet
        });
        ownerID = skillWalletID;
    } else {
        ownerID = community.ownerID;
        await updateCommunityID(ownerSkillWalletID, communityID);
    }

    const newCommunity = await threadDBClient.getByID(CommunitiesCollection, communityID) as Community;
    newCommunity.owner = ownerID;
    await threadDBClient.update(CommunitiesCollection, newCommunity._id, newCommunity);

    return { 
        communityID: communityID,
        skillWalletID: ownerID
    };

}