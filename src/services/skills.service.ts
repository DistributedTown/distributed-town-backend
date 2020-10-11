import { SkillsCollection, SubcategoriesCollection } from "../constants/constants";
import { User, Skill, Subcategory } from "../models";
import threadDBClient from "../threaddb.config";

export async function calculateInitialCreditsAmount(user: User): Promise<number> {
    const subcategories = (await threadDBClient.getAll(SubcategoriesCollection)) as Subcategory[];
    const skills = (await threadDBClient.getAll(SkillsCollection)) as Skill[];

    let totalCredits = 2000;

    user.skills.forEach(userSkill => {
        const skill = skills.find(s => s.name === userSkill.skill);
        const subCat = subcategories.find(e => e.name === skill.subcategory);
        totalCredits +=  subCat.credits * userSkill.level;
    });

    return totalCredits;
}
