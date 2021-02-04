import { ethers, providers, utils, Wallet } from "ethers";
import { GETH_NODE_URL, PRIVATE_KEY_PASSWORD } from "../data/constants";
import { privateKey } from "../data/privateKey";

interface ethereumBlock {
  difficulty: string;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: string;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: string;
  stateRoot: string;
  timestamp: string;
  totalDifficulty: string;
  transactions: string[];
  transactionsRoot: string;
  uncles: string[];
}

interface ethereumTransaction {
  blockHash: string;
  blockNumber: string;
  from: string;
  gas: string;
  gasPrice: string;
  hash: string;
  input: string;
  nonce: string;
  to: string;
  transactionIndex: string;
  value: string;
  v: string;
  r: string;
  s: string;
}

let getWalletAndProvider = async (): Promise<{
  wallet: ethers.Wallet;
  provider: ethers.providers.JsonRpcProvider;
}> => {
  console.log("Initializing wallet and providers...");
  const provider = new ethers.providers.JsonRpcProvider(GETH_NODE_URL);
  let wallet = await ethers.Wallet.fromEncryptedJson(
    JSON.stringify(privateKey),
    PRIVATE_KEY_PASSWORD
  );
  wallet = wallet.connect(provider);

  getWalletAndProvider = async (): Promise<{
    wallet: ethers.Wallet;
    provider: ethers.providers.JsonRpcProvider;
  }> => ({ wallet, provider });

  return { wallet, provider };
};

const isAddressSmartContract = async (address: string): Promise<boolean> => {
  const { provider } = await getWalletAndProvider();
  return (await provider.getCode(address)) !== "0x";
};

const getHexRepresentation = (num: number): string => {
  if (num == 0) {
    return "0x0";
  }
  return ethers.BigNumber.from(num)
    .toHexString()
    .replace(/^0x(0)*/, "0x");
};

const getBlockDataByNumber = async (
  blockNumber: number
): Promise<ethereumBlock> => {
  const { provider } = await getWalletAndProvider();
  return provider.send("eth_getBlockByNumber", [
    getHexRepresentation(blockNumber),
    true,
  ]);
};

const getBlockTransactions = async (
  blockNumber: number
): Promise<ethereumTransaction[]> => {
  const { provider } = await getWalletAndProvider();
  const blockTransactionCount: number = parseInt(
    await provider.send("eth_getBlockTransactionCountByNumber", [
      getHexRepresentation(blockNumber),
    ]),
    16
  );
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

getWalletAndProvider().then(() => {});
export {
  getWalletAndProvider,
  getHexRepresentation,
  getBlockDataByNumber,
  getBlockTransactions,
  isAddressSmartContract,
  ethereumTransaction,
  ethereumBlock
};
