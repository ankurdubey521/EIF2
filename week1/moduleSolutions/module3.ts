import fs from "fs";
import path from "path";

import {
  getWalletAndProvider,
  getBlockTransactions,
  getBlockDataByNumber,
  ethereumTransaction,
} from "../utils/utils";

const findBlockwithFirstSmartContract = async () => {
  const batchSize = 1000;
  let start = 0;
  const { provider } = await getWalletAndProvider();
  let foundStatus = false;

  const findInBatch = async (start: number) => {
    const blocksTransactions: ethereumTransaction[][] = await Promise.all(
      Array(batchSize)
        .fill(0)
        .map((_, index) => getBlockTransactions(start + index))
    );
    for (let i = 0; i < blocksTransactions.length; ++i) {
      for (const {
        to,
        blockHash,
        transactionIndex,
        blockNumber,
      } of blocksTransactions[i]) {
        if (to === null) {
          foundStatus = true;
          console.log(
            `Found Contract Creating Transaction: ${JSON.stringify({
              to,
              blockHash,
              transactionIndex,
              blockNumber: parseInt(blockNumber),
            })}`
          );
        }
      }
    }
  };
  while (!foundStatus) {
    try {
      await findInBatch(start);
    } catch (e) {
      console.log(e);
    }
    start += batchSize;
  }
};

const module3 = async (): Promise<void> => {
  console.log("Module 3");
  await getWalletAndProvider();
  const blockValues = await Promise.all(
    new Array(128)
      .fill(0)
      .map((value: number, index: number) => getBlockDataByNumber(index))
  );
  console.log("Writing hashes of first 128 blocks to file");
  const hashValuesFirst128BlocksGoerli: string = blockValues
    .map((x) => x.hash)
    .reduce((a: string, b: string): string => `${a}\n${b}`);
  fs.writeFile(
    path.resolve(__dirname, "../data/hash_first_128_goerli_blocks.txt"),
    hashValuesFirst128BlocksGoerli,
    (err: any) => {
      if (err) throw err;
    }
  );
  console.log("Finding first block with contract creating address");
  await findBlockwithFirstSmartContract();
};
export default module3;