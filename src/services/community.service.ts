import { PublicKey, Where } from '@textile/hub';
import {
    CommunitiesCollection,
    UsersCollection,
    GigsCollection,
    GeneralSkillsCollection
} from '../constants/constants';
import { Community, CreateCommunity, SkillsCategory, User } from '../models';
import threadDBClient from '../threaddb.config';
import { fillUserData, updateCommunityID } from './user.service';

export async function getCommunityByID(communityID: string) {
    const community = (await threadDBClient.getByID(CommunitiesCollection, communityID)) as Community;
    const gigsPerCommunityQuery = new Where('communityID').eq(communityID).and('isOpen').eq(true);
    const communityPrivKey = await threadDBClient.getCommunityPrivKey(communityID);
    const openGigs = (await threadDBClient.filter(GigsCollection, gigsPerCommunityQuery, communityPrivKey.privKey, communityPrivKey.threadID));
    const members = await getCommunityMembers(communityID);
    return { ...community, members: members.length, openGigs: openGigs.length }

}

export async function updateScarcityScore(communityID: string): Promise<void> {
    const community = (await threadDBClient.getByID(CommunitiesCollection, communityID)) as Community;
    const usersPerCommunity = await getCommunityMembers(communityID);
    const userSkills = usersPerCommunity.flatMap(user => user.skills.map(skill => skill.skill));
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

    const varietyCoefficient = (uniqueSkills / totalSkillsCount) * (filledMemberSlots / 4)
    community.scarcityScore = Math.floor(varietyCoefficient * 100) - 20;
    await threadDBClient.update(CommunitiesCollection, communityID, community);

    if (community.scarcityScore < 48) {
        signal(community);
    }
}

export async function getCommunityMembers(communityID: string): Promise<User[]> {
    const users = await threadDBClient.getAll(UsersCollection) as User[];
    return users.filter(u => u.communityID && u.communityID === communityID);
}

export async function getCommunities(blockchain: string) {
    const communities = (await threadDBClient.getAll(CommunitiesCollection)) as Community[];
    return await Promise.all(communities.map(async com => {
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

export async function createCommunity(ownerEmail: string, community: CreateCommunity) {
    let ownerID: string = undefined;

    const communityModel: Community = {
        scarcityScore: 0,
        category: community.category, 
        addresses: community.addresses,
        name: community.name,
    } as Community;

    const communityID = await threadDBClient.createCommunity(communityModel);

    if(!community.ownerID) {
        community.owner.communityID = communityID;
        const owner = await fillUserData(ownerEmail, community.owner);
        ownerID = owner.userID;
    } else {
        ownerID = community.ownerID;
        await updateCommunityID(ownerEmail, communityID);
    }
    
    const newCommunity = await threadDBClient.getByID(CommunitiesCollection, communityID) as Community;
    newCommunity.owner = ownerID;
    await threadDBClient.update(CommunitiesCollection, newCommunity._id, newCommunity);
    
    return communityID;

}