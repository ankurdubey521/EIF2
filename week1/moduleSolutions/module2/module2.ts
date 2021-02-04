import { ethers, providers, utils } from "ethers";

import { getWalletAndProvider } from "../../utils/utils";
import { MESSAGE } from "../../data/constants";

const module2 = async (): Promise<void> => {
  console.log("Running Module 2");

  const { wallet, provider } = await getWalletAndProvider();
  console.log(`Address:${wallet.address}`);
  console.log(`Public Key: ${wallet.publicKey}`);

  // Sign message
  const messageSignature = await wallet.signMessage(MESSAGE);
  console.log(`Message Signature:${messageSignature}`);
  if (
    wallet.address === ethers.utils.verifyMessage(MESSAGE, messageSignature)
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

  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`Wallet Balance: ${balance}`);
};

export default module2;
