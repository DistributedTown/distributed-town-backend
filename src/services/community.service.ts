import { CommunityDetailsView, CommunityListView, PartnerKey, partnersKeySchema, skillNames, SkillSet } from '../models';
import { CommunityContracts } from '../contracts/community.contracts';
import { DistributedTownContracts } from '../contracts/distributedTown.contracts';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { getJSONFromURI } from '../utils/helpers';
import threadDBClient from '../threaddb.config';
import { PartnerKeysCollection } from '../constants/constants';
import { Where } from '@textile/hub';
var crypto = require("crypto");

export async function getCommunities(template: number): Promise<any> {
    const allCommunities = await DistributedTownContracts.getCommunities();

    const result: CommunityListView[] = [];
    for (let community of allCommunities) {
        const metadataUri = await CommunityContracts.getMetadataUri(community);
        const metadata = await getJSONFromURI(metadataUri);
        const members = await CommunityContracts.getMembersCount(community);
        const scarcityScore = 0;

        result.push({
            name: metadata.title,
            members,
            scarcityScore,
            address: community,
            description: metadata.description
        });
    }
    return result;
}


export async function getCommunity(address: string): Promise<CommunityDetailsView> {
    const metadataUri = await CommunityContracts.getMetadataUri(address);
    const metadata = await getJSONFromURI(metadataUri);

    return {
        name: metadata.title,
        address: address,
        description: metadata.description,
        roles: metadata.properties.roles,
        template: metadata.properties.template,
        image: metadata.image
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

async function calculateScarcityStore(address: string): Promise<number> {
    const members = await CommunityContracts.getMembersCount(address);
    const skillWalletIds = await CommunityContracts.getMembersSkillWalletIds(address);
    const uniqueSkills = [];
    let totalSkills: number = 0;

    skillWalletIds.forEach(async tokenId => {
        const skills = await SkillWalletContracts.getSkills(tokenId);
        if (!uniqueSkills.includes(skills.skill1.displayStringId))
            uniqueSkills.push(skills.skill1.displayStringId);
        totalSkills++;
        if (skills.skill2) {
            if (!uniqueSkills.includes(skills.skill2.displayStringId))
                uniqueSkills.push(skills.skill2.displayStringId);
            totalSkills++;
        }
        if (skills.skill3) {
            if (!uniqueSkills.includes(skills.skill3.displayStringId))
                uniqueSkills.push(skills.skill3.displayStringId);
            totalSkills++;
        }
    });
    const uniqueSkillsCount = uniqueSkills.length;
    const vc = (uniqueSkillsCount / totalSkills) * (members / 2);
    return vc * 100;
}
