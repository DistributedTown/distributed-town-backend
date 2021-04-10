
import { Authentication, CommunityListView, skillNames, SkillWallet } from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
import { Where } from '@textile/hub';
import threadDBClient from '../threaddb.config';
import { AuthenticationCollection } from '../constants/constants';
const fs = require('fs');

export const getSkillWallet = async (userAddress: string): Promise<SkillWallet> => {

    const query = new Where('address').eq(userAddress);
    const userAuths = (await threadDBClient.filter(AuthenticationCollection, query)) as Authentication[];
    const lastAuth = userAuths[userAuths.length - 1]

    if (!lastAuth.isAuthenticated) {
        lastAuth.isAuthenticated = true;
        await threadDBClient.save(AuthenticationCollection, [lastAuth]);
    }

    // const skillWallet: SkillWallet = {
    //     pastCommunities: [],
    //     skills: [],
    //     currentCommunity: {}
    // } as SkillWallet;

    // // const isActive = await SkillWalletContracts.isActive(userAddress);
    // // console.log(isActive);
    // const tokenId = await SkillWalletContracts.getSkillWalletIdByOwner(userAddress);
    // // if (isActive) {
    //     const jsonUri = await SkillWalletContracts.getTokenURI(tokenId);

    //     let rawdata = fs.readFileSync(jsonUri);
    //     let jsonMetadata = JSON.parse(rawdata);
    //     skillWallet.imageUrl = 'https://png.pngtree.com/png-clipart/20190619/original/pngtree-vector-avatar-icon-png-image_4017288.jpg';
    //     skillWallet.nickname = jsonMetadata.nickname;

    //     const oldCommunityAddresses: string[] = await SkillWalletContracts.getCommunityHistory(tokenId);
    //     console.log(oldCommunityAddresses)
    //     oldCommunityAddresses.forEach(async address => {
    //         const name = await CommunityContracts.getName(address);
    //         skillWallet.pastCommunities.push({
    //             name,
    //             address
    //         })
    //     });

    //     const currentCommunity = await SkillWalletContracts.getCurrentCommunity(tokenId);

    //     skillWallet.currentCommunity.address = currentCommunity;
    //     skillWallet.currentCommunity.name = await CommunityContracts.getName(currentCommunity);
    //     skillWallet.diToCredits = await CommunityContracts.getDiToBalance(currentCommunity, userAddress)
    //     const skills = await SkillWalletContracts.getSkills(tokenId);
    //     skillWallet.skills.push({
    //         name: skillNames[skills.skill1.displayStringId],
    //         value: skills.skill1.level
    //     });
    //     if (skills.skill2)
    //         skillWallet.skills.push({
    //             name: skillNames[skills.skill2.displayStringId],
    //             value: skills.skill2.level
    //         });
    //     if (skills.skill3)
    //         skillWallet.skills.push({
    //             name: skillNames[skills.skill3.displayStringId],
    //             value: skills.skill3.level
    //         });

    //     const query = new Where('address').eq(userAddress);
    //     const userAuths = (await threadDBClient.filter(AuthenticationCollection, query)) as Authentication[];
    //     const lastAuth = userAuths[userAuths.length - 1]

    //     if (!lastAuth.isAuthenticated) {
    //         lastAuth.isAuthenticated = true;
    //         await threadDBClient.save(AuthenticationCollection, [lastAuth]);
    //     }

    //     return skillWallet;
    // } else {
    //     return undefined;
    // }
    return undefined;
}

export const getCommunityDetails = async (userAddress: string): Promise<CommunityListView> => {
    const isActive = await SkillWalletContracts.isActive(userAddress);
    const tokenId = await SkillWalletContracts.getSkillWalletIdByOwner(userAddress);
    if (isActive) {
        const currentCommunity = await SkillWalletContracts.getCurrentCommunity(tokenId);

        const members = await CommunityContracts.getMembersCount(currentCommunity);
        const name = await CommunityContracts.getName(currentCommunity);

        return {
            members,
            name,
            scarcityScore: 0,
            address: currentCommunity
        };

    } else {
        return undefined;
    }
}

export const hasPendingAuth = async (userAddress: string): Promise<boolean> => {

    const query = new Where('address').eq(userAddress);
    const userAuths = (await threadDBClient.filter(AuthenticationCollection, query)) as Authentication[];
    const lastAuth = userAuths[userAuths.length - 1];
    if (!lastAuth)
        return false;
    else
        return !lastAuth.isAuthenticated;

}