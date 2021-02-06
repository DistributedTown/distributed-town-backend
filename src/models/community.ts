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
  owner: string;
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
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#", 
	"$id": "https://example.com/object1612282712.json", 
	"title": "Root", 
	"type": "object",
	"required": [
		"_id",
		"scarcityScore",
		"category",
		"name",
		"addresses",
		"pubKey",
		"owner"
	],
	"properties": {
		"_id": {
			"$id": "#root/_id", 
			"title": "_id", 
			"type": "string",
			"default": "",
			"examples": [
				"01ewbt5sq6av58ez2bzpzz0ap2"
			],
			"pattern": "^.*$"
		},
		"scarcityScore": {
			"$id": "#root/scarcityScore", 
			"title": "Scarcityscore", 
			"type": "integer",
			"examples": [
				200
			],
			"default": 0
		},
		"category": {
			"$id": "#root/category", 
			"title": "Category", 
			"type": "string",
			"default": "",
			"examples": [
				"Art & Lifestyle"
			],
			"pattern": "^.*$"
		},
		"name": {
			"$id": "#root/name", 
			"title": "Name", 
			"type": "string",
			"default": "",
			"examples": [
				"Art 1"
			],
			"pattern": "^.*$"
		},
		"addresses": {
			"$id": "#root/addresses", 
			"title": "Addresses", 
			"type": "array",
			"default": [],
			"items":{
				"$id": "#root/addresses/items", 
				"title": "Items", 
				"type": "object",
				"required": [
					"address",
					"blockchain"
				],
				"properties": {
					"address": {
						"$id": "#root/addresses/items/address", 
						"title": "Address", 
						"type": "string",
						"default": "",
						"examples": [
							"0x04CB77f918B08876F065939FF1cA55b19489b255"
						],
						"pattern": "^.*$"
					},
					"blockchain": {
						"$id": "#root/addresses/items/blockchain", 
						"title": "Blockchain", 
						"type": "string",
						"default": "",
						"examples": [
							"ASD"
						],
						"pattern": "^.*$"
					}
				}
			}

		},
		"pubKey": {
			"$id": "#root/pubKey", 
			"title": "Pubkey", 
			"type": "string",
			"default": "",
			"examples": [
				"asd"
			],
			"pattern": "^.*$"
		},
		"owner": {
			"$id": "#root/owner", 
			"title": "Owner", 
			"type": "string",
			"default": "",
			"examples": [
				"asd"
			],
			"pattern": "^.*$"
		}
	}
}

export const communityKeySchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#", 
	"$id": "https://example.com/object1612282814.json", 
	"title": "Root", 
	"type": "object",
	"required": [
		"_id",
		"communityID",
		"privKey",
		"threadID"
	],
	"properties": {
		"_id": {
			"$id": "#root/_id", 
			"title": "_id", 
			"type": "string",
			"default": "",
			"examples": [
				"01ewbt5sq6av58ez2bzpzz0ap2"
			],
			"pattern": "^.*$"
		},
		"communityID": {
			"$id": "#root/communityID", 
			"title": "Communityid", 
			"type": "string",
			"default": "",
			"examples": [
				"01ewbt5sq6av58ez2bzpzz0ap2"
			],
			"pattern": "^.*$"
		},
		"privKey": {
			"$id": "#root/privKey", 
			"title": "Privkey", 
			"type": "string",
			"default": "",
			"examples": [
				"asdadasda"
			],
			"pattern": "^.*$"
		},
		"threadID": {
			"$id": "#root/threadID", 
			"title": "Threadid", 
			"type": "string",
			"default": "",
			"examples": [
				"asdadasasd"
			],
			"pattern": "^.*$"
		}
	}
}
