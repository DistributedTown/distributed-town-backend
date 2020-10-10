/**
 * @swagger
 * definitions:
 *  CreateGig:
 *      type: object
 *      required:
 *          - userID
 *          - title
 *          - description
 *          - skillCategories
 *          - creditsOffered
 *      properties:
 *            userID:
 *              type: string
 *            title:
 *              type: string
 *            description:
 *              type: string
 *            skillCategories:
 *              type: object
 *            creditsOffered:
 *              type: number
 */
export interface Gig {
    userID: string;
    title: string;
    description: string;
    skillCategories: {
        category: string; 
        skills: string[];
    }
    creditsOffered: number;
}