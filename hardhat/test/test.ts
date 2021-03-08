import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers"

describe("Greeter", function () {
  let contract: Contract;
  let signer: SignerWithAddress;

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory("Greeter");
    contract = await contractFactory.deploy("Hello, world!");
    [signer, ] = await ethers.getSigners();
  });

  it("Should return the new greeting once it's changed", async function () {
    expect(await contract.greet()).to.equal("Hello, world!");

    await contract.setGreeting("Hola, mundo!");
    expect(await contract.greet()).to.equal("Hola, mundo!");
  });
});
