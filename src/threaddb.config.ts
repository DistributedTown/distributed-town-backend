import { Client, createUserAuth, DBInfo, KeyInfo, PrivateKey, QueryJSON, ThreadID, UserAuth, Users } from '@textile/hub'
import {
  UsersCollection,
  CommunitiesCollection,
  GigsCollection,
  CommunityKeysCollection,
  GeneralSkillsCollection
} from './constants/constants';
import { injectable } from 'inversify';
import {
  communitySchema,
  Community,
  gigSchema
} from './models'

const keyInfo: KeyInfo = {
  key: 'bzri276u6qt5ppotid4sscghagm',
  secret: 'bzcdqwxlxuqfoc3adtcbyasff2ef6opt37s2ucwq'
}


@injectable()
class ThreadDBInit {
  client: Client;
  ditoThreadID: ThreadID;
  communityKeysThreadID: ThreadID;

  public async getClient(): Promise<Client> {
    if (!this.client)
      await this.initialize();

    return this.client;
  }
  async initialize() {


    // this.client = await Client.withKeyInfo(keyInfo);

    // const ditoThread = await this.client.getThread('distributed-town-new');
    // this.ditoThreadID = ThreadID.fromString(ditoThread.id);

    // const communtiyKeysThread = await this.client.getThread('community-keys');
    // this.communityKeysThreadID = ThreadID.fromString(communtiyKeysThread.id);

    // this.ditoThreadID = ThreadID.fromRandom();
    // this.client.newDB(this.ditoThreadID, 'distributed-town-new');

    // const communityKeysThreadID = await this.client.getThread('community-keys');
    // this.communityKeysThreadID = ThreadID.fromString(communityKeysThreadID.id);

      await this.createCommunity({ scarcityScore: 0, category: 'Art & Lifestyle', name: 'Dito #1', address: '0x790697f595Aa4F9294566be0d262f71b44b5039c' } as Community);

    // this.ditoThreadID = ThreadID.fromRandom();
    // this.client.newDB(this.ditoThreadID, 'DiTo');


  //   try {
  //     await this.client.getCollectionInfo(this.communityKeysThreadID, CommunitiesCollection);
  //   } catch (err) {

  //     // Define the collections 
  //     await this.client.newCollection(this.communityKeysThreadID, { name: CommunityKeysCollection })

  //     await this.createCommunity({ scarcityScore: 0, category: 'Art & Lifestyle', name: 'Dito #1', address: '0x790697f595Aa4F9294566be0d262f71b44b5039c' } as Community);
  //     // await this.createCommunity({ scarcityScore: 0, category: 'DLT & Blockchain', name: 'Dito #2', address: '0xFdA3DB614eF90Cd96495FceA2D481d8C33C580A2' } as Community);
  //     // await this.createCommunity({ scarcityScore: 0, category: 'Local communities', name: 'Dito #3', address: '0x759A224E15B12357b4DB2d3aa20ef84aDAf28bE7' } as Community);


  //     await this.client.create(this.ditoThreadID, GeneralSkillsCollection, [
  //       {
  //         main: 'Local Community',
  //         categories: [
  //           {
  //             credits: 12,
  //             subCat: 'Community Life',
  //             skills: ['Fun & Entertainment', 'Administration & Management', 'Community Life', 'Leadership & Public Speaking']
  //           },
  //           {
  //             credits: 6,
  //             subCat: 'At Home',
  //             skills: ['Company', 'Householding', 'Gardening', 'Cooking']
  //           },
  //           {
  //             subCat: 'Professional',
  //             credits: 24,
  //             skills: ['Legal', 'Accounting', 'Art, Music & Creativity', 'Teaching']
  //           }],
  //       },
  //       {
  //         main: 'DLT & Blockchain',
  //         categories: [
  //           {
  //             credits: 12,
  //             subCat: 'Blockchain & DLT',
  //             skills: ['DeFi', 'Blockchain infrastructure', 'Architecture', 'Smart Contracts']
  //           },
  //           {
  //             credits: 6,
  //             subCat: 'Tech',
  //             skills: ['Backend', 'Frontend', 'Web Dev', 'Mobile Dev']
  //           },
  //           {
  //             credits: 24,
  //             subCat: 'Protocol',
  //             skills: ['Network Design', 'Tokenomics', 'Game Theory', 'Governance & Consensus']
  //           }
  //         ]
  //       },
  //       {
  //         main: 'Art & Lifestyle',
  //         categories: [
  //           {
  //             credits: 12,
  //             subCat: 'Creative Arts',
  //             skills: ['Music', 'Painting', 'Photography', 'Video-making']
  //           },
  //           {
  //             credits: 6,
  //             subCat: 'Lifestyle',
  //             skills: ['Training & Sport', 'Hiking', 'Biking', 'Writing']
  //           },
  //           {
  //             credits: 24,
  //             subCat: 'Activities',
  //             skills: ['Performance & Theather', 'Project Management', 'Production', 'Gaming']
  //           }
  //         ]
  //       }
  //     ])
  //   }
  //   // await this.client.create(this.ditoThreadID, CommunitiesCollection, [
  //   //   { scarcityScore: 0, category: 'Art & Lifestyle', name: 'Dito #1', address: '0x790697f595Aa4F9294566be0d262f71b44b5039c' },
  //   //   { scarcityScore: 0, category: 'DLT & Blockchain', name: 'Dito #2', address: '0xFdA3DB614eF90Cd96495FceA2D481d8C33C580A2' },
  //   //   { scarcityScore: 0, category: 'Local communities', name: 'Dito #3', address: '0x759A224E15B12357b4DB2d3aa20ef84aDAf28bE7' },
  //   // ]);

  }


