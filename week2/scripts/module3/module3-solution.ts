const hardhat = require("hardhat");
const ethers = hardhat.ethers;

const main = async (): Promise<void> => {
  const ownerFactory = await hardhat.ethers.getContractFactory("OwnerModule1");
  const owner = await ownerFactory.deploy();

  const ownerContractOwnersAddress = await owner.getOwner();

  console.log(`Current Owner Address: ${ownerContractOwnersAddress}`);
  console.log(
    `"Devfolio" represented as bytes32: ${ethers.utils.formatBytes32String(
      "Address"
    )}`
  );
};

main()
  .then(() => {})
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
