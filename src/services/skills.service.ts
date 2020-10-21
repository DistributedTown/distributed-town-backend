import { GeneralSkillsCollection } from "../constants/constants";
import { User, SkillsCategory, UserSkill } from "../models";
import threadDBClient from "../threaddb.config";

export async function calculateInitialCreditsAmount(user: User): Promise<number> {
    const skillsCredits = await getCreditsBySkill(user.skills);
    return 2000 + skillsCredits;
}

async function getCreditsBySkill(userSkills: UserSkill[]): Promise<number> {
    let credits = 0;
    const skillsTree = (await threadDBClient.getAll(GeneralSkillsCollection)) as SkillsCategory[];
    userSkills.forEach(us => {
        skillsTree.forEach(root => {
            root.categories.forEach(cat => {
                const sk = cat.skills.find(s => s == us.skill);
                if (sk) {
                    credits += cat.credits * us.level;
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

export async function getAllSkills(): Promise<string[]> {
    const generalSkills = (await threadDBClient.getAll(GeneralSkillsCollection)) as SkillsCategory[];
    const skills = generalSkills.flatMap(gs => gs.categories.flatMap(s => s.skills));
    return skills;
}