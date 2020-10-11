import { Where } from '@textile/hub';
import {
    SubcategoriesCollection,
    SkillsCollection,
    CommunitiesCollection,
    UsersCollection
} from '../constants/constants';
import { Skill, Subcategory } from '../models';
import threadDBClient from '../threaddb.config';

export async function getCommunitiesBySkill(skillName: string) {
    console.log(skillName);
    const skillsQuery = new Where('name').eq(skillName);
    const skills = await threadDBClient.filter(SkillsCollection, skillsQuery);
    console.log(skills);
    
    const skill = skills[0] as Skill;

    const subCatQuery = new Where('name').eq(skill.subcategory);
    const subCatRes = await threadDBClient.filter(SubcategoriesCollection, subCatQuery);
    const category = subCatRes[0] as Subcategory;
    const orgQuery = new Where('category').eq(category.category);
    const communities: any[] = await threadDBClient.filter(CommunitiesCollection, orgQuery);
    const result = communities.map(async org => {
        const membersQuery = new Where('communityId').eq(org._id);
        const members = await threadDBClient.filter(UsersCollection, membersQuery);
        return { ...org, members: members.length }
    });

    return Promise.all(result);

}

export async function calculateScarcityScore(communityID: string) {
// - USk = Unique Skills --> check how many numbers (skills) in the skill-set [1, 12] appear at least once (max. is 12, cause they are counted only the first time)

// - ToSk = Total Skills --> All the skills available in the community, repeated ones as well. 
// Min. = 6 (6 members, 1 skill each)
// Max. = 72 (24 members, 3 skills each)

// - fMSl = Filled Member Slots --> how many members are in a community (min. 6, max. 24)

// - 4 is taken by simplifying the formula in extended version, and it spares a few passages



}