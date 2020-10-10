import { SkillsCollection } from "../constants/constants";
import { CreateUser } from "../models";
import threadDBClient from "../threaddb.config";

export async function calculateInitialCreditsAmount(user: CreateUser) {
    const categories: any[] = await threadDBClient.getAll(SkillsCollection);
    let totalCredits = 2000; // joined community

    console.log(categories);
    user.skillCategories.forEach(category => {
        console.log('category: ', category);
        const credits = categories.find(e => e.category === category.category).credits;
        category.skills.forEach(skill => {
            totalCredits +=  credits * skill.level;
        })
    });

    return totalCredits;
}
