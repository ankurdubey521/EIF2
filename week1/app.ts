import { ethers, providers, utils, Wallet } from "ethers";
import fs from "fs";
import { maxHeaderSize } from "http";
import data from "./data";

const gethNodeUrl = "http://127.0.0.1:9545";
const jsonPrivateKeyData = JSON.stringify(data);
const privateKeyPassword = "gammartbym";
const message = "gEth is Money";

let getWalletAndProvider = async (): Promise<{
  wallet: ethers.Wallet;
  provider: ethers.providers.JsonRpcProvider;
}> => {
  console.log("Initializing wallet and providers...");
  const provider = new ethers.providers.JsonRpcProvider(gethNodeUrl);
  let wallet = await ethers.Wallet.fromEncryptedJson(
    jsonPrivateKeyData,
    privateKeyPassword
  );
  wallet = wallet.connect(provider);
  getWalletAndProvider = async (): Promise<{
    wallet: ethers.Wallet;
    provider: ethers.providers.JsonRpcProvider;
  }> => ({ wallet, provider });

  return { wallet, provider };
};

const getHexRepresentation = (num: number): string => {
  if (num == 0) {
    return "0x0";
  }
  return ethers.BigNumber.from(num)
    .toHexString()
    .replace(/^0x(0)*/, "0x");
};

const isAddressSmartContract = async (address: string): Promise<boolean> => {
  const { provider } = await getWalletAndProvider();
  return (await provider.getCode(address)) !== "0x";
};

const findBlockwithFirstSmartContract = async () => {
    

}

const getBlockDataByNumber = async (
  blockNumber: number
): Promise<Record<string, string>> => {
  const { provider } = await getWalletAndProvider();
  return provider.send("eth_getBlockByNumber", [
    getHexRepresentation(blockNumber),
    true,
  ]);
};

const getBlockTransactions = async (blockNumber: number) => {
  const { provider } = await getWalletAndProvider();
  const blockTransactionCount: number = parseInt(
    await provider.send("eth_getBlockTransactionCountByNumber", [
      getHexRepresentation(blockNumber),
    ]),
    16
  );
  console.log(blockTransactionCount);
  return Promise.all(
    Array(blockTransactionCount)
      .fill(0)
      .map((_, index) =>
        provider.send("eth_getTransactionByBlockNumberAndIndex", [
          getHexRepresentation(blockNumber),
          getHexRepresentation(index),
        ])
      )
  );
};

const module2 = async (): Promise<void> => {
  console.log("Module 2");

  const { wallet } = await getWalletAndProvider();
  console.log(`Address:${wallet.address}`);
  console.log(`Public Key: ${wallet.publicKey}`);

  // Sign message
  const messageSignature = await wallet.signMessage(message);
  console.log(`Message Signature:${messageSignature}`);
  if (
    wallet.address === ethers.utils.verifyMessage(message, messageSignature)
  ) {
    console.log("Message verfied against signature and address");
  } else {
    console.error("Message verification failed");
  }

  // Send a self transaction
  const tx = {
    to: wallet.address,
    value: utils.parseEther("0.001"),
  };
  const { hash } = await wallet.sendTransaction(tx);
  console.log(`Transaction Hash: ${hash}`);
};

const module3 = async (): Promise<void> => {
  console.log("Module 3");
  const { provider } = await getWalletAndProvider();
  const blockValues = await Promise.all(
    new Array(128)
      .fill(0)
      .map((value: number, index: number) => getBlockDataByNumber(index))
  );
  const hashValuesFirst128BlocksGoerli: string = blockValues
    .map((x) => x.hash)
    .reduce((a: string, b: string): string => `${a}\n${b}`);
  fs.writeFile(
    "hash_first_128_goerli_blocks.txt",
    hashValuesFirst128BlocksGoerli,
    (err: any) => {
      if (err) throw err;
    }
  );
};

// const getAllStorageRootHash = async () => {
//   const allData = await Promise.all(
//     new Array(10).fill(10).map((_, index) => getBlockDataByNumber(index))
//   );
//   let results: Record<string, Record<string, number>> = {};
//   allData.forEach(({ stateRoot }, index) => {
//     if (results[stateRoot] === undefined) {
//       results[stateRoot] = {
//         minv: index,
//         maxv: index,
//       };
//     } else {
//       const { minv, maxv } = results[stateRoot];
//       results[stateRoot] = {
//         maxv: Math.max(maxv, index),
//         minv: Math.min(minv, index),
//       };
//     }
//   });
//   console.log(results);
// };

const main = async (): Promise<void> => {
  //   await module2();
  //   await module3();
  // console.log(await getBlockTransactions(4217858));
};

main().then(() => {});
