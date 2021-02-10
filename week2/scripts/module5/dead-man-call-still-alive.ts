import fs, { readFileSync } from "fs";
import path from "path";

const deadManCallAlive = async () => {
  const address = "0xc9d1F72475FD6d6034399032704d7EAced7FDd28";
  const [owner] = await ethers.getSigners();

  const rawAbi = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../artifacts/contracts/module5/DeadManSwitch.sol/DeadManSwitch.json"
      )
    )
    .toString();
  const abi = JSON.parse(rawAbi).abi;

  const contract = new ethers.Contract(address, abi, owner);

  console.log(
    `Last alive called block: ${await contract.lastAliveCalledBlock()}`
  );

  const hash = (await await contract.stillAlive()).hash;
  console.log(`stillAlive() tx hash: ${hash}`);
};

deadManCallAlive()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
