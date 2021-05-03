import { ethers } from 'ethers';
import { milestonesContract } from './index';

export class MilestonesContracts {

    public static async createMilestone(
        milestonesAddress: string,
        creator: string,
        projectId: number,
        metadataUrl: string,
        ditoCredits: string)
        : Promise<string> {
        const contractInst = milestonesContract(milestonesAddress);

        try {

            let createTx = await contractInst.createMilestone(
                creator,
                // ethers.utils.parseEther(ditoCredits.toString()).toString(),
                ditoCredits,
                metadataUrl,
                projectId
            );

            console.log(createTx);
            // Wait for transaction to finish
            const createMilestoneResult = await createTx.wait();
            console.log(createMilestoneResult);
            const { events } = createMilestoneResult;
            const registeredEvent = events.find(
                e => e.event === 'MilestoneCreated',
            );
            if (!registeredEvent)
                throw Error('Something went wrong!');
            else {
                console.log('Milestone created');
                return registeredEvent.args[0].toString();
            }
        } catch (err) {
            console.log(err);
            return;
        }
    }

    public static async getProjectMilestones(milestonesAddress: string, projectId: string) {
        try {
            const contract = milestonesContract(milestonesAddress);
            const milestones = await contract.projectMilestones(projectId);
            return milestones;
        } catch (err) {
            console.log(err);
        }
    }


    public static async getTokenURI(milestonesAddress: string, tokenId: string): Promise<string> {
        try {
            const contract = milestonesContract(milestonesAddress);
            const uri = await contract.tokenURI(tokenId);
            return uri;
        } catch (err) {
            console.log(err);
        }
    }
}
