import { distributedTownContract } from "./index";
import { communityContract } from "./index";

export class CommunityContracts {

  public static async getDiToBalance(
    communityAddress: string,
    userAddress: string
  ) {
    try {
      const contract = communityContract(communityAddress);
      const balance = await contract.balanceOf(userAddress, 0);
      return balance.toString();
    } catch (err) {
      console.log(err);
    }
  }
  public static async getName(
    address: string
  ) {
    try {
      const contract = communityContract(address);
      const skills = await contract.name();
      return skills;
    } catch (err) {
      console.log(err);
    }
  }

  public static async getMembersSkillWalletIds(
    address: string
  ) {
    try {
      const contract = communityContract(address);
      const skills = await contract.getSkillWalletIds();
      return skills;
    } catch (err) {
      console.log(err);
    }
  }

  public static async getMembersCount(
    address: string
  ) {
    try {
      const contract = communityContract(address);
      const skills = await contract.activeMembersCount();
      return skills;
    } catch (err) {
      console.log(err);
    }
  }

  public static async getTemplate(
    address: string
  ) {
    try {
      const contract = communityContract(address);
      const skills = await contract.getTemplate();
      return skills;
    } catch (err) {
      console.log(err);
    }
  }

  public static async getPositionalValues(
    address: string
  ) {
    try {
      const contract = communityContract(address);
      const skills = await contract.getPositionalValues();
      return skills;
    } catch (err) {
      console.log(err);
    }
  }

  public static async getMetadataUri(
    address: string
  ) {
    try {
      const contract = communityContract(address);
      const uri = await contract.metadataUri();
      return uri;
    } catch (err) {
      console.log(err);
    }
  }

  public static async joinNewMember(
    communityAddress: string,
    userAddress: string,
    skillLevel1: number,
    displayStringId1: number,
    skillLevel2: number,
    displayStringId2: number,
    skillLevel3: number,
    displayStringId3: number,
    url: string,
    credits: string
  ): Promise<string> {
    const communityContractInst = communityContract(communityAddress);
    try {
      let overrides = {
        // The maximum units of gas for the transaction to use
        gasLimit: 2300000,
      };
      const createTx = await communityContractInst.joinNewMember(
        userAddress,
        displayStringId1,
        skillLevel1,
        displayStringId2,
        skillLevel2,
        displayStringId3,
        skillLevel3,
        url,
        credits,
        overrides
      );

      const communityTransactionResult = await createTx.wait();
      const { events } = communityTransactionResult;
      const memberJoinedEvent = events.find(
        e => e.event === 'MemberAdded',
      );

      if (!memberJoinedEvent) {
        throw new Error('Something went wrong');
      } else {
        console.log('MemberAdded');
        return memberJoinedEvent.args[1].toString();
      }

    } catch (err) {
      console.log(err);
      return;
    }
  };
}