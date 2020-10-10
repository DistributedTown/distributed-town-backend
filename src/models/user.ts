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
    communityId: string;
    skills: UserSkill[];
}


export const userSchema = {
    title: 'User',
    type: 'object',
    properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        communityId: { type: 'string' },
        skills: {
            type: 'array',
            items: { "$ref": "#/definitions/userSkill" }
        },
    },
    definitions: {
        "userSkill": {
            type: "object",
            properties: {
                skill: { type: 'string' }, 
                level: { type: 'number' }
            }
        }
    }
}

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