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
    members?: number;
    description?: string;
    scarcityScore?: number;
}

export interface Skill {
    name: string;
    value: number;
}

export interface SkillSet {
    skills: Skill[];
}


export interface SkillOnChain {
    displayStringId: string;
    level: number;
}
export interface SkillSetOnChain {
    skill1: SkillOnChain;
    skill2: SkillOnChain;
    skill3: SkillOnChain;
}