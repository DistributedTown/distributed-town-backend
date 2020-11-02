export interface Community {
    _id: string;
    scarcityScore: number;
    category: string;
    addresses: CommunityAddress[];
    name: string;
    pubKey: string;
}

export interface CommunityAddress {
  address: string;
  blockchain: string;
}
export interface CommunityKey {
  _id: string;
  communityID: string;
  threadID: string;
  privKey: string;
}

export const communitySchema = {
    title: 'Community',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      pubKey: { type: 'string' },
      category: { type: 'string' },
      name: { type: 'string' },
      address: { type: 'string' },
      scarcityScore: { type: 'integer' },
    },
  }