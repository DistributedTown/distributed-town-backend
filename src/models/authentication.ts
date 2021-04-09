
export interface Authentication {
	_id: string;
    address: string;
    isAuthenticated: boolean;
}


export const authenticationSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#", 
	"$id": "https://example.com/object1612283285.json", 
	"title": "Root", 
	"type": "object",
	"required": [
		"_id",
		"address",
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
		"address": {
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
        }
	}
}

