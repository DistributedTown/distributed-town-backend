
export interface PendingActivation {
	_id: string;
	tokenId: string;
}


export const pendingActivationSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "https://example.com/object1612283285.json",
	"title": "Root",
	"type": "object",
	"required": [
		"_id",
		"tokenId"
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
		"tokenId": {
			"$id": "#root/address",
			"title": "tokenId",
			"type": "string",
			"default": "",
			"examples": [
				"0x.."
			],
		}
	}
}