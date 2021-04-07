import { communityRegistryContract } from "./index";
import { communityContract } from "./index";

export class CommunityContracts {

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
}