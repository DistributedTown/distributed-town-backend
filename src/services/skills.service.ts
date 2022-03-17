import { GeneralSkills } from "../constants/constants";
import { SkillsCategory, skillNames } from "../models";

export async function findMainCat(skillName: string): Promise<SkillsCategory> {
    let mainCat: SkillsCategory = undefined;
    GeneralSkills.forEach(gs => gs.categories.forEach(cat => {
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
    return GeneralSkills.find(coll => coll.main === category) as SkillsCategory;
}

export async function getAllSkills(): Promise<string[]> {
    return skillNames;
}