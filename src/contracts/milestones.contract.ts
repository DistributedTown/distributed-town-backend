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
                ditoCredits,
                metadataUrl,
                projectId
            );

            // Wait for transaction to finish
            const createMilestoneResult = await createTx.wait();
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
}