  private async auth(keyInfo: KeyInfo) {
    // Create an expiration and create a signature. 60s or less is recommended.
    const expiration = new Date(Date.now() + 60 * 1000)
    // Generate a new UserAuth
    const userAuth: UserAuth = await createUserAuth(keyInfo.key, keyInfo.secret ?? '', expiration)
    return userAuth
  }

  public async getAll(collectionName: string) {
    this.client = await Client.withKeyInfo(keyInfo)
    return await this.client.find(this.ditoThreadID, collectionName, {});
  }

  public async getByID(collectionName: string, id: string) {
    this.client = await Client.withKeyInfo(keyInfo)
    return await this.client.findByID(this.ditoThreadID, collectionName, id);
  }

  public async filter(collectionName: string, filter: QueryJSON) {
    this.client = await Client.withKeyInfo(keyInfo)
    return await this.client.find(this.ditoThreadID, collectionName, filter);
  }


  public async insert(collectionName: string, model: any) {
    this.client = await Client.withKeyInfo(keyInfo)
    return await this.client.create(this.ditoThreadID, collectionName, [model]);
  }

  public async save(collectionName: string, values: any[]) {
    this.client = await Client.withKeyInfo(keyInfo)
    return await this.client.save(this.ditoThreadID, collectionName, values);
  }

  public async update(collectionName: string, id: string, model: any) {
    this.client = await Client.withKeyInfo(keyInfo)
    let toUpdate = await this.client.findByID(this.ditoThreadID, collectionName, id);
    toUpdate = model;
    this.client.save(this.ditoThreadID, collectionName, [toUpdate]);
  }

  public async createIdentity(auth) {
    const api = Users.withUserAuth(auth)
    const identity = await PrivateKey.fromRandom()
    await api.getToken(identity)
    return identity;
  }

  private async createCommunity(community: Community) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const identity = await PrivateKey.fromRandom()
    await client.getToken(identity)

    community.pubKey = identity.public.toString();
    const comID = await client.create(this.ditoThreadID, CommunitiesCollection, [
      community
    ])

    await client.create(this.communityKeysThreadID, CommunityKeysCollection, [
      {
        communityID: comID,
        privKey: identity.privKey.toString()
      }
    ]);

    const comThread = ThreadID.fromRandom();
    client.newDB(comThread, `community-${comID}`);
    
    await this.client.newCollection(comThread, { name: CommunitiesCollection, schema: communitySchema });
    await this.client.newCollection(comThread, { name: UsersCollection });
    await this.client.newCollection(comThread, { name: GigsCollection, schema: gigSchema });
    await this.client.newCollection(comThread, { name: GeneralSkillsCollection });
  }


  private async getInfo(client: Client, threadID: ThreadID): Promise<DBInfo> {
    return await client.getDBInfo(threadID)
  }

  private async joinFromInfo(client: Client, info: DBInfo) {
    return await client.joinFromInfo(info)
  }
}

const threadDBClient = new ThreadDBInit();
threadDBClient.getClient();
export default threadDBClient;