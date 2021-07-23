


export interface CommunityListView {
	name: string;
	members: number;
	scarcityScore: number;
	address: string;
	description: string;
}

export interface CommunityDetailsView {
	name: string;
	address: string;
	description: string;
	roles?: [string];
	template: string;
	image: string;
}