export interface SkillsCategory {
  main: string;
  categories: Skills[]
}

export interface Skills {
  subCat: string;
  credits: number;
  skills: string[];
}
