import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { Contract, BigNumber } from "ethers";
import { ethers } from "hardhat";

describe("Storage Module 2d", function () {
  let storageContract: Contract;

  before(async function () {
    const storage = await ethers.getContractFactory("StorageModule2");
    storageContract = await storage.deploy();
  });

  it("Should store uints properly", async function () {
    const randomNumbers = Array(100)
      .fill(0)
      .map(() => Math.floor(Math.random() * 1e6));
    for (let value of randomNumbers) {
      await storageContract.store(value);
      await expect(await storageContract.retrieve()).to.equal(
        value.toString()
      );
    }
  });
});
