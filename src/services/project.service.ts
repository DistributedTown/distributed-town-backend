import { Milestone, ProjectsViewModel } from '../models';
import { getJSONFromURI } from '../utils/helpers';
import { ProjectsContracts } from '../contracts/projects.contract';
import { MilestonesContracts } from '../contracts/milestones.contract';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
const milestonesAddress = '0xE3Cf5aCb5ae2Db63B08f4B3c1d2b58F5b442266a';

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
    const milestoneId = await MilestonesContracts.createMilestone(milestonesAddress, skillWalletAddress, projectId, metadataUrl, ditoCredits)
    return milestoneId;
}

export async function getMilestones(projectId: string) : Promise<Milestone[]>{
    const milestoneIds = ['0'];
    const milestones = await Promise.all(milestoneIds.map(async milestoneId => {
        const milestonesMetadata = await MilestonesContracts.getTokenURI(milestonesAddress, milestoneId);
        let jsonMetadata = await getJSONFromURI(milestonesMetadata)
        console.log(jsonMetadata);
        return { ...jsonMetadata, milestoneId: milestoneId.toString() };
    }));
    return milestones as Milestone[];
}  