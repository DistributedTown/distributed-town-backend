
export interface SWActivation {
	_id: string;
	address: string;
	isActivated: boolean;
}


export const activationSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "https://example.com/object1612283285.json",
	"title": "Root",
	"type": "object",
	"required": [
		"_id",
		"tokenId",
		"isActivated"
	],
	"properties": {
		"_id": {
			"$id": "#root/_id",
			"title": "_id",
			"type": "string",
			"default": "",
			"examples": [
				"asd"
			],
			"pattern": "^.*$"
		},
		"address": {
			"$id": "#root/address",
			"title": "address",
			"type": "string",
			"default": "",
			"examples": [
				"0x.."
			],
		},
		"isActivated": {
			"$id": "#root/isActivated",
			"title": "isActivated",
			"type": "boolean",
			"examples": [
				false
			],
			"default": false
		}
	}
}

export enum Actions {
	ACTIVATE_SW,
	LOGIN,
	TAKE_GIG,
	COMPETE_GIG,
	ACCEPT_GIG
};

export interface Authentication {
	_id: string;
	nonce: number;
	action: Actions,
	isAuthenticated: boolean;
	tokenId?: number;
}


export const authenticationSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "https://example.com/object1612283285.json",
	"title": "Root",
	"type": "object",
	"required": [
		"_id",
		"uniqueString",
		"isAuthenticated"
	],
	"properties": {
		"_id": {
			"$id": "#root/_id",
			"title": "_id",
			"type": "string",
			"default": "",
			"examples": [
				"asd"
			],
			"pattern": "^.*$"
		},
		"nonce": {
			"$id": "#root/nonce",
			"title": "nonce",
			"type": "integer",
			"default": 1,
			"examples": [
				2, 2000
			],
		},
		"action": {
			"$id": "#root/action",
			"title": "action",
			"type": "integer",
			"default": 0,
			"examples": [
				1
			],
		},
		"isAuthenticated": {
			"$id": "#root/isAuthenticated",
			"title": "isAuthenticated",
			"type": "boolean",
			"examples": [
				false
			],
			"default": false
		},
		"tokenId": {
			"$id": "#root/tokenId",
			"title": "TokenId",
			"type": "integer",
			"examples": [
				1
			],
			"default": -1
		},
	}
}
