import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect, should } from "chai";
import { sign } from "crypto";
import { BigNumber, Contract } from "ethers";
import { hashMessage } from "ethers/lib/utils";
import { ethers } from "hardhat";

describe("Multi Signature Wallet Module 6", function () {
  let walletContract: Contract;
  let owner1: SignerWithAddress,
    owner2: SignerWithAddress,
    owner3: SignerWithAddress,
    member1: SignerWithAddress,
    member2: SignerWithAddress,
    member3: SignerWithAddress;

  beforeEach(async function () {
    const walletFactory = await ethers.getContractFactory("MultiSigWallet");
    [
      owner1,
      owner2,
      owner3,
      member1,
      member2,
      member3,
    ] = await ethers.getSigners();
    walletContract = await walletFactory.deploy();
  });

  describe("Owner and Member Managament", async function () {
    it("Should initialize contract owner properly", async function () {
      // Check status of owner and unadded member
      expect(await walletContract.isOwner(owner1.address)).to.be.true;
      expect(await walletContract.isMember(owner1.address)).to.be.true;
      expect(await walletContract.isOwner(member1.address)).to.be.false;
      expect(await walletContract.isMember(member1.address)).to.be.false;
      expect(await walletContract.totalMembers()).to.equal(1);
    });
    it("Should be able to add owners and members", async function () {
      // Add a new owner and check if it's updated
      await walletContract.addOwner(owner2.address);
      expect(await walletContract.isOwner(owner2.address)).to.be.true;
      expect(await walletContract.isMember(owner2.address)).to.be.true;
      expect(await walletContract.totalMembers()).to.equal(2);

      // Let owner2 add owner3 as owner
      await walletContract.connect(owner2).addOwner(owner3.address);
      // check if owner2 is still owner
      expect(await walletContract.isOwner(owner2.address)).to.be.true;
      expect(await walletContract.isMember(owner2.address)).to.be.true;
      // check if owner 3 was added as owner
      expect(await walletContract.isOwner(owner3.address)).to.be.true;
      expect(await walletContract.isMember(owner3.address)).to.be.true;
      expect(await walletContract.totalMembers()).to.equal(3);

      // add member1 as a member and promote to owner
      await walletContract
        .connect(owner3)
        ["addMember(address)"](member1.address); // Alternate way of accesing functions if overloaded
      expect(await walletContract.isOwner(member1.address)).to.be.false;
      expect(await walletContract.isMember(member1.address)).to.be.true;
      expect(await walletContract.totalMembers()).to.equal(4);
      // promote member1
      await walletContract.addOwner(member1.address);
      expect(await walletContract.isOwner(member1.address)).to.be.true;
      expect(await walletContract.totalMembers()).to.equal(4);
    });
    it("Should be able to remove owners and members", async function () {
      // Add owner
      await walletContract.addOwner(owner2.address);
      expect(await walletContract.isOwner(owner2.address)).to.be.true;
      // Remove Owner
      await walletContract.removeOwner(owner2.address);
      expect(await walletContract.isOwner(owner2.address)).to.be.false;
      expect(await walletContract.isMember(owner2.address)).to.be.true;
      expect(await walletContract.totalMembers()).to.equal(2);

      // Remove owner2 from mmebers
      await walletContract.removeMember(owner2.address, 0);
      expect(await walletContract.isMember(owner2.address)).to.be.false;
      expect(await walletContract.totalMembers()).to.equal(1);
    });
    it("Only owners should be able to remove owners", async function () {
      // Add an owner
      await walletContract.addOwner(owner2.address);

      // Try removing owner from random address
      await expect(
        walletContract.connect(member1).removeOwner(owner2.address)
      ).to.revertedWith("NOT_OWNER");

      // Add member and try to remove owner
      await walletContract["addMember(address)"](member1.address);
      await expect(
        walletContract.connect(member1).removeOwner(owner2.address)
      ).to.revertedWith("NOT_OWNER");
    });
    it("Owners cannot be removed  from members without demoting them to members", async function () {
      // Add an owner
      await walletContract.addOwner(owner2.address);

      // Try removing owner
      await expect(
        walletContract.removeMember(owner2.address, 1)
      ).to.revertedWith("ADDRESS_IS_OWNER");
    });
    it("Should update threshold if provided during member add", async function () {
      // Add member
      await walletContract["addMember(address,uint256)"](member1.address, 1);
      expect(await walletContract.threshold()).to.equal(1);
      expect(await walletContract.isMember(member1.address)).to.be.true;
    });
    it("Should reject invalid threshold during member add", async function () {
      // Add member
      await expect(
        walletContract["addMember(address,uint256)"](member1.address, 3)
      ).to.be.revertedWith("INVALID_THRESHOLD");
    });
    it("Should reject invalid threshold during member remove", async function () {
      // Add member
      await walletContract["addMember(address,uint256)"](member1.address, 1);
      await expect(
        walletContract.removeMember(member1.address, 2)
      ).to.be.revertedWith("INVALID_THRESHOLD");
    });
  });

  describe("Transactions Management", async function () {
    interface Transaction {
      wallet: string;
      to: string;
      amount: number;
      transactionType: 0 | 1;
      token: string;
      nonce: number;
    }

    /**
     * @dev comptues a hash for transaction
     * @param transaction input transaction
     */
    const getTransactionHash = (transaction: Transaction): string =>
      ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          [
            "address",
            "address payable",
            "uint256",
            "uint256",
            "address",
            "uint256",
          ],
          [
            transaction.wallet,
            transaction.to,
            transaction.amount,
            transaction.transactionType,
            transaction.token,
            transaction.nonce,
          ]
        )
      );

    /**
     * @dev comptues signature for transaction
     * @param transaction input transaction
     * @param signer account using which tx is to be signed
     */
    const signTransaction = async (
      transaction: Transaction,
      signer: SignerWithAddress
    ): Promise<{
      v: number;
      r: string;
      s: string;
    }> => {
      const hash = getTransactionHash(transaction);
      const hashBytes = ethers.utils.arrayify(hash);
      const signature = await signer.signMessage(hashBytes);
      const { v, r, s } = ethers.utils.splitSignature(signature);
      return { v, r, s };
    };

    it("Should return correct transaction hash", async function () {
      // Generate a transaction hash and compare it with what solidity gives
      const transaction: Transaction = {
        wallet: walletContract.address,
        to: member3.address,
        amount: 10,
        transactionType: 0,
        token: "0x0000000000000000000000000000000000000000",
        nonce: 0,
      };

      const hashExpected = getTransactionHash(transaction);

      const hashFromContract = await walletContract.getTransactionHash(
        transaction
      );

      expect(hashFromContract).to.equal(hashExpected);
    });

    it("Should return verify transaction signature", async function () {
      // Sign a transaciton and try to recover the address from solidity
      const transaction: Transaction = {
        wallet: walletContract.address,
        to: member3.address,
        amount: 10,
        transactionType: 0,
        token: "0x0000000000000000000000000000000000000000",
        nonce: 0,
      };
      const { v, r, s } = await signTransaction(transaction, owner1);

      const addressFromContract = await walletContract.recoverAddressFromTransactionSignature(
        transaction,
        v,
        r,
        s
      );

      expect(addressFromContract).to.equal(owner1.address);
    });
  });
});
