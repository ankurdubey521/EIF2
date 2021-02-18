import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import hardhat from "hardhat";

import { ERC20_ABI } from "./erc20abi";

const usdtRichAddress = "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8";
const usdtTokenAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

let getSigner = async (): Promise<SignerWithAddress> => {
  const [testSigner] = await ethers.getSigners();
  // Initialize USDT token contract
  const usdtToken = new ethers.Contract(
    usdtTokenAddress,
    ERC20_ABI,
    testSigner
  );

  // Start impersonating account with high USDT balance
  await hardhat.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [usdtRichAddress],
  });
  const usdtRichSignerImpersonator = await ethers.provider.getSigner(
    usdtRichAddress
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
    params: [usdtRichAddress],
  });

  getSigner = async (): Promise<SignerWithAddress> => testSigner;

  return testSigner;
};

getSigner().then(() => {});

export { getSigner };
