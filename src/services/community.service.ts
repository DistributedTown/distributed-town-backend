import { CommunityListView } from '../models';
import { CommunityContracts } from '../contracts/community.contracts';
import { CommunityRegistryContracts } from '../contracts/communityRegistry.contracts';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';

export async function getCommunities(template: number): Promise<any> {
    const allCommunities = await CommunityRegistryContracts.getCommunities();
    const result: CommunityListView[] = [];
    for (let community of allCommunities) {
        // const comTemplate = await CommunityContracts.getTemplate(community);
        // console.log(template);
        // if (comTemplate == template) {
            const name = await CommunityContracts.getName(community);
            const members = await CommunityContracts.getMembersCount(community);
            const scarcityScore = await calculateScarcityStore(community);

            result.push({
                name,
                members,
                scarcityScore
            });
        // }
    }
    return result;
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
