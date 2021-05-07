import { ethers, provider, signer } from '../tools/ethers';
import { skillWalletContract } from './index';

export class SkillWalletContracts {

    public static async getSkillWalletIdByOwner(address: string): Promise<string> {
        try {
            const contract = skillWalletContract();
            const tokenId = await contract.getSkillWalletIdByOwner(address);
            return tokenId.toString();
        } catch (err) {
            console.log(err);
        }
    }

    public static async getTokenURI(tokenId: string): Promise<string> {
        try {
            const contract = skillWalletContract();
            const uri = await contract.tokenURI(tokenId);
            return uri;
        } catch (err) {
            console.log(err);
        }
    }

    public static async getCommunityHistory(tokenId: string): Promise<any> {
        try {
            const contract = skillWalletContract();
            const history = await contract.getCommunityHistory(tokenId);
            return history;
        } catch (err) {
            console.log(err);
        }
    }

    public static async getCurrentCommunity(tokenId: string): Promise<any> {
        try {
            const contract = skillWalletContract();
            const community = await contract.getActiveCommunity(tokenId);
            return community;
        } catch (err) {
            console.log(err);
        }
    }

    public static async getSkills(tokenId: string): Promise<any> {
        try {
            const contract = skillWalletContract();
            const skills = await contract.getSkillSet(tokenId);
            return skills;
        } catch (err) {
            console.log(err);
        }
    }


    public static async isActive(tokenId: string): Promise<boolean> {
        try {
            const contract = skillWalletContract();
            const isRegistered = await contract.isSkillWalletActivated(tokenId);
            return isRegistered;
        } catch (err) {
            console.log(err);
        }
    }


    public static async ownerOf(tokenId: string): Promise<string> {
        try {
            const contract = skillWalletContract();
            const owner = await contract.ownerOf(tokenId);
            return owner;
        } catch (err) {
            console.log(err);
        }
    }

    public static async activate(tokenId: number, pubKey: string): Promise<boolean> {
        const contractInst = skillWalletContract();

        try {
            let createTx = await contractInst.activateSkillWallet(
                tokenId,
                pubKey
            );

            // Wait for transaction to finish
            const registerSkillWalletTransactionResult = await createTx.wait();
            const { events } = registerSkillWalletTransactionResult;
            const registeredEvent = events.find(
                e => e.event === 'SkillWalletActivated',
            );
            if (!registeredEvent)
                throw Error('Something went wrong!');
            else 
                console.log('Skill wallet activated')
        } catch (err) {
            console.log(err);
            return;
        }
    }
}
