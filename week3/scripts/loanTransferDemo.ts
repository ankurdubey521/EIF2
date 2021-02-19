import { BigNumber } from "ethers";
import { ethers } from "hardhat";

import takeUsdtLoanAgainstDai from "../utils/compoundLoanCreator";
import approveAllCTokenTransfer from "../utils/compoundApproveCTokenTransfer";
import delegateDaiLoan from "../utils/aaveDelagateCredit";
import { getSigner } from "../utils/forkedAccountProvider";

const parseDai = (tokenCount: number): BigNumber =>
  BigNumber.from("1000000000000000000").mul(BigNumber.from(tokenCount));

const parseUsdt = (tokenCount: number): BigNumber =>
  BigNumber.from("1000000").mul(BigNumber.from(tokenCount));

const loanTransferDemo = async () => {
  // Get Signer
  const signer = await getSigner();

  // Create a loan
  await takeUsdtLoanAgainstDai(signer, parseDai(10), parseUsdt(3));

  // Delegate Credit
  await delegateDaiLoan(parseDai(15), signer, signer.address);

  // Allow transfer of cDAI from owner to contract
  await approveAllCTokenTransfer(signer, signer.address);
};

loanTransferDemo().then(console.log).catch(console.error);
export {};
