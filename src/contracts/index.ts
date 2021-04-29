import distributedTown from './abis/DistributedTown.json';
import community from './abis/Community.json';
import skillWallet from './abis/SkillWallet.json';

import { ethers, provider, signer } from '../tools/ethers';
// import { Biconomy } from "@biconomy/mexa";

require('dotenv').config()

let jsonRpcProvider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");

export const distributedTownContract = () => {
  try {
    let contract = new ethers.Contract(
      process.env.COMMUNITY_REGISTRY_ADDRESS,
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

export const gigsContract = () => {
  try {
    let contract = new ethers.Contract(
      process.env.GIGS_ADDRESS,
      community.abi, // TODO - change
      signer,
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
};



