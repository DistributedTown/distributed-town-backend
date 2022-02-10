import distributedTown from './abis/DistributedTown.json';
import community from './abis/Community.json';
import skillWallet from './abis/SkillWallet.json';
import gigs from './abis/Gigs.json';
import { CommunityContracts } from './community.contracts';
import { ethers, signer } from '../tools/ethers';

require('dotenv').config()

let jsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC_PROVIDER);

export const distributedTownContract = () => {
  try {
    let contract = new ethers.Contract(
      process.env.DISTRIBUTED_TOWN_ADDRESS,
      distributedTown.abi,
      signer,
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
};

export const skillWalletContract = () => {
  try {
    let contract = new ethers.Contract(
      process.env.SKILL_WALLET_ADDRESS,
      skillWallet.abi,
      signer,
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
}
export const communityContract = (address) => {
  try {
    let contract = new ethers.Contract(
      address,
      community.abi,
      signer,
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
};

export const gigsContract = async (communityAddress) => {
  try {
    const gigsAddr = await CommunityContracts.getGigsConntractAddress(communityAddress)
    let contract = new ethers.Contract(
      gigsAddr,
      gigs.abi,
      signer,
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
};




