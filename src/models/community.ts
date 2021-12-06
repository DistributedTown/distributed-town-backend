import { SkillsCategory } from "./skillCategory";



export interface CommunityListView {
	name: string;
	members: number;
	scarcityScore: number;
	address: string;
	description: string;
	image: string;
	totalMembersAllowed: number;
}

export interface CommunityDetailsView {
	name: string;
	address: string;
	description: string;
	roles?: [any];
	template: string;
	image: string;
	skills: SkillsCategory;
	isDiToNativeCommunity: boolean;
	partnersAgreementAddress: string;
}