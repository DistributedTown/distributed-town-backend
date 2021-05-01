import { ProjectsViewModel } from '../models';
import { getJSONFromURI } from '../utils/helpers';
import { ProjectsContracts } from '../contracts/projects.contract';

export async function getProjectsPerCommunity(communityAddress: string): Promise<ProjectsViewModel[]> {
    const projectIds = await ProjectsContracts.getProjectsByCommunityAddress(communityAddress);
    const projects = await Promise.all(projectIds.map(async projectId => {
        const projectMetadataUri = await ProjectsContracts.getTokenURI(projectId);
        let jsonMetadata = await getJSONFromURI(projectMetadataUri)
        console.log(jsonMetadata);
        return jsonMetadata.properties;
    }));
    return projects as ProjectsViewModel[];
}
