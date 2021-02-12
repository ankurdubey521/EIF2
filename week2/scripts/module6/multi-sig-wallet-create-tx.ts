import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";
import fs, { readFileSync } from "fs";
import path from "path";

interface Transaction {
  wallet: string;
  to: string;
  amount: number;
  transactionType: 0 | 1;
  token: string;
  nonce: number;
}
/**
 * @dev comptues a hash for transaction
 * @param transaction input transaction
 */
const getTransactionHash = (transaction: Transaction): string =>
  ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      [
        "address",
        "address payable",
        "uint256",
        "uint256",
        "address",
        "uint256",
      ],
      [
        transaction.wallet,
        transaction.to,
        transaction.amount,
        transaction.transactionType,
        transaction.token,
        transaction.nonce,
      ]
    )
  );

/**
 * @dev comptues signature for transaction
 * @param transaction input transaction
 * @param signer account using which tx is to be signed
 */
const signTransaction = async (
  transaction: Transaction,
  signer: SignerWithAddress
): Promise<{
  v: number;
  r: string;
  s: string;
}> => {
  const hash = getTransactionHash(transaction);
  const hashBytes = ethers.utils.arrayify(hash);
  const signature = await signer.signMessage(hashBytes);
  const { v, r, s } = ethers.utils.splitSignature(signature);
  return { v, r, s };
};
/**
 * @dev comptues signature arrays transaction
 * @param t input transaction
 * @param signers array of accounts
 */
const getSignatureArrays = async (
  t: Transaction,
  signers: SignerWithAddress[]
): Promise<{ v: number[]; r: string[]; s: string[] }> => {
  const signatures = await Promise.all(
    signers.map((signer) => signTransaction(t, signer))
  );
  const signatureArrays: { v: number[]; r: string[]; s: string[] } = {
    v: [],
    r: [],
    s: [],
  };
  signatures.forEach(({ v, r, s }) => {
    signatureArrays.v.push(v);
    signatureArrays.r.push(r);
    signatureArrays.s.push(s);
  });
  return signatureArrays;
};

const createTx = async () => {
  const address = "0xa85b5D6eD37A65cC82E476365B1EEa26e6EFf77d";
  const [owner, member1, reciever] = await ethers.getSigners();

  const rawAbi = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../artifacts/contracts/module6/MultiSigWallet.sol/MultiSigWallet.json"
      )
    )
    .toString();
  const abi = JSON.parse(rawAbi).abi;

  const contract = new ethers.Contract(address, abi, owner);

  // Check current noce
  const nonce = await contract.nonce();
  console.log(`New Nonce: ${nonce}`);

  // Add members and set threshold to 2 of 2
  console.log("Add members and set threshold to 2 of 2");
  await contract["addMember(address,uint256)"](member1.address, 2);

  // Send some ether to the contract
  console.log("Send some ether to the contract");
  await owner.sendTransaction({
    to: contract.address,
    value: ethers.utils.parseEther("0.0004"),
  });

  // Create a transaction to send 0..002 ether to reciever
  console.log("Create a transaction to send 0.0002 ether to reciever");
  const transaction: Transaction = {
    wallet: contract.address,
    to: reciever.address,
    amount: ethers.utils.parseEther("0.0002"),
    transactionType: 0,
    token: "0x0000000000000000000000000000000000000000",
    nonce: nonce,
  };
  const transactionHash = await contract.getTransactionHash(transaction);
  console.log(`Transaction hash: ${transactionHash}`);

  // Sign the transaction locally with keys from owner and member1
  const { v, r, s } = await getSignatureArrays(transaction, [owner, member1]);

  // Execute the transaction
  console.log("Execute the transaction");
  const tx = await contract.executeTransaction(
    transaction,
    v,
    r,
    s,
    [owner.address, member1.address],
    {
      gasLimit: 24817 * 10,
    }
  );
  console.log(`transaction: ${JSON.stringify(tx)}`);
};

createTx()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
