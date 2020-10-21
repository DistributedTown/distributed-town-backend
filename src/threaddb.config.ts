import { Client, createUserAuth, DBInfo, KeyInfo, PrivateKey, QueryJSON, ThreadID, UserAuth, Users } from '@textile/hub'
import {
  UsersCollection,
  CommunitiesCollection,
  SkillsCollection,
  GigsCollection,
  SubcategoriesCollection,
  CommunityKeysCollection
} from './constants/constants';
import { injectable } from 'inversify';
import {
  subcategorySchema,
  skillSchema,
  communitySchema,
  gigSchema,
  Community
} from './models'

const keyInfo: KeyInfo = {
  key: 'bzri276u6qt5ppotid4sscghagm',
  secret: 'bzcdqwxlxuqfoc3adtcbyasff2ef6opt37s2ucwq'
}

const userKey: UserAuth {
  k
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

    
    this.client = await Client.withKeyInfo(keyInfo);

    const ditoThread = await this.client.getThread('distributed-town-new');
    this.ditoThreadID = ThreadID.fromString(ditoThread.id);

    // const communtiyKeysThread = await this.client.getThread('community-keys');
    // this.communityKeysThreadID = ThreadID.fromString(communtiyKeysThread.id);

    // this.ditoThreadID = ThreadID.fromRandom();
    // this.client.newDB(this.ditoThreadID, 'distributed-town-new');

    const communityKeysThreadID = await this.client.getThread('community-keys');
    this.communityKeysThreadID = ThreadID.fromString(communityKeysThreadID.id);


    // this.ditoThreadID = ThreadID.fromRandom();
    // this.client.newDB(this.ditoThreadID, 'DiTo');


    try {
      await this.client.getCollectionInfo(this.ditoThreadID, SkillsCollection);
    } catch (err) {

      // Define the collections 
      await this.client.newCollection(this.ditoThreadID, { name: SkillsCollection, schema: skillSchema });
      await this.client.newCollection(this.ditoThreadID, { name: SubcategoriesCollection, schema: subcategorySchema });
      await this.client.newCollection(this.ditoThreadID, { name: CommunitiesCollection, schema: communitySchema });
      await this.client.newCollection(this.ditoThreadID, { name: UsersCollection });
      await this.client.newCollection(this.ditoThreadID, { name: GigsCollection, schema: gigSchema });

      await this.client.newCollection(this.communityKeysThreadID, { name: CommunityKeysCollection })

      // Insert the predefined data
      await this.client.create(this.ditoThreadID, SkillsCollection, [
        { name: 'Company', subcategory: 'At Home' },
        { name: 'Householding', subcategory: 'At Home' },
        { name: 'Gardening', subcategory: 'At Home' },
        { name: 'Cooking', subcategory: 'At Home' },

        { name: 'Legal', subcategory: 'Professional' },
        { name: 'Accounting', subcategory: 'Professional' },
        { name: 'Art, Music & Creativity', subcategory: 'Professional' },
        { name: 'Teaching', subcategory: 'Professional' },

        { name: 'Fun & Entertainment', subcategory: 'Community Life' },
        { name: 'Administration & Management', subcategory: 'Community Life' },
        { name: 'Community Life', subcategory: 'Community Life' },
        { name: 'Leadership & Public Speaking', subcategory: 'Community Life' },

        { name: 'DeFi', subcategory: 'Blockchain & DLT' },
        { name: 'Blockchain infrastructure', subcategory: 'Blockchain & DLT' },
        { name: 'Architecture', subcategory: 'Blockchain & DLT' },
        { name: 'Smart Contracts', subcategory: 'Blockchain & DLT' },

        { name: 'Backend', subcategory: 'Tech' },
        { name: 'Frontend', subcategory: 'Tech' },
        { name: 'Web Dev', subcategory: 'Tech' },
        { name: 'Mobile Dev', subcategory: 'Tech' },

        { name: 'Network Design', subcategory: 'Protocol' },
        { name: 'Tokenomics', subcategory: 'Protocol' },
        { name: 'Game Theory', subcategory: 'Protocol' },
        { name: 'Governance & Consensus', subcategory: 'Protocol' },

        { name: 'Music', subcategory: 'Creative Arts' },
        { name: 'Painting', subcategory: 'Creative Arts' },
        { name: 'Photography', subcategory: 'Creative Arts' },
        { name: 'Video-making', subcategory: 'Creative Arts' },

        { name: 'Training & Sport', subcategory: 'Lifestyle' },
        { name: 'Hiking', subcategory: 'Lifestyle' },
        { name: 'Biking', subcategory: 'Lifestyle' },
        { name: 'Writing', subcategory: 'Lifestyle' },

        { name: 'Performance & Theather', subcategory: 'Activities' },
        { name: 'Project Management', subcategory: 'Activities' },
        { name: 'Production', subcategory: 'Activities' },
        { name: 'Gaming', subcategory: 'Activities' },
      ]);

      await this.client.create(this.ditoThreadID, SubcategoriesCollection, [
        { name: 'At Home', category: 'Local communities', credits: 6 },
        { name: 'Community Life', category: 'Local communities', credits: 12 },
        { name: 'Professional', category: 'Local communities', credits: 24 },

        { name: 'Blockchain & DLT', category: 'DLT & Blockchain', credits: 12 },
        { name: 'Tech', category: 'DLT & Blockchain', credits: 6 },
        { name: 'Protocol', category: 'DLT & Blockchain', credits: 24 },

        { name: 'Creative Arts', category: 'Art & Lifestyle', credits: 12 },
        { name: 'Lifestyle', category: 'Art & Lifestyle', credits: 6 },
        { name: 'Activities', category: 'Art & Lifestyle', credits: 24 },
      ]);

      await this.createCommunity({ scarcityScore: 0, category: 'Art & Lifestyle', name: 'Dito #1', address: '0x790697f595Aa4F9294566be0d262f71b44b5039c' } as Community);
      await this.createCommunity({ scarcityScore: 0, category: 'DLT & Blockchain', name: 'Dito #2', address: '0xFdA3DB614eF90Cd96495FceA2D481d8C33C580A2' } as Community);
      await this.createCommunity({ scarcityScore: 0, category: 'Local communities', name: 'Dito #3', address: '0x759A224E15B12357b4DB2d3aa20ef84aDAf28bE7' } as Community);

      // await this.client.create(this.ditoThreadID, CommunitiesCollection, [
      //   { scarcityScore: 0, category: 'Art & Lifestyle', name: 'Dito #1', address: '0x790697f595Aa4F9294566be0d262f71b44b5039c' },
      //   { scarcityScore: 0, category: 'DLT & Blockchain', name: 'Dito #2', address: '0xFdA3DB614eF90Cd96495FceA2D481d8C33C580A2' },
      //   { scarcityScore: 0, category: 'Local communities', name: 'Dito #3', address: '0x759A224E15B12357b4DB2d3aa20ef84aDAf28bE7' },
      // ]);

    }
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

  private async createCommunity(community: Community) {
    const identity = await this.createIdentity();
    community.pubKey = identity.public.toString();
    const comID = await this.client.create(this.ditoThreadID, CommunitiesCollection, [
      community
    ])

    console.log(identity.privKey.toString());
    await this.client.create(this.communityKeysThreadID, CommunityKeysCollection, [
      {
        communityID: comID,
        privKey: identity.privKey.toString()
      }
    ]);
  }

    
  private async getInfo (client: Client, threadID: ThreadID): Promise<DBInfo> {
    return await client.getDBInfo(threadID)
  }
  
  private async joinFromInfo (client: Client, info: DBInfo) {
    return await client.joinFromInfo(info)
  }

  public async createIdentity() {

    const api = Users.withUserAuth(auth)
    const list = api.listThreads()

    
    const identity = await PrivateKey.fromRandom()

    console.log(identity);
    console.log('Your public identity:', identity.public.toString())

    // Connect to the API with hub keys.
    // Authorize the user to access your Huh api
    await this.client.getToken(identity)

    // // Setup the user's mailbox
    // const mailboxID = await this.client.setupMailbox()
    await identity.setupMailbox()

    return identity;
  }
}

const threadDBClient = new ThreadDBInit();
threadDBClient.getClient();
export default threadDBClient;