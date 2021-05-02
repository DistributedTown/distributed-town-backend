import { ProjectsViewModel } from '../models';
import { getJSONFromURI } from '../utils/helpers';
import { ProjectsContracts } from '../contracts/projects.contract';
import { MilestonesContracts } from '../contracts/milestones.contract';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';

export async function getProjectsPerCommunity(communityAddress: string): Promise<ProjectsViewModel[]> {
    const projectIds = await ProjectsContracts.getProjectsByCommunityAddress(communityAddress);
    const projects = await Promise.all(projectIds.map(async projectId => {
        const projectMetadataUri = await ProjectsContracts.getTokenURI(projectId);
        let jsonMetadata = await getJSONFromURI(projectMetadataUri)
        console.log(jsonMetadata);
        return { ...jsonMetadata.properties, projectId: projectId.toString() };
    }));
    return projects as ProjectsViewModel[];
}

export async function createMilestone(skillWalletId: string, projectId: number, metadataUrl: string, ditoCredits: string): Promise<string> {
    const skillWalletAddress = await SkillWalletContracts.ownerOf(skillWalletId);
    const milestonesAddress = '0xE3Cf5aCb5ae2Db63B08f4B3c1d2b58F5b442266a';
    const milestoneId = await MilestonesContracts.createMilestone(milestonesAddress, skillWalletAddress, projectId, metadataUrl, ditoCredits)
    return milestoneId;
}