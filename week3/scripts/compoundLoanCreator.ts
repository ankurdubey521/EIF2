import { ethers } from "hardhat";
import hardhat from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { CERC20_ABI } from "../constants/cerc20abi";
import {
  ADDRESS_CONTRACT_COMPOUND_COMPTROLLER,
  ADDRESS_TOKEN_CDAI,
  ADDRESS_TOKEN_CUSDT,
  ADDRESS_TOKEN_DAI,
  ADDRESS_TOKEN_USDT,
} from "../constants/contractMainnetAddress";
import { ERC20_ABI } from "../constants/erc20abi";
import { COMPOUND_COMPTROLLER_ABI } from "../constants/comptroller";
import { getSigner } from "./forkedAccountProvider";
import { BigNumber } from "ethers";

const takeUsdtLoanAgainstDai = async (
  signer: SignerWithAddress,
  daiToSupplyAsCollateral: BigNumber,
  usdtToLoan: BigNumber
) => {
  const usdtToken = new ethers.Contract(ADDRESS_TOKEN_USDT, ERC20_ABI, signer);
  const daiToken = new ethers.Contract(ADDRESS_TOKEN_DAI, ERC20_ABI, signer);

  const cUsdtToken = new ethers.Contract(
    ADDRESS_TOKEN_CUSDT,
    CERC20_ABI,
    signer
  );
  const cDaiToken = new ethers.Contract(ADDRESS_TOKEN_CDAI, CERC20_ABI, signer);
  const comptrollerContract = new ethers.Contract(
    ADDRESS_CONTRACT_COMPOUND_COMPTROLLER,
    COMPOUND_COMPTROLLER_ABI,
    signer
  );

  console.log(
    `takeUsdtLoanAgainstDai: approving ${daiToSupplyAsCollateral} DAI transfer...`
  );
  // Approve token transfer
  await daiToken.approve(ADDRESS_TOKEN_CDAI, daiToSupplyAsCollateral);
  // Mint ctokens
  console.log(`takeUsdtLoanAgainstDai: minting cDAI...`);
  await cDaiToken.mint(daiToSupplyAsCollateral);

  console.log(
    `takeUsdtLoanAgainstDai: current DAI balance: ${await daiToken.balanceOf(
      signer.address
    )}`
  );
  console.log(
    `takeUsdtLoanAgainstDai: current cDAI balance: ${await cDaiToken.balanceOf(
      signer.address
    )}`
  );

  // Enter the market
  console.log("takeUsdtLoanAgainstDai: Entering the DAI market...");
  const errors: number[] = await comptrollerContract.enterMarkets([
    ADDRESS_TOKEN_CDAI,
  ]);

  // Get Account Liquidity
  console.log(
    `takeUsdtLoanAgainstDai: Account Liquidity: ${await comptrollerContract.getAccountLiquidity(
      signer.address
    )}`
  );

  // Borrow 2 USDT
  console.log(`takeUsdtLoanAgainstDai: Taking loan of ${usdtToLoan} USDT....`);
  await cUsdtToken.borrow(usdtToLoan);
  console.log(
    `takeUsdtLoanAgainstDai: current USDT balance: ${await usdtToken.balanceOf(
      signer.address
    )}`
  );
};

const main = async () => {
  const signer = await getSigner();
  //  const [signer] = await ethers.getSigners();
  console.log(`signer address: ${signer.address}`);
  await takeUsdtLoanAgainstDai(
    signer,
    BigNumber.from("5000000000000000000"),
    BigNumber.from("2000000")
  );
};

main().then(() => {});
