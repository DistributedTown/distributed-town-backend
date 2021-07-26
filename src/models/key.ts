export interface PartnerKey { 
    key: string; 
    communityAddress: string;
    partnersAgreementAddress: string;
}


export const partnersKeySchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#", 
	"$id": "https://example.com/object1612283285.json", 
	"title": "Root", 
	"type": "object",
	"required": [
		"_id",
		"key",
        "communityAddress",
        "partnersAgreementAddress"
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
        "communityAddress": {
			"$id": "#root/type", 
			"title": "Type", 
			"type": "string",
			"examples": [
				"0x12"
			],
			"default": ""
		},
		"partnersAgreementAddress": {
			"$id": "#root/title", 
			"title": "title", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
		}
	}
}