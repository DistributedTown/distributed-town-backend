/**
 * @swagger
 * definitions:
 *  CreateGig:
 *      type: object
 *      required:
 *          - userID
 *          - title
 *          - description
 *          - skills
 *          - creditsOffered
 *      properties:
 *            userID:
 *              type: string
 *            title:
 *              type: string
 *            description:
 *              type: string
 *            skills:
 *               type: array
 *               items:
 *                 type: string
 *            creditsOffered:
 *              type: number
 */
export interface Gig {
    _id: string;
    userID: string;
    takerUserID: string;
    title: string;
    description: string;
    creditsOffered: number;
    status: GigStatus;
    communityID: string;
    isProject: boolean;
    skills: string[];
    isRated: boolean;
}

export enum GigStatus {
  Open, 
  TakenNotAccepted, 
  TakenAccepted,
  Completed
}



/**
 * @swagger
 * definitions:
 *  RateGig:
 *      type: object
 *      required:
 *          - rate
 *      properties:
 *            rate:
 *              type: number
 */
export interface RateGig {
  rate: number;
}


export const gigSchema = {
    title: 'Gig',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      userID: { type: 'string' },
      acceptedUserID: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      creditsOffered: { type: 'number' },
      isOpen: { type: 'boolean' },
      isProject: { type: 'boolean' },
      communityID: { type: 'string' },
      skills: { type: 'array', items: {
        type: 'string'
      } },
    },
  }