
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


export interface Authentication {
	_id: string;
	uniqueString: string;
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
		"uniqueString": {
			"$id": "#root/address", 
			"title": "address", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
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
