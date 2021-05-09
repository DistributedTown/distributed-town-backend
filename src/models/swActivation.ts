
export interface PendingActivation {
	_id: string;
	address: string;
}


export const pendingActivationSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "https://example.com/object1612283285.json",
	"title": "Root",
	"type": "object",
	"required": [
		"_id",
		"address"
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
		}
	}
}