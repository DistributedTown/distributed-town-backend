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
    acceptedUserID: string;
    title: string;
    description: string;
    creditsOffered: number;
    isOpen: boolean;
    communityID: string;
    isProject: boolean;
    skills: string[];
    isRated: boolean;
}

/**
 * @swagger
 * definitions:
 *  AcceptGig:
 *      type: object
 *      required:
 *          - userID
 *      properties:
 *            userID:
 *              type: string
 */
export interface AcceptGig {
  userID: string;
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