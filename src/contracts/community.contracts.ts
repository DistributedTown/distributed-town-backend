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

  
  public static async getGigsConntractAddress(
    address: string
  ) {
    try {
      const contract = communityContract(address);
      const gigsAddr = await contract.gigsAddr();
      return gigsAddr;
    } catch (err) {
      console.log(err);
    }
  }
}