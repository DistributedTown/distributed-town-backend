import { CommunityListView, skillNames, SkillSet } from '../models';
import { CommunityContracts } from '../contracts/community.contracts';
import { DistributedTownContracts } from '../contracts/distributedTown.contracts';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { getCreditsBySkill } from './skills.service';
import threadDBClient from '../threaddb.config';
import { PendingSWActivationCollection } from '../constants/constants';
import { getJSONFromURI } from '../utils/helpers';
import { ethers } from 'ethers';

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

export async function join(communityAddress: string, userAddress: string, skills: SkillSet, url: string) {
    console.log(skills);
    const displayName1 = skillNames.indexOf(skills.skills[0].name);
    const displayName2 = skillNames.indexOf(skills.skills[1].name);
    const displayName3 = skillNames.indexOf(skills.skills[2].name);
    const calculateDitos = (await getCreditsBySkill(skills.skills)) + 2000;

    console.log( 
        userAddress,
        displayName1,
        skills.skills[0].value,
        displayName2,
        skills.skills[1].value,
        displayName3,
        skills.skills[2].value,
        url
        );

    const skillWalletId = await CommunityContracts.joinNewMember(
        communityAddress,
        userAddress,
        displayName1,
        skills.skills[0].value,
        displayName2,
        skills.skills[1].value,
        displayName3,
        skills.skills[2].value,
        url,
        ethers.utils.parseEther(calculateDitos.toString()).toString()
    );

    threadDBClient.insert(PendingSWActivationCollection, {
        tokenId: skillWalletId,
        isActivated: false
    })

    return { tokenId: skillWalletId, credits: calculateDitos };
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
