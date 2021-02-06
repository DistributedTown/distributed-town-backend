import { 
  Client, 
  createUserAuth, 
  KeyInfo, 
  MailboxEvent, 
  PrivateKey, 
  Public, 
  QueryJSON, 
  ThreadID, 
  UserAuth, 
  Users, 
  Where 
} from '@textile/hub'

import {
  CommunitiesCollection,
  GigsCollection,
  CommunityKeysCollection,
  GeneralSkillsCollection,
  ProjectsCollection,
} from './constants/constants';
import { injectable } from 'inversify';
import {
  Community,
  gigSchema,
  CommunityKey,
  communitySchema,
  communityKeySchema,
  projectSchema,
} from './models'
require('dotenv').config()


const ditoThreadID = process.env.DITO_THREADID;
const ditoPrivKey = process.env.DITO_PRIVATE_KEY;
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
    const client = Client.withUserAuth(auth);
    const identity = await PrivateKey.fromString(ditoPrivKey);
    await client.getToken(identity)

    this.ditoThreadID = ThreadID.fromString(ditoThreadID);

    try {
      await client.getCollectionInfo(this.ditoThreadID, CommunitiesCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: CommunitiesCollection, schema: communitySchema });
    }

    try {
      await client.getCollectionInfo(this.ditoThreadID, CommunityKeysCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: CommunityKeysCollection, schema: communityKeySchema });
    }

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
  }


  private async auth(keyInfo: KeyInfo) {
    // Create an expiration and create a signature. 60s or less is recommended.
    const expiration = new Date(Date.now() + 60 * 1000)
    // Generate a new UserAuth
    const userAuth: UserAuth = await createUserAuth(keyInfo.key, keyInfo.secret ?? '', expiration)
    return userAuth
  }

  public async getAll(collectionName: string, privKey?: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    privKey = privKey ? privKey : ditoPrivKey;
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;

    const identity = await PrivateKey.fromString(privKey)
    await client.getToken(identity)
    return await client.find(thread, collectionName, {});
  }

  public async getByID(collectionName: string, id: string, privKey?: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    privKey = privKey ? privKey : ditoPrivKey;
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;

    const identity = await PrivateKey.fromString(privKey)
    await client.getToken(identity)
    return await client.findByID(thread, collectionName, id);
  }

  public async filter(collectionName: string, filter: QueryJSON, privKey?: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    privKey = privKey ? privKey : ditoPrivKey;
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    const identity = await PrivateKey.fromString(privKey);
    await client.getToken(identity)
    const toReturn = await client.find(thread, collectionName, filter);
    return toReturn;
  }

  public async delete(collectionName: string, filter: QueryJSON, privKey?: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    privKey = privKey ? privKey : ditoPrivKey;
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    const identity = await PrivateKey.fromString(privKey);
    await client.getToken(identity)
    const toDelete = (await client.find(thread, collectionName, {})).map(item => (item as any)._id);
    await client.delete(thread, collectionName, toDelete);
    return toDelete;
  }

  public async insert(collectionName: string, model: any, privKey?: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    privKey = privKey ? privKey : ditoPrivKey;
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;

    const identity = await PrivateKey.fromString(privKey)
    await client.getToken(identity)
    return await client.create(thread, collectionName, [model]);
  }

  public async save(collectionName: string, values: any[], privKey?: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    privKey = privKey ? privKey : ditoPrivKey;
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;

    const identity = await PrivateKey.fromString(privKey)
    await client.getToken(identity)
    return await client.save(thread, collectionName, values);
  }

  public async update(collectionName: string, id: string, model: any, privKey?: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    privKey = privKey ? privKey : ditoPrivKey;
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;

    const identity = await PrivateKey.fromString(privKey)
    await client.getToken(identity)
    let toUpdate = await client.findByID(thread, collectionName, id);
    toUpdate = model;
    client.save(thread, collectionName, [toUpdate]);
  }

  public async getCommunityPrivKey(communityID: string): Promise<CommunityKey> {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const identity = await PrivateKey.fromString(ditoPrivKey);
    await client.getToken(identity);
    const communitiesKeyQuery = new Where('communityID').eq(communityID);
    const communityKeys = (await this.filter(CommunityKeysCollection, communitiesKeyQuery))[0] as CommunityKey;
    return communityKeys;
  }

  public async createCommunity(community: Community) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const identity = await PrivateKey.fromRandom()
    await client.getToken(identity)
    // await this.setupMailbox(identity);

    community.pubKey = identity.public.toString();

    const comID = await client.create(this.ditoThreadID, CommunitiesCollection, [
      community
    ])

    const comThread = ThreadID.fromRandom();

    await client.create(this.ditoThreadID, CommunityKeysCollection, [
      {
        communityID: comID[0],
        threadID: comThread.toString(),
        privKey: identity.toString(),
      }
    ]);


    await client.newDB(comThread, `community-${comID[0]}`);

    await client.newCollection(comThread, { name: GigsCollection, schema: gigSchema });
    await client.newCollection(comThread, { name: ProjectsCollection, schema: projectSchema });

    return comID[0];
  }


  private async cleanTheThreads() {

    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const identity = await PrivateKey.fromString(ditoPrivKey);
    await client.getToken(identity)

    const communities = (await client.find(this.ditoThreadID, CommunityKeysCollection, {})) as CommunityKey[];
    communities.forEach(async c => {
      const i = await PrivateKey.fromString(c.privKey);
      const cl = Client.withUserAuth(auth);
      await cl.getToken(i);
      const t = ThreadID.fromString(c.threadID);
      cl.deleteDB(t);
    });


    await client.deleteCollection(this.ditoThreadID, CommunitiesCollection);
    await client.deleteCollection(this.ditoThreadID, CommunityKeysCollection);
    console.log('deleted communities and keys');

    // const ids = ((await client.find(this.ditoThreadID, CommunitiesCollection, {})) as any[]).map(s => s._id);
    // await client.delete(this.ditoThreadID, CommunitiesCollection, ids);

    // const ids2 = ((await client.find(this.ditoThreadID, CommunityKeysCollection, {})) as any[]).map(s => s._id);
    // await client.delete(this.ditoThreadID, CommunityKeysCollection, ids2);

  }

  public async setupMailbox(identity: PrivateKey) {
    try {
      const user = await Users.withKeyInfo(keyInfo)
      await user.getToken(identity);

      const mailboxID = await user.setupMailbox()
      const callback = async (reply?: MailboxEvent, err?: Error) => {
        try {
          const user = await Users.withKeyInfo(keyInfo)
          await user.getToken(identity);
          if (!reply || !reply.message) return console.log('no message')
          console.log('message received');
          const bodyBytes = await identity.decrypt(reply.message.body)
          const decoder = new TextDecoder()
          const body = decoder.decode(bodyBytes)

          console.log(body)
        } catch (err) {
          console.log(err);
        }
      }
      user.watchInbox(mailboxID, callback)
    } catch (err) {
      console.log(err);
    }
  }

  public async getAllMessages(privKey: string) {
    const user = await Users.withKeyInfo(keyInfo)
    const identity = PrivateKey.fromString(privKey)
    await user.getToken(identity);

    const messages = await user.listInboxMessages()
    const inbox = []


    for (const message of messages) {

      const bytes = await identity.decrypt(message.body)
      const body = new TextDecoder().decode(bytes)
      const { from } = message
      const { readAt } = message
      const { createdAt } = message
      const { id } = message
      inbox.push({ body, from, readAt, sent: createdAt, id });
      console.log({ body, from, readAt, sent: createdAt, id })
    }
    return inbox;
  }

  public async sendMessage(senderPrivKey: string, recipientPubKey: Public, message: string) {
    console.log('sending message');
    const identity = PrivateKey.fromString(senderPrivKey)
    const user = await Users.withKeyInfo(keyInfo)
    await user.getToken(identity);
    const encoded = new TextEncoder().encode(message);
    await user.sendMessage(identity, recipientPubKey, encoded)
  }
}


const threadDBClient = new ThreadDBInit();
threadDBClient.getClient();
export default threadDBClient;