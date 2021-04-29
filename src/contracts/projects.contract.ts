import { projectsContract } from './index';

export class ProjectsContracts {

    public static async createProject(props: string, template: number, communityAddress: string): Promise<boolean> {
        const contractInst = projectsContract();

        try {
            let createTx = await contractInst.createProject(
                props,
                template,
                communityAddress
            );

            // Wait for transaction to finish
            const createProjectsResult = await createTx.wait();
            const { events } = createProjectsResult;
            const registeredEvent = events.find(
                e => e.event === 'ProjectCreated',
            );
            if (!registeredEvent)
                throw Error('Something went wrong!');
            else {
                console.log('Project created');
                return registeredEvent.args[0];
            }
        } catch (err) {
            console.log(err);
            return;
        }
    }


    public static async getTokenURI(tokenId: string): Promise<string> {
        try {
            const contract = projectsContract();
            const uri = await contract.tokenURI(tokenId);
            return uri;
        } catch (err) {
            console.log(err);
        }
    }
    public static async getProjectsByCommunityAddress(communityAddress: string) {
        try {
          const contract = projectsContract();
          const projects = await contract.getCommunityProjects(communityAddress);
          console.log(projects);
          return projects;
        } catch (err) {
          console.log(err);
        }
      }
}
