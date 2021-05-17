
import {
    Actions,
    QRCodeAuth,
    CommunityListView,
    Message,
    SkillWallet,
    PendingActivation,
} from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
import { Where } from '@textile/hub';
import threadDBClient from '../threaddb.config';
import { PendingSWActivationCollection, MessagesCollection, QRCodeAuthCollection } from '../constants/constants';
import { getJSONFromURI, getNonce } from '../utils/helpers';

export const getSkillWallet = async (tokenId: string): Promise<SkillWallet> => {

    const skillWallet: SkillWallet = {
        pastCommunities: [],
        skills: [],
        currentCommunity: {}
    } as SkillWallet;
    const isActive = await SkillWalletContracts.isActive(tokenId);
    if (isActive) {
        const jsonUri = await SkillWalletContracts.getTokenURI(tokenId);
        let jsonMetadata = await getJSONFromURI(jsonUri)
        skillWallet.imageUrl = jsonMetadata.image;
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
    const activationAttempts = (await threadDBClient.filter(PendingSWActivationCollection, query)) as PendingActivation[];
    const lastAttempt = activationAttempts[activationAttempts.length - 1];
    return lastAttempt !== undefined;
}

export const getNonceForQR = async (action: number, tokenId?: string): Promise<any> => {
    const nonce = getNonce();
    if ((!tokenId || tokenId === '-1') && action !== Actions.LOGIN)
        return { message: 'skillWalletId is required' };
        console.log(action);
    const authModel: QRCodeAuth = {
        _id: undefined,
        nonce,
        action,
        tokenId,
        isValidated: false,
    }
    await threadDBClient.insert(QRCodeAuthCollection, authModel);
    return { nonce, action };
}

export const loginValidation = async (nonce: number, tokenId: string): Promise<boolean> => {
    const query = new Where('nonce').eq(nonce).and('action').eq(Actions.LOGIN).and('isValidated').eq(false);
    const login = (await threadDBClient.filter(QRCodeAuthCollection, query)) as QRCodeAuth[];
    if (login && login.length > 0) {
        login[login.length - 1].isValidated = true;
        login[login.length - 1].tokenId = tokenId;
        await threadDBClient.save(QRCodeAuthCollection, login);
        return true;
    }
    return false;
}

export const findNonce = async (action: Actions, tokenId: string): Promise<number[]> => {
    let query = undefined;
    const actionNumber = +action;
    console.log(actionNumber);
    console.log(typeof(actionNumber));
    if (action === Actions.LOGIN)
        // TODO: add tokenId
        query = new Where('action').eq(actionNumber).and('isValidated').eq(false);
    else
        query = new Where('tokenId').eq(tokenId).and('action').eq(actionNumber).and('isValidated').eq(false);
    const auths = (await threadDBClient.filter(QRCodeAuthCollection, query)) as QRCodeAuth[];
    return auths.map(l => l.nonce);
}

export const getTokenIDAfterLogin = async (nonce: number): Promise<string> => {
    const query = new Where('nonce').eq(nonce).and('action').eq(+Actions.LOGIN).and('isValidated').eq(true);
    const login = (await threadDBClient.filter(QRCodeAuthCollection, query)) as QRCodeAuth[];
    if (login && login.length > 0) {
        await threadDBClient.delete(QRCodeAuthCollection, query);
        return login[login.length - 1].tokenId;
    } else
        return "-1";
}

export const getMessagesBySkillWalletID = async (skillWalletId: string): Promise<Message[]> => {
    // console.log(skillWalletId);
    // const query = new Where('skillWalletId').eq(skillWalletId);
    // const messages = await threadDBClient.filter(MessagesCollection, query) as Message[];
    const messages = await threadDBClient.getAll(MessagesCollection) as Message[];
    return messages;
}

export const activateSkillWallet = async (tokenId: string, pubKey: string): Promise<void> => {
    await SkillWalletContracts.activate(tokenId, pubKey);
    const ownerAddr = await SkillWalletContracts.ownerOf(tokenId.toString());
    const query = new Where('address').eq(ownerAddr);
    const userActivations = (await threadDBClient.filter(PendingSWActivationCollection, query)) as PendingActivation[];

    if (userActivations && userActivations.length > 0) {
        await threadDBClient.delete(PendingSWActivationCollection, query);
    }
}

export const invalidateNonce = async (nonce: number, tokenId: string, action: Actions): Promise<void> => {
    const query = new Where('nonce').eq(nonce).and('isValidated').eq(false).and('action').eq(action);
    const qrAuths = (await threadDBClient.filter(QRCodeAuthCollection, query)) as QRCodeAuth[];
    qrAuths.forEach(auth => {
        auth.isValidated = true;
        if (tokenId)
            auth.tokenId = tokenId;
        threadDBClient.update(QRCodeAuthCollection, auth._id, auth);
    });
}