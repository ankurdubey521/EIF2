import { ethers } from "hardhat";
import { expect } from "chai";

import {
  ADDRESS_CONTRACT_LENDING_POOL_ADDRESS_PROVIDER,
  ADDRESS_TOKEN_DAI,
} from "../constants/contractMainnetAddress";
import { ERC20_ABI } from "../constants/abi/erc20abi";
import { getSigner } from "../utils/forkedAccountProvider";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { BigNumber, Contract } from "ethers";

describe("Loan Transfer Tests", async function () {
  let contract: Contract;
  let signer: SignerWithAddress;

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory("LoanTransfer");
    contract = await contractFactory.deploy(
      ADDRESS_CONTRACT_LENDING_POOL_ADDRESS_PROVIDER
    );
    signer = await getSigner();
    // Send contract some DAI to cover premiums
    const daiContract = new ethers.Contract(
      ADDRESS_TOKEN_DAI,
      ERC20_ABI,
      signer
    );
    await daiContract.transfer(
      contract.address,
      BigNumber.from((1e9).toString()).mul(BigNumber.from((1e9).toString()))
    );
  });

  it("Test Run", async function () {
    await contract.initiateLoanTransfer();
  }).timeout(1000000);
});
