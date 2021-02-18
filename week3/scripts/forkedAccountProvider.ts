import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";
import hardhat from "hardhat";

import { ERC20_ABI } from "../constants/erc20abi";
import {
  ADDRESS_TOKEN_USDT,
  ADDRESS_EOA_USDT_RICH,
} from "../constants/contractMainnetAddress";

let getSigner = async (): Promise<SignerWithAddress> => {
  const [testSigner] = await ethers.getSigners();
  // Initialize USDT token contract
  const usdtToken = new ethers.Contract(
    ADDRESS_TOKEN_USDT,
    ERC20_ABI,
    testSigner
  );

  // Start impersonating account with high USDT balance
  await hardhat.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [ADDRESS_EOA_USDT_RICH],
  });
  const usdtRichSignerImpersonator = await ethers.provider.getSigner(
    ADDRESS_EOA_USDT_RICH
  );

  // Send 100 USDT to testSigner
  console.log(
    "forkedAccoutnProvider: Transferring USDT to testSigner.address..."
  );
  await usdtToken
    .connect(usdtRichSignerImpersonator)
    .transfer(testSigner.address, 100);

  // Check if balance was updated
  console.log(
    `forkedAccoutnProvider: testSigner.address USDT balance: ${await usdtToken.balanceOf(
      testSigner.address
    )}`
  );

  // Stop impersonation
  await hardhat.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [ADDRESS_EOA_USDT_RICH],
  });

  getSigner = async (): Promise<SignerWithAddress> => testSigner;

  return testSigner;
};

export { getSigner };
