import { SkillsCollection, SubcategoriesCollection } from "../constants/constants";
import { User, Skill, Subcategory } from "../models";
import threadDBClient from "../threaddb.config";

export async function calculateInitialCreditsAmount(user: User): Promise<number> {
    const subcategories: any[] = await threadDBClient.getAll(SubcategoriesCollection);
    const skills: any[] = await threadDBClient.getAll(SkillsCollection);
    const subcategoriesTyped = subcategories as Subcategory[];
    const skillsTyped = skills as Skill[];

    let totalCredits = 2000;

    user.skills.forEach(userSkill => {
        const skill = skillsTyped.find(s => s.name === userSkill.skill);
        const subCat = subcategoriesTyped.find(e => e.name === skill.subcategory);
        totalCredits +=  subCat.credits * userSkill.level;
    });

    return totalCredits;
}
