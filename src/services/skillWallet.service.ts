
import { Authentication, CommunityListView, Message, SkillWallet, SWActivation } from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
import { Where } from '@textile/hub';
import threadDBClient from '../threaddb.config';
import { ActivationCollection, MessagesCollection, AuthenticationCollection } from '../constants/constants';
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

export const hasPendingActivation = async (userAddress: string): Promise<boolean> => {
    const query = new Where('address').eq(userAddress);
    const activationAttempts = (await threadDBClient.filter(ActivationCollection, query)) as SWActivation[];
    const lastAttempt = activationAttempts[activationAttempts.length - 1];
    if (!lastAttempt)
        return false;
    else
        return !lastAttempt.isActivated;

}

export const getUniqueStringForLogin = async (): Promise<string> => {
    const uniqueStr = `${uuidv4()}${uuidv4()}`;
    await threadDBClient.insert(AuthenticationCollection, { uniqueString: uniqueStr, isAuthenticated: false });
    return uniqueStr;
}

export const verifyUniqueString = async (tokenId: number, uniqueString: string): Promise<boolean> => {
    const query = new Where('uniqueString').eq(uniqueString);
    const a = await threadDBClient.getAll(AuthenticationCollection);
    console.log(a);
    const login = (await threadDBClient.filter(AuthenticationCollection, query)) as Authentication[];
    console.log(login);
    if (login && login.length == 1) {
        login[0].isAuthenticated = true;
        login[0].tokenId = tokenId;
        await threadDBClient.save(AuthenticationCollection, login);
        return true;
    } else
        return false;
}

export const getTokenIDAfterLogin = async (uniqueString: string): Promise<number> => {
    const query = new Where('uniqueString').eq(uniqueString);
    const login = (await threadDBClient.filter(AuthenticationCollection, query)) as Authentication[];
    if (login && login.length > 0 && login[0].isAuthenticated) {
        const tokenId = login[0].tokenId;
        await threadDBClient.delete(AuthenticationCollection, query);
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

export const activateSkillWallet = async (tokenId: number, hash: string): Promise<void> => {
    await SkillWalletContracts.activate(tokenId, hash);
    const ownerAddr = await SkillWalletContracts.ownerOf(tokenId.toString());
    const query = new Where('address').eq(ownerAddr);
    const userActivations = (await threadDBClient.filter(ActivationCollection, query)) as SWActivation[];
    const lastActivationAttempt = userActivations[userActivations.length - 1]

    if (lastActivationAttempt && !lastActivationAttempt.isActivated) {
        lastActivationAttempt.isActivated = true;
        await threadDBClient.save(ActivationCollection, [lastActivationAttempt]);
    }
}