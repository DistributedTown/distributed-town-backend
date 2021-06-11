export interface CommunityList {
    name: string;
    address: string;
}

export interface Skill {
    name: string;
    value: number;
}

export interface SkillSet {
    skills: Skill[];
}
