export interface Organization {
    _id: string;
    scarcityScore: number;
    category: string;
    address: string;
}

export const organizationSchema = {
    title: 'Organization',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      category: { type: 'string' },
      address: { type: 'string' },
      scarcityScore: { type: 'integer' },
    },
  }