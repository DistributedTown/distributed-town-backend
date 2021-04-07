import { communityRegistryContract } from "./index";

export class CommunityRegistryContracts {

  public static async getCommunities(
  ) {
    try {
      const contract = communityRegistryContract();
      const addresses = await contract.getCommunities();
      console.log(addresses);
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
}