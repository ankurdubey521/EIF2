import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";

describe("Pizza Token Module 4", function () {
  let pizzaTokenContract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;

  beforeEach(async function () {
    const pizzaTokenFactory = await ethers.getContractFactory("PizzaToken");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    pizzaTokenContract = await pizzaTokenFactory.deploy(1000000);
  });

  describe("Deployment", async function () {
    it("Should set the right owner", async function () {
      expect(await pizzaTokenContract.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await pizzaTokenContract.balanceOf(owner.address);
      expect(await pizzaTokenContract.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Self Transactions", async function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await pizzaTokenContract.transfer(addr1.address, 50);
      const addr1Balance = await pizzaTokenContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await pizzaTokenContract.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await pizzaTokenContract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await pizzaTokenContract.balanceOf(
        owner.address
      );
      await expect(
        pizzaTokenContract.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("INSUFFICIENT_FUNDS");

      // Owner balance shouldn't have changed.
      expect(await pizzaTokenContract.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await pizzaTokenContract.balanceOf(
        owner.address
      );
      // Transfer 100 tokens from owner to addr1.
      await pizzaTokenContract.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await pizzaTokenContract.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await pizzaTokenContract.balanceOf(
        owner.address
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await pizzaTokenContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await pizzaTokenContract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  describe("Delegated Transactions", async function () {
    beforeEach(async function () {
      // Send 500 Pizza Tokens to addr1
      await pizzaTokenContract.transfer(addr1.address, 500);

      // Allow addr2 to spend 200 PizzaTokens on behalf of addr1
      await pizzaTokenContract.connect(addr1).approve(addr2.address, 200);
    });

    it("Should approve spender and spender should be able to transfer tokens", async function () {
      // Send 50 tokens from addr1 to addr3 through add2
      await expect(
        async () =>
          await pizzaTokenContract
            .connect(addr2)
            .transferFrom(addr1.address, addr3.address, 50)
      ).to.changeTokenBalances(pizzaTokenContract, [addr1, addr3], [-50, 50]);

      // verify if allowance is updated
      await expect(
        await pizzaTokenContract
          .connect(addr2)
          .allowance(addr1.address, addr2.address)
      ).to.equal(150);

      // fail if try to send 151 more tokens
      await expect(
        pizzaTokenContract
          .connect(addr2)
          .transferFrom(addr1.address, addr3.address, 151)
      ).to.be.revertedWith("APPROVED_LIMIT_EXCEEDED");
    });

    it("Should fail if owner has insufficient funds", async function () {
      await expect(
        pizzaTokenContract
          .connect(addr2)
          .transferFrom(addr1.address, addr3.address, 600)
      ).to.be.revertedWith("INSUFFICIENT_FUNDS");
    });
  });
});
