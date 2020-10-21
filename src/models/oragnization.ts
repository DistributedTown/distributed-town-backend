export interface Community {
    _id: string;
    scarcityScore: number;
    category: string;
    address: string;
    name: string;
    pubKey: string;
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