export interface Project {
    _id: string;
    gigs: string[];
    title: string;
    description: string;
    owner: string;
}

export interface ProjectsViewModel {
    title: string;
    description: string;
	skillsNeeded: string;
	fundsNeeded: number;
}

export const projectSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#", 
	"$id": "https://example.com/object1612462505.json", 
	"title": "Root", 
	"type": "object",
	"required": [
		"_id",
		"gigs",
		"title",
		"description",
		"owner"
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
		"gigs": {
			"$id": "#root/gigs", 
			"title": "Gigs", 
			"type": "array",
			"default": [],
			"items":{
				"$id": "#root/gigs/items", 
				"title": "Items", 
				"type": "string",
				"default": "",
				"examples": [
					"asd"
				],
				"pattern": "^.*$"
			}
		},
		"title": {
			"$id": "#root/title", 
			"title": "Title", 
			"type": "string",
			"default": "",
			"examples": [
				"asd"
			],
			"pattern": "^.*$"
		},
		"description": {
			"$id": "#root/description", 
			"title": "Description", 
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
