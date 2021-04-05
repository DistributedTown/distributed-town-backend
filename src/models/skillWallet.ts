export interface SkillWallet {
    nickname: string;
    imageUrl: string;
    diToCredits: number;
    currentCommunity: CommunityList;
    pastCommunities: CommunityList[];
    skills: Skill[];
}

export interface CommunityList {
    name: string;
    address: string;
}

export interface Skill {
    name: string;
    value: number;
}