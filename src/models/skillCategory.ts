export interface Skill {
    name: string;
    subcategory: string;
}

export interface Subcategory {
    name: string;
    credits: number;
    category: string;
}

export const subcategorySchema = {
    title: 'Subcategory',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      category: { type: 'string' },
      credits: { type: 'number' },
    },
  }

  export const skillSchema = {
    title: 'Skill',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      subcategory: { type: 'string' },
    },
  }
