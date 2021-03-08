import "hardhat";
import { ethers } from "hardhat";
import fs, { readFileSync } from "fs";
import path from "path";

// const contractAddress = "0x6dC49bF769935765759952B2050318E76E1a4347";

// matic
const contractAddress = "0x81010d6147Ac567865bB95D31E59569F16716800";

const main = async () => {
  const [owner] = await ethers.getSigners();

  const rawAbi = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../artifacts/contracts/SuperFluidTest.sol/SuperFluidTest.json"
      )
    )
    .toString();
  const abi = JSON.parse(rawAbi).abi;

  const contract = new ethers.Contract(contractAddress, abi, owner);

  await contract.transferFDaiToAddress(
    "0x83df7F905346B198D624A5C2E5F39031fFEEf9F2",
    1
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
