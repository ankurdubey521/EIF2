import hardhat from "hardhat";
import { ethers } from "hardhat";

import {
  ADDRESS_TOKEN_USDT,
  ADDRESS_EOA_USDT_RICH,
} from "../constants/contractMainnetAddress";
import { ERC20_ABI } from "../constants/abi/erc20abi";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const sendUsdt = async (
  account: string,
  amount: BigNumber,
  signer: SignerWithAddress
) => {
  const usdtToken = new ethers.Contract(ADDRESS_TOKEN_USDT, ERC20_ABI, signer);
  // Start impersonating account with high USDT balance
  await hardhat.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [ADDRESS_EOA_USDT_RICH],
  });
  const usdtRichSignerImpersonator = await ethers.provider.getSigner(
    ADDRESS_EOA_USDT_RICH
  );
  console.log(
    `sendUsdt: Impersonator USDT balance: ${await usdtToken.balanceOf(
      ADDRESS_EOA_USDT_RICH
    )}`
  );

  // Send 100 USDT to testSigner
  console.log("sendUsdt: Transferring USDT to contract...");
  await usdtToken.connect(usdtRichSignerImpersonator).transfer(account, amount);

  // Stop impersonation
  await hardhat.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [ADDRESS_EOA_USDT_RICH],
  });

  // Check contract usdt balance...
  console.log(
    `sendUsdt: contract USDT balance after transfer: ${await usdtToken.balanceOf(
      account
    )} `
  );
};

export default sendUsdt;