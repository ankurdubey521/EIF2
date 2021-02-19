import { BigNumber } from "ethers";
import { ethers } from "hardhat";

import takeUsdtLoanAgainstDai from "../utils/compoundLoanCreator";
import approveAllCTokenTransfer from "../utils/compoundApproveCTokenTransfer";
import delegateUsdtLoan from "../utils/aaveDelagateCredit";
import sendUsdt from "../utils/sendUsdt";
import {
  ADDRESS_CONTRACT_LENDING_POOL_ADDRESS_PROVIDER,
  ADDRESS_TOKEN_USDT,
} from "../constants/contractMainnetAddress";
import { getSigner } from "../utils/forkedAccountProvider";

const parseDai = (tokenCount: number): BigNumber =>
  BigNumber.from("1000000000000000000").mul(BigNumber.from(tokenCount));

const parseUsdt = (tokenCount: number): BigNumber =>
  BigNumber.from("1000000").mul(BigNumber.from(tokenCount));

const loanTransferDemo = async () => {
  // Get Signer
  console.log("--loanTransfer: initializing signer....");
  const signer = await getSigner();
  console.log(`--loanTransfer: signer address: ${signer.address}`);

  // Create a loan
  console.log("--loanTransfer: taking loan...");
  await takeUsdtLoanAgainstDai(signer, parseDai(10), parseUsdt(3));

  // Deploy Contract
  console.log("--loanTransfer: deploying contract...");
  const contractFactory = await ethers.getContractFactory("LoanTransfer");
  const contract = await contractFactory.deploy(
    ADDRESS_CONTRACT_LENDING_POOL_ADDRESS_PROVIDER
  );

  // Delegate Credit
  console.log("--loanTransfer: running loan approve delegation...");
  await delegateUsdtLoan(parseUsdt(15), signer, contract.address);

  // Allow transfer of cDAI from owner to contract
  console.log("--loanTransfer: approving ctoken transfer...");
  await approveAllCTokenTransfer(signer, contract.address);

  // Send Contract some usdt to cover loan premiums
  console.log("--loanTransfer: sending usdt to contract...");
  await sendUsdt(contract.address, parseUsdt(1), signer);

  // Start the flash loan
  console.log("--loanTransfer: intiliazing flash loan...");
  await contract.initiateLoanTransfer(ADDRESS_TOKEN_USDT, parseUsdt(10));
};

loanTransferDemo().then(console.log).catch(console.error);
export {};
