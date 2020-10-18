import { Where } from '@textile/hub';
import {
    CommunitiesCollection,
    UsersCollection,
    GigsCollection
} from '../constants/constants';
import { Community, User } from '../models';
import threadDBClient from '../threaddb.config';

export async function getCommunityByID(communityID: string) {
    const community = (await threadDBClient.getByID(CommunitiesCollection, communityID)) as Community;

    const gigsPerCommunityQuery = new Where('communityID').eq(communityID).and('isOpen').eq(true);
    const openGigs = (await threadDBClient.filter(GigsCollection, gigsPerCommunityQuery));
    const members = await getCommunityMembers(communityID);
    return { ...community, members: members.length, openGigs: openGigs.length }

}

/*
scarcity score = (USk / ToSk) * (fMSl/4)
- USk = Unique Skills --> check how many numbers (skills) in the skill-set [1, 12] appear at least once (max. is 12, cause they are counted only the first time)
const uniqueSkills = 0;
- ToSk = Total Skills --> All the skills available in the community, repeated ones as well. 
    Min. = 6 (6 members, 1 skill each)
    Max. = 72 (24 members, 3 skills each)
- fMSl = Filled Member Slots --> how many members are in a community (min. 6, max. 24)
*/

// export async function updateScarcityScore(communityID: string): Promise<void> {

//     const community = (await threadDBClient.getByID(CommunitiesCollection, communityID)) as Community;

//     const usersPerCommunity = await getCommunityMembers(communityID);
//     const userSkills = usersPerCommunity.flatMap(user => user.skills.map(skill => skill.skill));
//     const totalSkills = [... new Set(userSkills)];
//     const totalSkillsCount = totalSkills.length;
//     const filledMemberSlots = usersPerCommunity.length;
//     let uniqueSkills = 0;

//     const skillCategoriesQuery = new Where('category').eq(community.category);
//     const skillCategories = ((await threadDBClient.filter(SubcategoriesCollection, skillCategoriesQuery)) as Subcategory[]).map(subCat => subCat.name);

//     totalSkills.forEach(async userSkill => {
//         const skillCategoriesQuery = new Where('name').eq(userSkill);
//         const skill = (await threadDBClient.filter(SkillsCollection, skillCategoriesQuery))[0] as Skill;
//         if (skillCategories.includes(skill.subcategory)) {
//             uniqueSkills++;
//         }
//     })

//     console.log('unique skills ', uniqueSkills);
//     console.log('totalSkillsCount ', totalSkillsCount);
//     console.log('filledMemberSlots ', filledMemberSlots);

//     const scarcityScore = (uniqueSkills / totalSkillsCount) * (filledMemberSlots / 4);
//     community.scarcityScore = 70;
//     await threadDBClient.update(CommunitiesCollection, communityID, community);
// }

export async function getCommunityMembers(communityID: string): Promise<User[]> {
    const usersPerCommuntiyQuery = new Where('communityID').eq(communityID);
    const usersPerCommunity = (await threadDBClient.filter(UsersCollection, usersPerCommuntiyQuery)) as User[];
    return usersPerCommunity;
}