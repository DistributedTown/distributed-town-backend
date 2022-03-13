import {
  Client,
  createUserAuth,
  KeyInfo,
  PrivateKey,
  QueryJSON,
  ThreadID,
  UserAuth,
} from '@textile/hub'

import {
  GeneralSkillsCollection,
  MessagesCollection,
  PartnerKeysCollection,
} from './constants/constants';
import { injectable } from 'inversify';
import {
  messagesSchema,
  MessageType,
  partnersKeySchema,
} from './models'
require('dotenv').config()


const ditoThreadID = process.env.DITO_THREADID;

const keyInfo = {
  key: process.env.TEXTILE_KEY,
  secret: process.env.TEXTILE_SECRET
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

    const auth = await this.auth(keyInfo);
    const client = await Client.withKeyInfo(auth)
    this.ditoThreadID = ThreadID.fromString(ditoThreadID);

    try {
      await client.getCollectionInfo(this.ditoThreadID, GeneralSkillsCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: GeneralSkillsCollection })
      await client.create(this.ditoThreadID, GeneralSkillsCollection, [
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
              skills: ['Backend', 'Frontend', 'Web Dev', 'Mobile Dev']
            },
            {
              credits: 24,
              subCat: 'Protocol',
              skills: ['Network Design', 'Tokenomics', 'Game Theory', 'Governance & Consensus']
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
              skills: ['Training & Sport', 'Hiking', 'Biking', 'Writing']
            },
            {
              credits: 24,
              subCat: 'Activities',
              skills: ['Performance & Theather', 'Project Management', 'Production', 'Gaming']
            }
          ]
        }
      ])
    }

    try {
      await client.getCollectionIndexes(this.ditoThreadID, MessagesCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: MessagesCollection, schema: messagesSchema });
      await client.create(this.ditoThreadID, MessagesCollection, [{
        type: MessageType.GigCreated,
        title: 'Your Gig has started!',
        message: 'Start working on your Gig - and earn DITO Credits!',
        skillWalletId: 1,
        contactSkillWalletId: 2
      },
      {
        type: MessageType.GigCreated,
        title: 'Your Gig has started!',
        message: 'Start working on your Gig - and earn DITO Credits!',
        skillWalletId: 1,
        contactSkillWalletId: 2
      }])
    }



    try {
      await client.getCollectionIndexes(this.ditoThreadID, PartnerKeysCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: PartnerKeysCollection, schema: partnersKeySchema });
    }
  }


  private async auth(keyInfo: KeyInfo) {
    // Create an expiration and create a signature. 60s or less is recommended.
    const expiration = new Date(Date.now() + 60 * 1000)
    // Generate a new UserAuth
    const userAuth: UserAuth = await createUserAuth(keyInfo.key, keyInfo.secret ?? '', expiration)
    return userAuth
  }

  public async getAll(collectionName: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;

    return await client.find(thread, collectionName, {});
  }

  public async getByID(collectionName: string, id: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    return await client.findByID(thread, collectionName, id);
  }

  public async filter(collectionName: string, filter: QueryJSON, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    const toReturn = await client.find(thread, collectionName, filter);
    return toReturn;
  }

  public async delete(collectionName: string, filter: QueryJSON, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    const toDelete = (await client.find(thread, collectionName, {})).map(item => (item as any)._id);
    await client.delete(thread, collectionName, toDelete);
    return toDelete;
  }

  public async insert(collectionName: string, model: any, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;

    return await client.create(thread, collectionName, [model]);
  }

  public async save(collectionName: string, values: any[], threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    return await client.save(thread, collectionName, values);
  }

  public async update(collectionName: string, id: string, model: any, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    let toUpdate = await client.findByID(thread, collectionName, id);
    toUpdate = model;
    client.save(thread, collectionName, [toUpdate]);
  }
}


const threadDBClient = new ThreadDBInit();
threadDBClient.getClient();
export default threadDBClient;