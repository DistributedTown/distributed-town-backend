import { Client, createUserAuth, DBInfo, KeyInfo, MailboxEvent, Private, PrivateKey, Public, Query, QueryJSON, ThreadID, UserAuth, UserMessage, Users, Where } from '@textile/hub'
import {
  UsersCollection,
  CommunitiesCollection,
  GigsCollection,
  CommunityKeysCollection,
  GeneralSkillsCollection,
  MessagesCollection
} from './constants/constants';
import { injectable } from 'inversify';
import {
  communitySchema,
  Community,
  gigSchema,
  CommunityKey,
  Gig
} from './models'
import { threadId } from 'worker_threads';

const keyInfo: KeyInfo = {
  key: 'bzri276u6qt5ppotid4sscghagm',
  secret: 'bzcdqwxlxuqfoc3adtcbyasff2ef6opt37s2ucwq'
}

const ditoThreadID = 'bafksim4camsfpioa5usiia2sp3tiri2tsynvcmkvfszuua63oqzkj2y';
const ditoPrivKey = 'bbaareqg7v63j3muqpmq4t6ox34cjpsslnqaasaiazjgdmg357cvtdfdz3mxq57zmw5hrkq2asjaayyupuyniwrl74srouwy5d2sqq4tfzmhpq';

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
      await client.getCollectionInfo(this.ditoThreadID, UsersCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: UsersCollection });
    }

    try {
      await client.getCollectionInfo(this.ditoThreadID, CommunitiesCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: CommunitiesCollection });
    }

    try {
      await client.getCollectionInfo(this.ditoThreadID, CommunityKeysCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: CommunityKeysCollection });
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

    const community1 = {
      name: 'DiTo #1',
      scarcityScore: 0,
      category: 'Art & Lifestyle',
      addresses: [
        { blockchain: 'ETH', address: '0x790697f595Aa4F9294566be0d262f71b44b5039c' },
        { blockchain: 'RSK', address: '0x5786A4a3B022FeD43DfcC18008077383B4281B95' },
      ]
    }
    const community2 = {
      name: 'DiTo #2',
      scarcityScore: 0,
      category: 'DLT & Blockchain',
      addresses: [
        { blockchain: 'ETH', address: '0xFdA3DB614eF90Cd96495FceA2D481d8C33C580A2' },
        { blockchain: 'RSK', address: '0x910895DE912A0eB625d6903265658f7EF80c1C19' },
      ]
    }
    const community3 = {
      name: 'DiTo #3',
      scarcityScore: 0,
      category: 'Local community',
      addresses: [
        { blockchain: 'ETH', address: '0x759A224E15B12357b4DB2d3aa20ef84aDAf28bE7' },
        { blockchain: 'RSK', address: '0xa8C98103F0A97BE465D660B9ebB181744AbF7138' },
      ]
    }
    // await this.createCommunity(community1 as Community)
    // await this.createCommunity(community2 as Community)
    // await this.createCommunity(community3 as Community)
    // console.log('done');
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
    console.log("Generate community identity (public/private key)");
    const identity = await PrivateKey.fromRandom()
    await client.getToken(identity)
    console.log('setup mailbox for inter-community communication');
    await this.setupMailbox(identity);

    community.pubKey = identity.public.toString();

    console.log('store the community in the ThreadDB');

    const comID = await client.create(this.ditoThreadID, CommunitiesCollection, [
      community
    ])

    const comThread = ThreadID.fromRandom();
    console.log('store the community keys in another thread in ThreadDB');

    await client.create(this.ditoThreadID, CommunityKeysCollection, [
      {
        communityID: comID[0],
        threadID: comThread.toString(),
        privKey: identity.toString(),
      }
    ]);

    console.log('create a thread and the collections for the community');

    await client.newDB(comThread, `community-${comID[0]}`);

    await client.newCollection(comThread, { name: GigsCollection, schema: gigSchema });
    await client.newCollection(comThread, { name: GeneralSkillsCollection });
    await client.newCollection(comThread, { name: MessagesCollection });

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

    const ids = ((await client.find(this.ditoThreadID, CommunitiesCollection, {})) as any[]).map(s => s._id);
    await client.delete(this.ditoThreadID, CommunitiesCollection, ids);

    const ids2 = ((await client.find(this.ditoThreadID, CommunityKeysCollection, {})) as any[]).map(s => s._id);
    await client.delete(this.ditoThreadID, CommunityKeysCollection, ids2);

    const ids3 = ((await client.find(this.ditoThreadID, UsersCollection, {})) as any[]).map(s => s._id);
    await client.delete(this.ditoThreadID, UsersCollection, ids3);
  }

  public async setupMailbox(identity: PrivateKey) {
    const user = await Users.withKeyInfo(keyInfo)
    await user.getToken(identity);

    const mailboxID = await user.setupMailbox()
    const callback = async (reply?: MailboxEvent, err?: Error) => {
      if (!reply || !reply.message) return console.log('no message')
      console.log('message received');
      const bodyBytes = await identity.decrypt(reply.message.body)
      const decoder = new TextDecoder()
      const body = decoder.decode(bodyBytes)

      const auth = await this.auth(keyInfo);
      const client = Client.withUserAuth(auth);

      const communityKeyQuery = new Where('privKey').eq(identity.toString());
      const communityKey = (await client.find(this.ditoThreadID, CommunityKeysCollection, communityKeyQuery))[0] as CommunityKey;

      const communityQuery = new Where('pubKey').eq(identity.pubKey.toString());

      const community = (await client.find(this.ditoThreadID, CommunitiesCollection, communityQuery))[0] as Community;

      const thread = ThreadID.fromString(communityKey.threadID);

      await client.create(thread, MessagesCollection, [{
        from: community._id,
        message: body
      }]);
      console.log(body)
    }
    user.watchInbox(mailboxID, callback)
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