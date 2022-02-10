import { CommunityDetailsView, CommunityListView, PartnerKey, partnersKeySchema, skillNames, SkillSet } from '../models';
import { CommunityContracts } from '../contracts/community.contracts';
import { DistributedTownContracts } from '../contracts/distributedTown.contracts';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { getJSONFromURI, ipfsCIDToHttpUrl } from '../utils/helpers';
import threadDBClient from '../threaddb.config';
import { PartnerKeysCollection } from '../constants/constants';
import { Where } from '@textile/hub';
var crypto = require("crypto");
import * as skillsService from "../services/skills.service";

export async function getCommunities(template: number): Promise<CommunityListView[]> {
    const allCommunities = await DistributedTownContracts.getCommunities();

    const result: CommunityListView[] = [];
    for (let community of allCommunities) {
        const isDiToNative = await DistributedTownContracts.isDiToNativeCommunity(community);

        if (!isDiToNative)
            continue;

        const metadataUriCID = await CommunityContracts.getMetadataUri(community);
        const metadataUri = ipfsCIDToHttpUrl(metadataUriCID, true);
        const metadata = await getJSONFromURI(metadataUri);
        const members = await CommunityContracts.getMembersCount(community);
        const scarcityScore = 0;
        // const totalMembersAllowed = await CommunityContracts.totalMembersAllowed(community);

        result.push({
            name: metadata.title,
            members,
            scarcityScore,
            address: community,
            description: metadata.description,
            image: ipfsCIDToHttpUrl(metadata.image, false),
            totalMembersAllowed: 24
        });
    }
    return result;
}

export async function getCommunity(address: string): Promise<CommunityDetailsView> {
    const metadataUriCID = await CommunityContracts.getMetadataUri(address);
    const metadataUri = ipfsCIDToHttpUrl(metadataUriCID, true);
    const metadata = await getJSONFromURI(metadataUri);
    const isDiToNative = await DistributedTownContracts.isDiToNativeCommunity(address);

    let catName = '';
    switch (metadata.properties.template) {
        case 'Open-Source & DeFi': catName = 'DLT & Blockchain'; break;
        case 'Art & NFTs': catName = 'Art & Lifestyle'; break;
        case 'Local & DAOs': catName = 'Local Community'; break;
    }
    const skills = await skillsService.getByCategory(catName);
    return {
        name: metadata.title,
        address: address,
        description: metadata.description,
        roles: metadata.skills,
        template: metadata.properties.template,
        image: ipfsCIDToHttpUrl(metadata.image, false),
        skills: skills,
        isDiToNativeCommunity: isDiToNative,
        partnersAgreementAddress: undefined
    };
}

function generateKey() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = 10;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export async function createPartnerAgreementKey(partnersAgreementAddress: string, communityAddress: string): Promise<string> {
    const key: PartnerKey = {
        key: crypto.randomBytes(20).toString('hex'),
        partnersAgreementAddress,
        communityAddress
    }
    await threadDBClient.insert(PartnerKeysCollection, key);
    return key.key;
}

export async function getKey(key: string): Promise<PartnerKey> {
    const query = new Where('key').eq(key);

    const partnerKey = await threadDBClient.filter(PartnerKeysCollection, query) as PartnerKey[];
    if (partnerKey && partnerKey.length > 0)
        return partnerKey[0];
    else
        return undefined;
}



export async function getPAByCommunity(communityAddress: string): Promise<PartnerKey> {
    const query = new Where('communityAddress').eq(communityAddress);

    const partnerKey = await threadDBClient.filter(PartnerKeysCollection, query) as PartnerKey[];
    if (partnerKey && partnerKey.length > 0)
        return partnerKey[0];
    else
        return undefined;
}