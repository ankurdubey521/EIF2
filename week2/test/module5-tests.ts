import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect, should } from "chai";
import { Signer } from "crypto";
import { BigNumber, Contract } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

describe("DeadManSwitch Module 4", function () {
  let dmsContract: Contract;
  let owner: SignerWithAddress;
  let reciever: SignerWithAddress;
  let addr3: SignerWithAddress;
  let addr4: SignerWithAddress;

  beforeEach(async function () {
    const dmsTokenFactory = await ethers.getContractFactory("DeadManSwitch");
    [owner, reciever, addr3, addr4] = await ethers.getSigners();
    dmsContract = await dmsTokenFactory.deploy(reciever.address);
  });

  describe("Deployment", async function () {
    it("Should set the right owner", async function () {
      expect(await dmsContract.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", async function () {
    it("Should recieve ETH from owner", async function () {
      // Send 1 ETH
      await expect(
        async () =>
          await owner.sendTransaction({
            to: dmsContract.address,
            value: parseEther("1"),
          })
      ).to.changeEtherBalances(
        [owner, dmsContract],
        [parseEther("-1"), parseEther("1")]
      );

      // Send 2 ETH
      await expect(
        async () =>
          await owner.sendTransaction({
            to: dmsContract.address,
            value: parseEther("2"),
          })
      ).to.changeEtherBalances(
        [owner, dmsContract],
        [parseEther("-2"), parseEther("2")]
      );

      // Check contract balance
      await expect(
        await ethers.provider.getBalance(dmsContract.address)
      ).is.equal(parseEther("3"));
    });

    it("Should revert if ETH is sent by non owner", async function () {
      // Send 1 ETH
      await expect(
        addr3.sendTransaction({
          to: dmsContract.address,
          value: parseEther("1"),
        })
      ).to.be.revertedWith("NOT_OWNER");
    });
  });

  describe("Dead Man Functionality", async function () {
    let maxBlocksBetweenAliveCalls: BigNumber;
    let contractBalance: number;

    beforeEach(async function () {
      // Send 10ETH to contract
      await owner.sendTransaction({
        to: dmsContract.address,
        value: parseEther("10"),
      });

      // Get data
      maxBlocksBetweenAliveCalls = await dmsContract.maxBlocksBetweenAliveCalls();
      contractBalance = 10;
    });
    /**
     * @dev Each transaction adds a new block to the hardhat network
     *      This fact is used to simulate block addition
     * @param count the number pf blocks to be added
     */
    const addBlocks = async (count: number) => {
      const startingBlock = await ethers.provider.getBlockNumber();

      // Each tx adds a block to the hardhat network
      for (let i = 0; i < count; ++i) {
        await addr3.sendTransaction({
          to: addr4.address,
          value: parseEther("0.001"),
        });
      }

      // Verify if blocks have been added successfully
      expect(await ethers.provider.getBlockNumber()).to.equal(
        startingBlock + count
      );
    };

    /**
     * @dev Verifies if a smart contract has called selfdestruct.
     *      This can be tested by checking if contract code == "0x0"
     *      and if the reciever recieved all the funds or not.
     * @param contract contract to be tested
     * @param reciever: address of reciever who will recieve funds after self destruct
     * @param expectedContractBalance: balance of contract before self destruct
     */
    interface Operation {
      (): Promise<void>;
    }
    const expectSelfDestructHappened = async (
      operation: Operation,
      contract: Contract,
      reciever: SignerWithAddress,
      expectedContractBalance: number
    ) => {
      // Check if tokens were transferred
      expect(operation).to.changeEtherBalances(
        [contract, reciever],
        [-expectedContractBalance, +expectedContractBalance]
      );

      // Check if source code has been zeroed
      expect(await ethers.provider.getCode(contract.address)).to.equal("0x");
    };
    const notExpectSelfDestruct = async (
      operation: Operation,
      contract: Contract,
      reciever: SignerWithAddress,
      expectedContractBalance: number
    ) => {
      // Check if tokens were transferred
      expect(operation).to.not.changeEtherBalances(
        [contract, reciever],
        [-expectedContractBalance, +expectedContractBalance]
      );

      // Check if source code has been zeroed
      expect(await ethers.provider.getCode(contract.address)).to.not.equal(
        "0x"
      );
    };

    it("Should not destruct if owner is stil alive", async function () {
      // Call stillAlive on first block
      await dmsContract.stillAlive();
      const lastAliveCalledBlock: BigNumber = await dmsContract.lastAliveCalledBlock();
      console.log(`tester: last alive called block: ${lastAliveCalledBlock}`);

      // Add blocks one at a time and after every addition check if the contract self destructs.
      while (
        BigNumber.from(await ethers.provider.getBlockNumber()).lt(
          lastAliveCalledBlock.add(maxBlocksBetweenAliveCalls)
        )
      ) {
        await notExpectSelfDestruct(
          async () => await dmsContract.checkIfStillAliveWasCalledRecently(),
          dmsContract,
          reciever,
          contractBalance
        );
        await addBlocks(1);
      }
    });

    it("Should self destruct if owner has not called stillAlive in last X blocks", async function () {
      // Call stillAlive on first block
      await dmsContract.stillAlive();
      const lastAliveCalledBlock: BigNumber = await dmsContract.lastAliveCalledBlock();
      console.log(`tester: last alive called block: ${lastAliveCalledBlock}`);

      // Add enough blocks to cause self destruct
      await addBlocks(maxBlocksBetweenAliveCalls.add(1).toNumber());

      // Check if self destruct happens
      await expectSelfDestructHappened(
        async () => await dmsContract.checkIfStillAliveWasCalledRecently(),
        dmsContract,
        reciever,
        contractBalance
      );
    });
  });
});
