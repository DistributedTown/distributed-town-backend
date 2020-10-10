import { GigsCollection } from '../constants/constants';
import threadDBClient from '../threaddb.config';

export async function acceptGig(gigID: string, acceptedUser: string) {
    let gig: any = await threadDBClient.getByID(GigsCollection, gigID);
    gig.isOpen = false;
    gig.acceptedUser = acceptedUser;
    // call smart contract
    await threadDBClient.save(GigsCollection, [gig]);
} 