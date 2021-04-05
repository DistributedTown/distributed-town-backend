import { communityRegistryContract, gigsContract } from "./index";
import { communityContract } from "./index";

export class GigsContracts {

  public static async getName(
    address: string
  ) {
    try {
      const contract = communityContract(address);
      const skills = await contract.getName();
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
      const skills = await contract.getMembersSkillWalletIds();
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
      const skills = await contract.getMembersCount();
      return skills;
    } catch (err) {
      console.log(err);
    }
  }
}