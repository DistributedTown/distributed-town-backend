
import { Authentication, CommunityListView, Message, SkillWallet, SkillWalletLogin } from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
import { Where } from '@textile/hub';
import threadDBClient from '../threaddb.config';
import { AuthenticationCollection, MessagesCollection, SkillWalletLoginCollection } from '../constants/constants';
import { v4 as uuidv4 } from 'uuid';
import { getJSONFromURI } from '../utils/helpers';
const fs = require('fs');

export const getSkillWallet = async (userAddress: string): Promise<SkillWallet> => {

    const skillWallet: SkillWallet = {
        pastCommunities: [],
        skills: [],
        currentCommunity: {}
    } as SkillWallet;
    const tokenId = await SkillWalletContracts.getSkillWalletIdByOwner(userAddress);
    const isActive = await SkillWalletContracts.isActive(tokenId);
    console.log(isActive);
    if (isActive) {
        const jsonUri = await SkillWalletContracts.getTokenURI(tokenId);
        let jsonMetadata = await getJSONFromURI(jsonUri)
        skillWallet.imageUrl = 'https://png.pngtree.com/png-clipart/20190619/original/pngtree-vector-avatar-icon-png-image_4017288.jpg';
        skillWallet.nickname = jsonMetadata.properties.username;
        skillWallet.skills = jsonMetadata.properties.skills;

        const oldCommunityAddresses: string[] = await SkillWalletContracts.getCommunityHistory(tokenId);
        oldCommunityAddresses.forEach(async address => {
            const communityMetadata = await CommunityContracts.getMetadataUri(address);
            let jsonOldCommunityMetadata = await getJSONFromURI(communityMetadata)
            console.log(communityMetadata);
            skillWallet.pastCommunities.push({
                name: jsonOldCommunityMetadata.name ?? 'DiTo #1',
                address
            })
        });

        const currentCommunity = await SkillWalletContracts.getCurrentCommunity(tokenId);
        const members = await CommunityContracts.getMembersCount(currentCommunity);

        skillWallet.currentCommunity.address = currentCommunity;
        skillWallet.currentCommunity.members = members;
        const communityMetadata = await CommunityContracts.getMetadataUri(currentCommunity);
        let jsonCommunityMetadata = await getJSONFromURI(communityMetadata)

        skillWallet.currentCommunity.name = jsonCommunityMetadata.name ?? 'DiTo #1';
        skillWallet.currentCommunity.description = jsonCommunityMetadata.description ?? 'description description description';
        skillWallet.currentCommunity.scarcityScore = 0;
        // skillWallet.diToCredits = await CommunityContracts.getDiToBalance(currentCommunity, userAddress)
        skillWallet.diToCredits = 2060;
        // const skills = await SkillWalletContracts.getSkills(tokenId);

        // TODO : activate skill wallet
        // const query = new Where('address').eq(userAddress);
        // const userAuths = (await threadDBClient.filter(AuthenticationCollection, query)) as Authentication[];
        // const lastAuth = userAuths[userAuths.length - 1]

        // if (lastAuth && !lastAuth.isAuthenticated) {
        //     lastAuth.isAuthenticated = true;
        //     await threadDBClient.save(AuthenticationCollection, [lastAuth]);
        // }

        return skillWallet;
    } else {
        return undefined;
    }
}

export const getCommunityDetails = async (userAddress: string): Promise<CommunityListView> => {
    const isActive = await SkillWalletContracts.isActive(userAddress);
    const tokenId = await SkillWalletContracts.getSkillWalletIdByOwner(userAddress);
    if (isActive) {
        const currentCommunity = await SkillWalletContracts.getCurrentCommunity(tokenId);

        const members = await CommunityContracts.getMembersCount(currentCommunity);
        const communityMetadataUrl = await CommunityContracts.getMetadataUri(currentCommunity);
        let communityMetadata = await getJSONFromURI(communityMetadataUrl)
        const name = communityMetadata.name ?? 'DiTo #1';
        const description = communityMetadata.description ?? 'description description description';
        return {
            members,
            name,
            scarcityScore: 0,
            description,
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

export const getUniqueStringForLogin = async (): Promise<string> => {
    const uniqueStr = `${uuidv4()}${uuidv4()}`;
    await threadDBClient.insert(SkillWalletLoginCollection, { uniqueString: uniqueStr, isAuthenticated: false });
    return uniqueStr;
}

export const verifyUniqueString = async (tokenId: number, uniqueString: string): Promise<boolean> => {
    const query = new Where('uniqueString').eq(uniqueString);
    const login = (await threadDBClient.filter(SkillWalletLoginCollection, query)) as SkillWalletLogin[];
    if (login && login.length == 1) {
        login[0].isAuthenticated = true;
        login[0].tokenId = tokenId;
        await threadDBClient.save(SkillWalletLoginCollection, login);
        return true;
    } else
        return false;
}

export const getTokenIDAfterLogin = async (uniqueString: string): Promise<number> => {
    const query = new Where('uniqueString').eq(uniqueString);
    const login = (await threadDBClient.filter(SkillWalletLoginCollection, query)) as SkillWalletLogin[];
    if (login && login.length === 1 && login[0].isAuthenticated) {
        return login[0].tokenId;
    } else
        return -1;
}

export const getMessagesBySkillWalletID = async (skillWalletId: number): Promise<Message[]> => {
    // console.log(skillWalletId);
    // const query = new Where('skillWalletId').eq(skillWalletId);
    // const messages = await threadDBClient.filter(MessagesCollection, query) as Message[];
    const messages = await threadDBClient.getAll(MessagesCollection) as Message[];
    return messages;
}