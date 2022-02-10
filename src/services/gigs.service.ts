import { Gig } from '../models';
import { getJSONFromURI, ipfsCIDToHttpUrl } from '../utils/helpers';
import { GigsContracts } from '../contracts/gigs.contract';
import  {ethers } from 'ethers';
export async function getGigs(communityAddress: string): Promise<Gig[]> {
    let gigID = 2;
    let getNextGig = true;
    const gigs = [];
    while (getNextGig) {
        const tokenCID = await GigsContracts.getTokenURI(communityAddress, gigID.toString());
        if (!tokenCID) {
            getNextGig = false;
        } else {
            const tokenUri = ipfsCIDToHttpUrl(tokenCID, false);
            const jsonMetadata = await getJSONFromURI(tokenUri)
            const gigDetails = await GigsContracts.getGig(communityAddress, gigID.toString());

            gigs.push({
                ...jsonMetadata,
                id: gigID.toString(),
                creator: gigDetails.creator,
                taker: gigDetails.taker == '0x0000000000000000000000000000000000000000' ? '' : gigDetails.taker,
                status: gigDetails.status,
                credits: +ethers.utils.formatEther(gigDetails.ditoCredits)
            });
            gigID++;
        }
    }
    return gigs as Gig[];
}
