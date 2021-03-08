import { access } from "fs";
import "hardhat";
import { ethers } from "hardhat";

// Goerli
// const SUPERFLUID_HOST = "0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9";
// const SUPERFLUID_CFA = "0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8";
// const ACCEPTED_TOKEN = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";

// Matic
const SUPERFLUID_HOST = "0xEB796bdb90fFA0f28255275e16936D25d3418603";
const SUPERFLUID_CFA = "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873"
const ACCEPTED_TOKEN = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";



async function main() {
  const contractFactory = await ethers.getContractFactory("SuperFluidTest");
  const contract = await contractFactory.deploy(
    SUPERFLUID_HOST,
    SUPERFLUID_CFA,
    ACCEPTED_TOKEN
  );

  await contract.deployed();

  console.log("contract deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
