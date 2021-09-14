import { gigsContract } from './index';

export class GigsContracts {

    public static async getTokenURI(community: string, tokenId: string): Promise<string> {
        try {
            const contract = await gigsContract(community);
            const uri = await contract.tokenURI(tokenId);
            return uri;
        } catch (err) {
            console.log(err);
            return '';
        }
    }

    public static async getGig(community: string, gigID: string) {
        try {
            const contract = await gigsContract(community);
            const gig = await contract.gigs(gigID);
            return gig;
        } catch (err) {
            console.log(err);
        }
    }
}
