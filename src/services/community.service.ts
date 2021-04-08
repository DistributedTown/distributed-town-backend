import { CommunityListView, skillNames, SkillSet } from '../models';
import { CommunityContracts } from '../contracts/community.contracts';
import { CommunityRegistryContracts } from '../contracts/communityRegistry.contracts';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { calculateInitialCreditsAmount } from './skills.service';

export async function getCommunities(template: number): Promise<any> {
    const allCommunities = await CommunityRegistryContracts.getCommunities();

    const result: CommunityListView[] = [];
    for (let community of allCommunities) {
        const name = await CommunityContracts.getName(community);
        const members = await CommunityContracts.getMembersCount(community);
        const scarcityScore = await calculateScarcityStore(community);

        result.push({
            name,
            members,
            scarcityScore,
            address: community
        });
    }
    return result;
}

export async function join(communityAddress: string, userAddress: string, skills: SkillSet, url: string) {
    console.log(skills);
    const displayName1 = skillNames.indexOf(skills.skills[0].name);
    const displayName2 = skillNames.indexOf(skills.skills[1].name);
    const displayName3 = skillNames.indexOf(skills.skills[2].name);
    const calculateDitos = await calculateInitialCreditsAmount(skills.skills)
    const joined = await CommunityRegistryContracts.joinNewMember(
        communityAddress,
        userAddress,
        displayName1,
        skills.skills[0].value,
        displayName2,
        skills.skills[1].value,
        displayName3,
        skills.skills[2].value,
        url,
        calculateDitos.toString()
    );
    return calculateDitos;
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
