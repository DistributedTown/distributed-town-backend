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
    address: string,
    skills: any,
    url: string,
    ditos: number
  ) {
    const communityRegistryContractInst = communityRegistryContract();

    // communityRegistryContractInst.on(
    //   'MemberAdded',
    //   (newMemberAddress, tokenId, credits) => {
    //     console.log('Member added!');
    //     console.log(newMemberAddress);
    //     console.log(tokenId);
    //     console.log(credits);
    //   },
    // );
    try {
      const tokens = ethers.utils.parseEther("2006");
      let one_bn = ethers.BigNumber.from(1);
      let skill = [one_bn, one_bn]
      let skillSet = [skill, skill, skill];

      let result = await communityRegistryContractInst.joinNewMember(
        address,
        skillSet,
        url,
        tokens
      );

      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      return;
    }
  };
}