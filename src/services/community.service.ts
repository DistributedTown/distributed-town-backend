import { PublicKey, Where } from '@textile/hub';
import {
    CommunitiesCollection,
    UsersCollection,
    GigsCollection,
    GeneralSkillsCollection
} from '../constants/constants';
import { Community, SkillsCategory, User } from '../models';
import threadDBClient from '../threaddb.config';

// fixed all

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
    const usersPerCommuntiyQuery = new Where('communityID').eq(communityID);
    const usersPerCommunity = (await threadDBClient.filter(UsersCollection, usersPerCommuntiyQuery)) as User[];
    return usersPerCommunity;
}


export async function getCommunities() {
    const communities = await threadDBClient.getAll(CommunitiesCollection)
    return communities;
}

export async function signal(community: Community) {
    // const query = new Where('category').eq(community.category);
    const communities = (await threadDBClient.filter(CommunitiesCollection, {})) as Community[];
    const comKey = await threadDBClient.getCommunityPrivKey(community._id);

    const message = `Community ${community.name} needs you help. If you want to join follow the link ..`
    communities.forEach(async community => {
        const pubKey = PublicKey.fromString(community.pubKey)
        await threadDBClient.sendMessage(comKey.privKey, pubKey, message);
    })
}