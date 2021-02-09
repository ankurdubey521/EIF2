import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Owner Module 1", function () {
  let ownerContract: Contract;
  let signer1: SignerWithAddress, signer2: SignerWithAddress;

  before(async function () {
    const Owner = await ethers.getContractFactory("OwnerModule1");
    ownerContract = await Owner.deploy();
    [signer1, signer2] = await ethers.getSigners();
  });

  it("Should respond to Heartbeat", async function () {
    await expect(await ownerContract.heartBeat()).to.equal("CONTRACT_DEPLOYED");
  });

  it("Should return correct owner", async function () {
    await expect(await ownerContract.getOwner()).to.equal(signer1.address);
  });

  it("Should throw error if non owner calls changeOwner", async function () {
    await expect(
      ownerContract.connect(signer2).changeOwner(signer2.address)
    ).to.be.revertedWith("Caller is not owner");
  });

  it("Should update owner properly", async function () {
    await expect(await ownerContract.changeOwner(signer2.address))
      .to.emit(ownerContract, "OwnerSet")
      .withArgs(signer1.address, signer2.address);
    await expect(await ownerContract.getOwner()).to.equal(signer2.address);
  });
});
