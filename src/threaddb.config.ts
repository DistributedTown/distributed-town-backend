import { Client, KeyInfo, QueryJSON, ThreadID } from '@textile/hub'
import {
  UsersCollection,
  CommunitiesCollection,
  GigsCollection,
  GeneralSkillsCollection
} from './constants/constants';
import { injectable } from 'inversify';
import {
  communitySchema,
  gigSchema
} from './models'

const keyInfo: KeyInfo = {
  key: 'bxrgtfj27tyecvkjprlwnyq7ksa',
  secret: 'bvnijpfkhvmfmux4oauypbdhgy3uxayfeqhcnvdy'
}

@injectable()
class ThreadDBInit {
  client: Client;
  threadID: ThreadID;

  public async getClient(): Promise<Client> {
    if (!this.client)
      await this.initialize();

    return this.client;
  }
  async initialize() {


    this.client = await Client.withKeyInfo(keyInfo)
    const thread = await this.client.getThread('distributed-town-33');
    this.threadID = ThreadID.fromString(thread.id);

    // this.threadID = ThreadID.fromRandom();
    // this.client.newDB(this.threadID, 'distributed-town-33');


    try {
      await this.client.getCollectionInfo(this.threadID, CommunitiesCollection);
    } catch (err) {

      // Define the collections 
      await this.client.newCollection(this.threadID, { name: CommunitiesCollection, schema: communitySchema });
      await this.client.newCollection(this.threadID, { name: UsersCollection });
      await this.client.newCollection(this.threadID, { name: GigsCollection, schema: gigSchema });
      await this.client.newCollection(this.threadID, { name: GeneralSkillsCollection });
      
      // Insert the predefined data
      
      await this.client.create(this.threadID, CommunitiesCollection, [
        { scarcityScore: 60, category: 'Art & Lifestyle', address: '0x790697f595Aa4F9294566be0d262f71b44b5039c' },
        { scarcityScore: 70, category: 'DLT & Blockchain', address: '0xFdA3DB614eF90Cd96495FceA2D481d8C33C580A2' },
        { scarcityScore: 40, category: 'Local communities', address: '0x759A224E15B12357b4DB2d3aa20ef84aDAf28bE7' },
      ]);

      await this.client.create(this.threadID, GeneralSkillsCollection, [
        {
          main: 'Local Community',
          categories: [
            {
              credits: 12,
              subCat: 'Community Life',
              skills: ['Fun & Entertainment', 'Administration & Management', 'Community Life', 'Leadership & Public Speaking']
            },
            {
              credits: 6,
              subCat: 'At Home',
              skills: ['Company', 'Householding', 'Gardening', 'Cooking']
            },
            {
              subCat: 'Professional',
              credits: 24,
              skills: ['Legal', 'Accounting', 'Art, Music & Creativity', 'Teaching']
            }],
        },
        {
          main: 'DLT & Blockchain',
          categories: [
            {
              credits: 12,
              subCat: 'Blockchain & DLT',
              skills: ['DeFi', 'Blockchain infrastructure', 'Architecture', 'Smart Contracts']
            },
            {
              credits: 6,
              subCat: 'Tech',
              skills: ['Backend', 'Frontend','Web Dev','Mobile Dev']
            },
            {
              credits: 24,
              subCat: 'Protocol',
              skills: ['Network Design', 'Tokenomics', 'Game Theory','Governance & Consensus' ]
            }
          ]
        },
        {
          main: 'Art & Lifestyle', 
          categories: [
            {
              credits: 12,
              subCat: 'Creative Arts',
              skills: ['Music', 'Painting', 'Photography', 'Video-making']
            },
            {
              credits: 6,
              subCat: 'Lifestyle',
              skills: ['Training & Sport', 'Hiking','Biking','Writing']
            },
            {
              credits: 24,
              subCat: 'Activities',
              skills: ['Performance & Theather', 'Project Management', 'Production','Gaming' ]
            }
          ]
        }
      ])
    }
  }

  public async getAll(collectionName: string) {
    this.client = await Client.withKeyInfo(keyInfo)
    return await this.client.find(this.threadID, collectionName, {});
  }

  public async getByID(collectionName: string, id: string) {
    this.client = await Client.withKeyInfo(keyInfo)
    return await this.client.findByID(this.threadID, collectionName, id);
  }

  public async filter(collectionName: string, filter: QueryJSON) {
    this.client = await Client.withKeyInfo(keyInfo)
    return await this.client.find(this.threadID, collectionName, filter);
  }


  public async insert(collectionName: string, model: any) {
    this.client = await Client.withKeyInfo(keyInfo)
    return await this.client.create(this.threadID, collectionName, [model]);
  }

  public async save(collectionName: string, values: any[]) {
    this.client = await Client.withKeyInfo(keyInfo)
    return await this.client.save(this.threadID, collectionName, values);
  }

  public async update(collectionName: string, id: string, model: any) {
    this.client = await Client.withKeyInfo(keyInfo)
    let toUpdate = await this.client.findByID(this.threadID, collectionName, id);
    toUpdate = model;
    this.client.save(this.threadID, collectionName, [toUpdate]);
  }
}

const threadDBClient = new ThreadDBInit();
threadDBClient.getClient();
export default threadDBClient;