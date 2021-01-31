import { Client, createUserAuth, PrivateKey, QueryJSON, ThreadID, Where } from '@textile/hub'
import { interfaces } from 'inversify';

const skillWalletCollection = 'SkillWallet'

const keyInfo = {
	key: process.env.SKILL_WALLET_TEXTILE_KEY,
	secret: process.env.SKILL_WALLET_TEXTILE_SECRET
}

const skillWalletThreadID = ThreadID.fromString(process.env.SKILL_WALLET_TEXTILE_THREAD_ID);
const skillWalletPrivateKey = process.env.SKILL_WALLET_TEXTILE_PRIV_KEY

export async function initializeSkillWallet() {

	const userAuth = await auth(keyInfo);
	const client = Client.withUserAuth(userAuth);

	const identity = await PrivateKey.fromString(skillWalletPrivateKey);
	await client.getToken(identity)

	// await client.updateCollection(skillWalletThreadID, {
	// 	name: skillWalletCollection,
	// 	schema: DiToSkillWalletSchema
	// })
	// console.log('schema updated');

	// await client.getCollectionInfo(skillWalletThreadID, skillWalletCollection);
	// const skillWallets = await client.find(skillWalletThreadID, skillWalletCollection, {}) as SkillWallet[];
	// skillWallets.forEach((s) => { 
	// 	s.username = s._id
	// })
	// await client.save(skillWalletThreadID, skillWalletCollection, skillWallets)
	
	// const skillWalletsUpdated = await client.find(skillWalletThreadID, skillWalletCollection, {}) as SkillWallet[];
	// console.log(skillWalletsUpdated);

}

export async function getSkillWalletByID(id): Promise<SkillWallet> {
	const userAuth = await auth(keyInfo);
	const client = Client.withUserAuth(userAuth);
	const identity = await PrivateKey.fromString(skillWalletPrivateKey);
	await client.getToken(identity)

	return await client.findByID(skillWalletThreadID, skillWalletCollection, id);
}


export async function filter(query: QueryJSON): Promise<SkillWallet[]> {
	const userAuth = await auth(keyInfo);
	const client = Client.withUserAuth(userAuth);
	const identity = await PrivateKey.fromString(skillWalletPrivateKey);
	await client.getToken(identity)

	return await client.find(skillWalletThreadID, skillWalletCollection, query);
}


export async function getCommunityMembers(communityID: string): Promise<SkillWallet[]> {
	const userAuth = await auth(keyInfo);
	const client = Client.withUserAuth(userAuth);
	const identity = await PrivateKey.fromString(skillWalletPrivateKey);
	await client.getToken(identity)
	const query = new Where('communityID').eq(communityID);
	
	return await client.find(skillWalletThreadID, skillWalletCollection, query);
}

export async function storeSkillWallet(model: SkillWallet): Promise<string> {
	const userAuth = await auth(keyInfo);
	const client = Client.withUserAuth(userAuth);
	const identity = await PrivateKey.fromString(skillWalletPrivateKey);
	await client.getToken(identity)

	const createdIDs = await client.create(skillWalletThreadID, skillWalletCollection, [model]);
	return createdIDs[0]
}

export async function changeCommunityID(id: string, communityID) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
	const identity = await PrivateKey.fromString(skillWalletPrivateKey)
	
    await client.getToken(identity)
	let toUpdate = await client.findByID(skillWalletThreadID, skillWalletCollection, id) as SkillWallet;
	toUpdate.communityID = communityID;
    client.save(skillWalletThreadID, skillWalletCollection, [toUpdate]);
  }

async function auth(keyInfo) {
	// Create an expiration and create a signature. 60s or less is recommended.
	const expiration = new Date(Date.now() + 60 * 1000)
	// Generate a new UserAuth
	const userAuth = await createUserAuth(keyInfo.key, keyInfo.secret ?? '', expiration)
	return userAuth
}

export interface SkillWallet { 
	_id: string;
	communityID: string;
	username: string;
	skillWallet: SkillLevels[];
}
export interface SkillLevels {
	skill: string;
	level: number;
}
const DiToSkillWalletSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "https://example.com/object1610669989.json",
	"title": "Root",
	"type": "object",
	"required": [
		"skillWallet"
	],
	"properties": {
		_id: { type: 'string' },
		communityID: {type: 'string'},
		username: {type: 'string'},
		"skillWallet": {
			"$id": "#root/skillWallet",
			"title": "Skillwallet",
			"type": "array",
			"default": [],
			"items": {
				"$id": "#root/skillWallet/items",
				"title": "Items",
				"type": "object",
				"required": [
					"skill",
					"level"
				],
				"properties": {
					"skill": {
						"$id": "#root/skillWallet/items/skill",
						"title": "Skill",
						"type": "string",
						"default": "",
						"examples": [
							"asd"
						],
						"pattern": "^.*$"
					},
					"level": {
						"$id": "#root/skillWallet/items/level",
						"title": "Level",
						"type": "integer",
						"examples": [
							2
						],
						"default": 0
					}
				}
			}

		}
	}
}
