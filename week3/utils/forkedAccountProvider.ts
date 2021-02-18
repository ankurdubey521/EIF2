import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";
import hardhat from "hardhat";

import { ERC20_ABI } from "../constants/abi/erc20abi";
import {
  ADDRESS_TOKEN_USDT,
  ADDRESS_EOA_USDT_RICH,
  ADDRESS_EOA_DAI_RICH,
  ADDRESS_TOKEN_DAI,
} from "../constants/contractMainnetAddress";
import { BigNumber } from "ethers";

let getSigner = async (): Promise<SignerWithAddress> => {
  const [testSigner] = await ethers.getSigners();
  // Initialize USDT token contract
  const usdtToken = new ethers.Contract(
    ADDRESS_TOKEN_USDT,
    ERC20_ABI,
    testSigner
  );
  const daiToken = new ethers.Contract(
    ADDRESS_TOKEN_DAI,
    ERC20_ABI,
    testSigner
  );

  // Start impersonating account with high DAI balance
  await hardhat.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [ADDRESS_EOA_DAI_RICH],
  });
  const daiRichSignerImpersonator = await ethers.provider.getSigner(
    ADDRESS_EOA_DAI_RICH
  );
  console.log(
    `forkedAccountProvider: Impersonator DAI balance: ${await daiToken.balanceOf(
      ADDRESS_EOA_DAI_RICH
    )}`
  );

  // Send 100 DAI to testSigner
  console.log(
    "forkedAccoutnProvider: Transferring DAI to testSigner.address..."
  );
  await daiToken
    .connect(daiRichSignerImpersonator)
    .transfer(testSigner.address, BigNumber.from("10000000000000000000"));

  // Check if balance was updated
  console.log(
    `forkedAccoutnProvider: testSigner.address DAI balance: ${await daiToken.balanceOf(
      testSigner.address
    )}`
  );

  // Stop impersonation
  await hardhat.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [ADDRESS_EOA_DAI_RICH],
  });

  getSigner = async (): Promise<SignerWithAddress> => testSigner;

  return testSigner;
};

export { getSigner };
