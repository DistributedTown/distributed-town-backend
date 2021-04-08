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
            scarcityScore,
            address: community
        });
        // }
    }
    return result;
}

export async function testJoin() {
    const allCommunities = await CommunityRegistryContracts.getCommunities();
    const url = 'https://hub.textile.io/thread/bafkwfcy3l745x57c7vy3z2ss6ndokatjllz5iftciq4kpr4ez2pqg3i/buckets/bafzbeiaorr5jomvdpeqnqwfbmn72kdu7vgigxvseenjgwshoij22vopice';
    const joined = await CommunityRegistryContracts.joinNewMember(allCommunities[0], {}, url, 2006);
    console.log(joined);
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
