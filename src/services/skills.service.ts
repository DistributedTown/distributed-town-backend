import { Where } from "@textile/hub";
import { GeneralSkillsCollection } from "../constants/constants";
import { SkillsCategory, skillNames, Skill } from "../models";
import threadDBClient from "../threaddb.config";

export async function calculateInitialCreditsAmount(skills: Skill[]): Promise<number> {
    const skillsCredits = await getCreditsBySkill(skills);
    return 2000 + skillsCredits;
}

export async function getCreditsBySkill(skills: Skill[]): Promise<number> {
    let credits = 0;
    const skillsTree = (await threadDBClient.getAll(GeneralSkillsCollection)) as SkillsCategory[];
    skills.forEach(us => {
        skillsTree.forEach(root => {
            root.categories.forEach(cat => {
                const sk = cat.skills.find(s => s == us.name);
                if (sk) {
                    credits += cat.credits * us.value;
                }
            })
        });
    });
    return credits;
}


export async function findMainCat(skillName: string): Promise<SkillsCategory> {
    let mainCat: SkillsCategory = undefined;
    const generalSkills = (await threadDBClient.getAll(GeneralSkillsCollection)) as SkillsCategory[];
    generalSkills.forEach(gs => gs.categories.forEach(cat => {
        if (mainCat) return;
        const existing = cat.skills.find(s => s == skillName);
        if (existing) {
            mainCat = gs;
            return;
        }
    }));
    return mainCat;
}

export async function getByCategory(category: string): Promise<SkillsCategory> {
    const query = new Where('main').eq(category);
    const generalSkills = (await threadDBClient.filter(GeneralSkillsCollection, query)) as SkillsCategory[];
    return generalSkills[0];
}

export async function getAllSkills(): Promise<string[]> {
    return skillNames;
}