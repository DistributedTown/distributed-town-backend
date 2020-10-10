import { Client, KeyInfo, QueryJSON, ThreadID } from '@textile/hub'
import {
  UsersCollection,
  OrganizationsCollection,
  SkillsCollection,
  UsersCollectionTestMagic
} from './constants/constants';
import { injectable } from 'inversify';

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
    const keyInfo: KeyInfo = {
      key: 'bdlosexmgqmjqes6xqisoxy5oqi',
      secret: 'blroulqwthmp2hhk2picucowphrk72ruzeu5425y'
    }

    this.client = await Client.withKeyInfo(keyInfo)

    /**
    * Setup a new ThreadID and Database
    */
    this.threadID = ThreadID.fromRandom();

    /**
     * Each new ThreadID requires a `newDB` call.
     */
    await this.client.newDB(this.threadID)

    // Define the collections 
    await this.client.newCollection(this.threadID, { name: SkillsCollection });
    await this.client.newCollection(this.threadID, { name: OrganizationsCollection });
    await this.client.newCollection(this.threadID, { name: UsersCollection });
    await this.client.newCollection(this.threadID, { name: UsersCollectionTestMagic });

    // Insert the predefined data
    await this.client.create(this.threadID, SkillsCollection, [
      {
        category: 'Local communities',
        credits: 6,
        skills: [
          { name: 'Administration' },
          { name: 'Householding' },
          { name: 'Gardening' },
          { name: 'Legal' },
          { name: 'Accounting' },
          { name: 'Fun & Entertainment' },
          { name: 'Company' },
          { name: 'Community Life' },
          { name: 'Art & Creativity' },
          { name: 'Teaching' },
          { name: 'Leadership' },
          { name: 'Cooking' },
        ]
      },
      {
        category: 'DLT & Blockchain',
        credits: 24,
        skills: [
          { name: 'Governance' },
          { name: 'Blockchain' },
          { name: 'Architecture' },
          { name: 'Frontend Dev' },
          { name: 'Backend Dev' },
          { name: 'DeFi' },
          { name: 'Tokenomics' },
          { name: 'Game Theory' },
          { name: 'Network Design' },
          { name: 'Smart Contracts' },
          { name: 'Mobile Dev' },
          { name: 'Web Dev' },
        ]
      },
      {
        category: 'Art & Lifestyle',
        credits: 12,
        skills: [
          { name: 'Music' },
          { name: 'Painting' },
          { name: 'Photography' },
          { name: 'Video-making' },
          { name: 'Training & Sport' },
          { name: 'Hiking' },
          { name: 'Biking' },
          { name: 'Performance' },
          { name: 'Theather' },
          { name: 'Project Management' },
          { name: 'Writing' },
          { name: 'Gaming' },
        ]
      }
    ]);
    await this.client.create(this.threadID, OrganizationsCollection, [
      {
        scarcityScore: 60,
        category: 'Art & Lifestyle',
      },
      {
        scarcityScore: 50,
        category: 'DLT & Blockchain',
      },
      {
        scarcityScore: 70,
        category: 'Local communities',
      }
    ]);
  }

  public async getAll(collectionName: string) {
    return await this.client.find(this.threadID, collectionName, {});
  }

  public async filter(collectionName: string, filter: QueryJSON) {
    return await this.client.find(this.threadID, collectionName, filter);
  }

  public async insert(collectionName: string, model: any) {
    return await this.client.create(this.threadID, collectionName, [model]);
  }
}

const threadDBClient = new ThreadDBInit();
threadDBClient.getClient();
export default threadDBClient;