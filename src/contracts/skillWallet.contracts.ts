import { ethers, provider, signer } from '../tools/ethers';
import { skillWalletContract} from './index';

export class SkillWalletContracts {


    public static async getTokenURI(tokenId: number): Promise<string> {
        try {
            const contract = skillWalletContract();
            const uri = await contract.tokenURI(tokenId);
            return uri;
        } catch (err) {
            console.log(err);
        }
    }

    public static async getCommunityHistory(tokenId: number): Promise<any> {
        try {
            const contract = skillWalletContract();
            const history = await contract.getCommunityHistory(tokenId);
            return history;
        } catch (err) {
            console.log(err);
        }
    }

    public static async getCurrentCommunity(tokenId: number): Promise<any> {
        try {
            const contract = skillWalletContract();
            const community = await contract.getActiveCommunity(tokenId);
            return community;
        } catch (err) {
            console.log(err);
        }
    }

    public static async getSkills(tokenId: number): Promise<any> {
        try {
            const contract = skillWalletContract();
            const skills = await contract.getSkillSet(tokenId);
            return skills;
        } catch (err) {
            console.log(err);
        }
    }


    public static async isSkillWalletRegistered(tokenId: number): Promise<boolean> {
        try {
            const contract = skillWalletContract();
            const isRegistered = await contract.isSkillWalletRegistered(tokenId);
            return isRegistered;
        } catch (err) {
            console.log(err);
        }
    }

    public static async registerSkillWallet(tokenId: number): Promise<boolean> {
        const contractInst = skillWalletContract();

        contractInst.on(
            'Registered',
            (tokenId) => {
                console.log('SW registered!');
                console.log(tokenId);
                return true;
            },
        );
        try {
            let createTx = await contractInst.registerSkillWallet(
                tokenId
            );

            // Wait for transaction to finish
            const registerSkillWalletTransactionResult = await createTx.wait();
            const { events } = registerSkillWalletTransactionResult;
            const registeredEvent = events.find(
                e => e.event === 'Registered',
            );

            return registeredEvent;
        } catch (err) {
            console.log(err);
            return;
        }
    }
}
