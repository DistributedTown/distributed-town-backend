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
    creator: number;
    taker: number;
    title: string;
    description: string;
    creditsOffered: number;
    status: GigStatus;
    communityID: string;
    isProject: boolean;
    skills: string[];
    isRated: boolean;
    hash: string;
}


export enum GigStatus {
  Open, 
  TakenNotAccepted, 
  TakenAccepted,
  Submited,
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
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#", 
	"$id": "https://example.com/object1612283285.json", 
	"title": "Root", 
	"type": "object",
	"required": [
		"_id",
		"creator",
		"taker",
		"title",
		"description",
		"creditsOffered",
		"status",
		"communityID",
		"isProject",
		"skills",
		"isRated",
		"hash"
	],
	"properties": {
		"_id": {
			"$id": "#root/_id", 
			"title": "_id", 
			"type": "string",
			"default": "",
			"examples": [
				"asdasd"
			],
		},
		"creator": {
			"$id": "#root/creator", 
			"title": "Creator", 
			"type": "integer",
			"default": "",
			"examples": [
				"string"
			],
		},
		"taker": {
			"$id": "#root/taker", 
			"title": "Taker", 
			"type": "integer",
			"default": "",
			"examples": [
				"string"
			],
		},
		"title": {
			"$id": "#root/title", 
			"title": "Title", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
			"pattern": "^.*$"
		},
		"description": {
			"$id": "#root/description", 
			"title": "Description", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
			"pattern": "^.*$"
		},
		"creditsOffered": {
			"$id": "#root/creditsOffered", 
			"title": "Creditsoffered", 
			"type": "integer",
			"examples": [
				12
			],
			"default": 0
		},
		"status": {
			"$id": "#root/status", 
			"title": "Status", 
			"type": "integer",
			"examples": [
				1
			],
			"default": 0
		},
		"communityID": {
			"$id": "#root/communityID", 
			"title": "Communityid", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
		},
		"isProject": {
			"$id": "#root/isProject", 
			"title": "Isproject", 
			"type": "boolean",
			"examples": [
				false
			],
			"default": false
		},
		"skills": {
			"$id": "#root/skills", 
			"title": "Skills", 
			"type": "array",
			"default": [],
			"items":{
				"$id": "#root/skills/items", 
				"title": "Items", 
				"type": "string",
				"default": "",
				"examples": [
					"teaching"
				],
			}
		},
		"isRated": {
			"$id": "#root/isRated", 
			"title": "Israted", 
			"type": "boolean",
			"examples": [
				false
			],
			"default": false
		},
		"hash": {
			"$id": "#root/hash", 
			"title": "Hash", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
		}
	}
}
