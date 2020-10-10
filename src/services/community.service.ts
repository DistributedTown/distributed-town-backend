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