import { Client, KeyInfo, ThreadID } from '@textile/hub'
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
    const allCollections = await this.client.listCollections(this.threadID);
    await this.client.newCollection(this.threadID, { name: 'Skills' });
    await this.client.newCollection(this.threadID, { name: 'Organizations' });
    await this.client.newCollection(this.threadID, { name: 'Users' });

    // Insert the predefined data
    await this.client.create(this.threadID, 'Skills', [
      {
        category: 'Community life',
        credits: 12,
        skills: [
          { name: 'Administration & Management' },
          { name: 'Leadership & Public Speaking' },
          { name: 'Art, Music & Creativity' },
          { name: 'Legal & Proposals' },
        ]
      },
      {
        category: 'At Home',
        credits: 6,
        skills: [
          { name: 'Gardening' },
          { name: 'Cooking' },
          { name: 'Repairing & Household' },
          { name: 'Company' },
        ]
      },
      {
        category: 'Professional',
        credits: 24,
        skills: [
          { name: 'Tech & Computer' },
          { name: 'Accounting' },
          { name: 'Design' },
          { name: 'Teaching' },
        ]
      }
    ]);
    await this.client.create(this.threadID, 'Organizations', [
      {
        scarcityScore: 60,
        category: 'Art',
      },
      {
        scarcityScore: 50,
        category: 'IT',
      },
      {
        scarcityScore: 70,
        category: 'Household',
      }
    ]);
    await this.client.create(this.threadID, 'Users', [
      {
        username: 'migrenaa',
        skillCategories: [{
          category: 'Community life',
          skills: [
            { skill: 'Administration & Management', rate: 9 },
          ]
        },
        {
          category: 'Professional',
          skills: [
            { skill: 'Teaching', rate: 10 },
            { skill: 'Design', rate: 6 },
          ]
        },
        {
          category: 'At Home',
          skills: [
            { skill: 'Cooking', rate: 8 },
            { skill: 'Gardening', rate: 9 },
          ]
        }]
      }
    ])
  }

  public async getAll(collectionName: string) {
    return await this.client.find(this.threadID, collectionName, {});
  }

  public async insert(collectionName: string, model: any) {
    return await this.client.create(this.threadID, collectionName, [model]);
  }
}

const threadDBClient = new ThreadDBInit();
threadDBClient.getClient();
export default threadDBClient;