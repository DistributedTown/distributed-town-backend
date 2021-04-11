import { communityRegistryContract } from "./index";
import { ethers } from 'ethers';
export class CommunityRegistryContracts {

  public static async getCommunities(
  ) {
    try {
      const contract = communityRegistryContract();
      const addresses = await contract.getCommunities();
      return addresses;
    } catch (err) {
      console.log(err);
    }
  }

  public static async getCommunityByIndex(
  ) {
    try {
      const contract = communityRegistryContract();
      const addresses = await contract.communityAddresses(0);
      console.log(addresses);
      return addresses;
    } catch (err) {
      console.log(err);
    }
  }

  public static async getCommunitiesCount(
  ) {
    try {
      const contract = communityRegistryContract();
      const communitiesCount = await contract.numOfCommunities();
      console.log(communitiesCount);
      return communitiesCount;
    } catch (err) {
      console.log(err);
    }
  }

  public static async createCommunity(
    _url: string,
    _ownerId: number,
    _ownerCredits: number,
    _name: string,
    _template: number,
    _positionalValue1: number,
    _positionalValue2: number,
    _positionalValue3: number
  ) {
    const communityRegistryContractInst = communityRegistryContract();

    communityRegistryContractInst.on(
      'CommunityCreated',
      (newCommunityAddress) => {
        console.log('Community created!');
        console.log(newCommunityAddress);
      },
    );
    try {
      let result = await communityRegistryContractInst.createCommunity(
        _url,
        _ownerId,
        _ownerCredits,
        _name,
        _template,
        _positionalValue1,
        _positionalValue2,
        _positionalValue3
      );

      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      return;
    }
  };



  public static async joinNewMember(
    communityAddress: string,
    userAddress: string,
    skillLevel1: number,
    displayStringId1: number,
    skillLevel2: number,
    displayStringId2: number,
    skillLevel3: number,
    displayStringId3: number,
    url: string
  ): Promise<boolean> {
    const communityRegistryContractInst = communityRegistryContract();
    // communityRegistryContractInst.on(
    //   'MemberJoined',
    //   (member, community, credits) => {
    //     console.log('Community created!');
    //     console.log(member);
    //     console.log(community);
    //     return true;
    //   },
    // );
    try {
      let overrides = {
        // The maximum units of gas for the transaction to use
        gasLimit: 2300000,
      };
      const createTx = await communityRegistryContractInst.joinNewMember(
        communityAddress,
        userAddress,
        displayStringId1,
        skillLevel1,
        displayStringId2,
        skillLevel2,
        displayStringId3,
        skillLevel3,
        url,
        overrides
      );

      const communityTransactionResult = await createTx.wait();
      // const { events } = communityTransactionResult;
      // const memberJoinedEvent = events.find(
      //   e => e.event === 'MemberJoined',
      // );

      // if (!memberJoinedEvent) {
      //   throw new Error('Something went wrong');
      // }

    } catch (err) {
      console.log(err);
      return;
    }
  };
}