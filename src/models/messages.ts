export enum MessageType {
    GigCreated,
    GigTaken,
    GigAccepted,
    GigCompleted,
	Reminder
}
export interface Message {
	_id: string;
    type: MessageType;
    title: string;
    message: string;
    skillWalletId: number;
	contactSkillWalletId?: number;
}


export const messagesSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#", 
	"$id": "https://example.com/object1612283285.json", 
	"title": "Root", 
	"type": "object",
	"required": [
		"_id",
		"type",
        "title",
        "message",
        "skillWalletId"
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
        "type": {
			"$id": "#root/type", 
			"title": "Type", 
			"type": "integer",
			"examples": [
				1
			],
			"default": 0
		},
		"title": {
			"$id": "#root/title", 
			"title": "title", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
		},
        "message": {
			"$id": "#root/message", 
			"title": "message", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
		},
        "skillWalletId": {
			"$id": "#root/skillWalletId", 
			"title": "skillWalletId", 
			"type": "integer",
			"examples": [
				1
			],
		},
		"contactSkillWalletId": {
			"$id": "#root/contactSkillWalletId", 
			"title": "contactSkillWalletId", 
			"type": "integer",
			"examples": [
				1
			],
		},
	}
}