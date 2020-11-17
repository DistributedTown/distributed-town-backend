/**
 * @swagger
 * definitions:
 *  CreateUser:
 *      type: object
 *      required:
 *          - name
 *          - communityID
 *          - skills
 *      properties:
 *            name:
 *              type: string
 *            communityID:
 *              type: string
 *            skills:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/UserSkill'
 *                
 */
export interface User {
    _id: string;
    username: string;
    communityID: string;
    issuer: string;
    email: string;
    lastLoginAt: string;
    skills: UserSkill[];
    invites: Invite[];
}

export interface Invite {
    guid: string;
    time: number;
}

export const userSchema = {
    title: 'User',
    type: 'object',
    properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        communityID: { type: 'string' },
        skills: {
            type: 'array',
            items: { "$ref": "#/definitions/userSkill" }
        },
        issuer: 'string', 
        lastLoginAt: 'string'
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
    rates: number[];
}

/**
 * @swagger
 * definitions:
 *  ChangeCommunity:
 *      type: object
 *      required:
 *          - communityID
 *      properties:
 *            communityID:
 *              type: string
 */
export interface ChangeCommunity {
    communityID: string;
}