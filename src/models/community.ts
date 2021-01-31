import { SkillWallet } from "../skillWallet/skillWallet.client";
import { User } from "./user";

/**
 * @swagger
 * definitions:
 *  Community:
 *      type: object
 *      required:
 *          - category
 *          - name
 *      properties:
 *            category:
 *              type: string
 *            name:
 *              type: string
 */
export interface Community {
    _id: string;
    scarcityScore: number;
    category: string;
    addresses: CommunityAddress[];
    name: string;
    pubKey: string;
    owner: string;
}

/**
 * @swagger
 * definitions:
 *  CreateCommunity:
 *      type: object
 *      required:
 *          - category
 *          - name
 *          - owner
 *          - addresses
 *      properties:
 *            category:
 *              type: string
 *            name:
 *              type: string
 */
export interface CreateCommunity {
  _id: string;
  scarcityScore: number;
  category: string;
  addresses: CommunityAddress[];
  name: string;
  pubKey: string;
  owner: SkillWallet;
  ownerID: string;
}

/**
 * @swagger
 * definitions:
 *  CreateGig:
 *      type: object
 *      required:
 *          - address
 *          - blockchain
 *      properties:
 *            address:
 *              type: string
 *            blockchain:
 *              type: string
 */
export interface CommunityAddress {
  address: string;
  blockchain: string;
}
export interface CommunityKey {
  _id: string;
  communityID: string;
  threadID: string;
  privKey: string;
}

export const communitySchema = {
    title: 'Community',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      pubKey: { type: 'string' },
      category: { type: 'string' },
      name: { type: 'string' },
      address: { type: 'string' },
      scarcityScore: { type: 'integer' },
    },
  }