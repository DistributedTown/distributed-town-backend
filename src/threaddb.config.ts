import { Client, createUserAuth, DBInfo, KeyInfo, MailboxEvent, Private, PrivateKey, Query, QueryJSON, ThreadID, UserAuth, UserMessage, Users, Where } from '@textile/hub'
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
  gigSchema,
  CommunityKey
} from './models'
import { threadId } from 'worker_threads';

const keyInfo: KeyInfo = {
  key: 'bzri276u6qt5ppotid4sscghagm',
  secret: 'bzcdqwxlxuqfoc3adtcbyasff2ef6opt37s2ucwq'
}

const ditoThreadID = 'bafk4ptq5vyazvev5dx2xxecy23epcyj2bm2vs4sfudysxwc6vkh4hii';
const ditoPrivKey = 'bbaareqawbqt4jmq74v5aid3lyi6rk3g2bo4b22g6eu2blmedqhanxt2e6dmqsgozwn72phhnleddtttqvonqhjzzvd75u5tffliz7vayztrrw';

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
      await client.newCollection(this.ditoThreadID, { name: CommunitiesCollection });
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
    client.save(this.ditoThreadID, collectionName, [toUpdate]);
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

  private async setupMailbox(identity: PrivateKey) {

    // Connect to the API with hub keys.
    // Use withUserAuth for production.
    const client = await Users.withKeyInfo(keyInfo)

    // Authorize the user to access your Huh api
    await client.getToken(identity)

    // Setup the user's mailbox
    const mailboxID = await client.setupMailbox()

    // Create a listener for all new messages in the inbox
    client.watchInbox(mailboxID, this.handleNewMessage)

    // await this.sendMessageToSelf();
    // Grab all existing inbox messages and decrypt them locally
    const messages = await client.listInboxMessages()
    const inbox = []
    for (const message of messages) {
      inbox.push(await this.messageDecoder(message, identity))
    }
  }

  public async createCommunity(community: Community) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const identity = await PrivateKey.fromRandom()
    await client.getToken(identity)

    community.pubKey = identity.public.toString();
    const comID = await client.create(this.ditoThreadID, CommunitiesCollection, [
      community
    ])

    const comThread = ThreadID.fromRandom();

    await client.create(this.ditoThreadID, CommunityKeysCollection, [
      {
        communityID: comID[0],
        threadID: comThread.toString(),
        privKey: identity.toString()
      }
    ]);

    await client.newDB(comThread, `community-${comID[0]}`);

    await client.newCollection(comThread, { name: GigsCollection, schema: gigSchema });
    await client.newCollection(comThread, { name: GeneralSkillsCollection });


    // Grab all existing inbox messages and decrypt them locally
    this.setupMailbox(identity);

    return comID[0];
  }

  private async messageDecoder(message: UserMessage, identity: PrivateKey): Promise<any> {
    // const identity = PrivateKey.fromString(privKey)
    const bytes = await identity.decrypt(message.body)
    const body = new TextDecoder().decode(bytes)
    const { from } = message
    const { readAt } = message
    const { createdAt } = message
    const { id } = message
    const res = { body, from, readAt, sent: createdAt, id }
    console.log(res)
    return res;
  }

  private async handleNewMessage(reply: MailboxEvent, err: Error) {
    if (!reply || !reply.message) return console.log('no message')
    console.log(reply.type)
    console.log(reply.message)
  }

  private async cleanTheThreads() {

    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const identity = await PrivateKey.fromString(ditoPrivKey);
    await client.getToken(identity)
    
    const ids = ((await client.find(this.ditoThreadID, CommunitiesCollection, {})) as any[]).map(s => s._id);
    await client.delete(this.ditoThreadID, CommunitiesCollection, ids);

    const ids2 = ((await client.find(this.ditoThreadID, CommunityKeysCollection, {})) as any[]).map(s => s._id);
    await client.delete(this.ditoThreadID, CommunityKeysCollection, ids2);
  }

  /**
   * This example will simply send a message to yourself, instead of
   * creating two distinct users.
   */
  sendMessageToSelf = async () => {

    const auth = await this.auth(keyInfo);
    // const client = Client.withUserAuth(auth);
    const identity = await PrivateKey.fromRandom()
    // await client.getToken(identity)

    const user = await Users.withUserAuth(auth);
    const newMessage = 'asdasdasdasds';

    const encoded = new TextEncoder().encode(newMessage);
    console.log('encoded');

    console.log('aaaaaaaaa');
    await user.sendMessage(identity, identity.public, encoded)
    console.log('message sent');

  }


  private async sendAndReadMessage() {
    const comID1 = await this.createCommunity({ scarcityScore: 0, category: 'Art & Lifestyle', name: 'Dito #1', address: '0x790697f595Aa4F9294566be0d262f71b44b5039c' } as Community);
    const comID2 = await this.createCommunity({ scarcityScore: 0, category: 'Bla bla bla', name: 'Dito #2', address: '0x790697f595Aa4F9294566be0d262f71b44b5039c' } as Community);

    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    const com1 = await client.findByID(this.ditoThreadID, CommunitiesCollection, comID1);
    const com2 = await client.findByID(this.ditoThreadID, CommunitiesCollection, comID1);
  }


}


const threadDBClient = new ThreadDBInit();
threadDBClient.getClient();
export default threadDBClient;