import { ethers } from "hardhat";
import hardhat from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { CERC20_ABI } from "../constants/cerc20abi";
import {
  ADDRESS_TOKEN_CUSDT,
  ADDRESS_TOKEN_USDT,
} from "../constants/contractMainnetAddress";
import { ERC20_ABI } from "../constants/erc20abi";
import { getSigner } from "./forkedAccountProvider";

const takeDaiLoanAgainstUsdt = async (
  signer: SignerWithAddress,
  usdtToSupplyAsCollateral: number
) => {
  const usdtToken = new ethers.Contract(ADDRESS_TOKEN_USDT, ERC20_ABI, signer);
  const cusdtToken = new ethers.Contract(
    ADDRESS_TOKEN_CUSDT,
    CERC20_ABI,
    signer
  );

  console.log(
    `takeDaiLoanAgainstUsdt: approving ${usdtToSupplyAsCollateral} USDT transfer...`
  );
  // Approve token transfer
  await usdtToken.approve(ADDRESS_TOKEN_CUSDT, usdtToSupplyAsCollateral);
  // Mint ctokens
  console.log(`takeDaiLoanAgainstUsdt: minting cUSDT...`);
  await cusdtToken.mint(usdtToSupplyAsCollateral, {
    gasLimit: 9500000,
  });

  console.log(
    `takeLoanAgainstUsdt: current USDT balance: ${await usdtToken.balanceOf(
      signer.address
    )}`
  );
  console.log(
    `takeLoanAgainstUsdt: current cUSDT balance: ${await cusdtToken.balanceOf(
      signer.address
    )}`
  );
};

const main = async () => {
  const signer = await getSigner();
  await takeDaiLoanAgainstUsdt(signer, 5);
};

main().then(() => {});
