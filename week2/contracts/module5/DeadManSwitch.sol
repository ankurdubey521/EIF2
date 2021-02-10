// SPDX-License-Identifier: GPL-3.0
// Contract Address: 0xc9d1F72475FD6d6034399032704d7EAced7FDd28

pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract DeadManSwitch {
    address payable sendAddress;
    address public owner;
    uint256 public lastAliveCalledBlock = 0;
    uint256 public maxBlocksBetweenAliveCalls = 10;

    event FundsRecieved(address sender, uint256 amount);

    constructor(address payable _sendAddress) {
        sendAddress = _sendAddress;
        owner = msg.sender;
        console.log("constructor: Contract deployed on Block: ", block.number);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    /**
     * @dev Allows owner to inform the contract if he is alive
     *      lastAliveCalledBack is updated to the current block
     */
    function stillAlive() external onlyOwner {
        console.log("stillAlive: Still Alive called on block ", block.number);
        lastAliveCalledBlock = block.number;
    }

    /**
     *  @dev Destroys the contract and sends remaining balances to sendAddress
     */
    function destroyContract() internal {
        console.log(
            "destroyContract: Current Balance: ",
            address(this).balance
        );
        console.log("destroyContract: Destroying the contract...");
        selfdestruct(sendAddress);
    }

    /**
     * @dev Check if stillAlive() was called in last 10 blocks
     *      If not, destroy the contract
     * @return bool indicating if owner is still alive
     */
    function checkIfStillAliveWasCalledRecently() public returns (bool) {
        console.log(
            "checkIfStillAliveWasCalledRecently: Last called on block: ",
            lastAliveCalledBlock,
            ", Current Block: ",
            block.number
        );
        if (
            block.number >= maxBlocksBetweenAliveCalls &&
            lastAliveCalledBlock < block.number - maxBlocksBetweenAliveCalls
        ) {
            destroyContract();
            return false;
        }
        return true;
    }

    /**
     * @dev Allows recieving wei
     */
    receive() external payable onlyOwner {
        console.log("receive: Recieved ", msg.value, " wei");
        console.log("receive: Current Balance: ", address(this).balance);
        emit FundsRecieved(msg.sender, msg.value);
    }
}
