import { distributedTownContract } from "./index";
export class DistributedTownContracts {

  public static async getCommunities() {
    try {
      const contract = distributedTownContract();
      const addresses = await contract.getCommunities();
      console.log(addresses);
      return addresses;
    } catch (err) {
      console.log(err);
    }
  }

  public static async getMetadata(tokenID: string) {
    try {
      const contract = distributedTownContract();
      const url = await contract.uri(tokenID);
      console.log(url);
      return url;
    } catch (err) {
      console.log(err);
    }
  }


  // TODO: update
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
    const distributedTownContractInst = distributedTownContract();

    distributedTownContractInst.on(
      'CommunityCreated',
      (newCommunityAddress) => {
        console.log('Community created!');
        console.log(newCommunityAddress);
      },
    );
    try {
      let result = await distributedTownContractInst.createCommunity(
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