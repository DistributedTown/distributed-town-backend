/**
 * @swagger
 * definitions:
 *  CreateUser:
 *      type: object
 *      required:
 *          - name
 *          - balance
 *      properties:
 *            name:
 *              type: string
 *            balance:
 *              type: string
 */
export interface CreateUser {
    username: string;
    organizationId: string;
    skillCategories: SkillCategories[];
}

/**
 * @swagger
 * definitions:
 *  SkillCategories:
 *      type: object
 *      required:
 *          - category
 *          - skills
 *      properties:
 *            name:
 *              type: string
 *            balance:
 *              type: array
 *              items:
 *                type: object
 */
export interface SkillCategories {
    category: string;
    skills: UserSkill[];
};

/**
 * @swagger
 * definitions:
 *  UserSkill:
 *      type: object
 *      required:
 *          - skill
 *          - level
 *      properties:
 *            skill:
 *              type: string
 *            level:
 *              type: number
 */
export interface UserSkill {
    skill: string;
    level: number;
}