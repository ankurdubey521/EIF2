// SPDX-License-Identifier: GPL-3.0
// Contract Address: 0xc9d1F72475FD6d6034399032704d7EAced7FDd28

pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract MultiSigWallet {
    mapping(address => bool) public isOwner;
    mapping(address => bool) public isMember;
    uint256 public nonce = 0; // Equivalently the number of transactions processed by the contract
    uint256 public totalMembers = 0;
    uint256 public threshold = 0;

    /**
     * @dev Restricts calls to owner
     */
    modifier onlyOwner() {
        require(isOwner[msg.sender], "NOT_OWNER");
        _;
    }

    /**
     * @dev Restricts calls to member
     */
    modifier onlyMember() {
        require(isMember[msg.sender], "NOT_MEMBER");
        _;
    }

    constructor() {
        isOwner[msg.sender] = true;
        isMember[msg.sender] = true;
        totalMembers = 1;
        console.log("constructor: wallet created by ", msg.sender);
    }

    // Member Control Methods

    /**
     * @dev Allows addition of new owners, but only exisiting owners can add new owners.
     *      If the newOwner is not a member, it's registered as one
     * @param newOwnerAddress address of new owner
     */
    function addOwner(address newOwnerAddress) public onlyOwner {
        isOwner[newOwnerAddress] = true;
        addMember(newOwnerAddress);
        console.log("addOwner: New Owner ", newOwnerAddress, " Added");
    }

    /**
     * @dev Allowes removal of owners by other owners. Does not remove from members
     * @param ownerAddress address of owner to be removed
     */
    function removeOwner(address ownerAddress) public onlyOwner {
        require(isOwner[ownerAddress], "ADDRESS_NOT_OWNER");
        isOwner[ownerAddress] = false;
        console.log("removeOwner: ", ownerAddress, " Removed");
    }

    /**
     * @dev Adds a new member, but only existing owners can add new members.
     * @param newMemberAddress address of new member
     */
    function addMember(address newMemberAddress) public onlyOwner {
        if (!isMember[newMemberAddress]) {
            isMember[newMemberAddress] = true;
            totalMembers += 1;
            console.log("addMember: New Member: ", newMemberAddress, " Added");
        } else {
            console.log("addMember: ", newMemberAddress, " Already a Member");
        }
    }

    /**
     * @dev Adds a new member, but only existing owners can add new members.
     * @param newMemberAddress address of new member
     * @param newThreshold threshold if need to be updated
     */
    function addMember(address newMemberAddress, uint256 newThreshold)
        public
        onlyOwner
    {
        require(newThreshold <= totalMembers + 1, "INVALID_THRESHOLD");
        addMember(newMemberAddress);
        threshold = newThreshold;
        console.log("addMember: New Threshold: ", newThreshold);
    }

    /**
     * @dev Removes a member, but only existing owners can remove members.
     *      Owner cannot be removed without downgrading to member first
     * @param memberAddress address of member to be removed
     * @param newThreshold updated threshold value
     */
    function removeMember(address memberAddress, uint256 newThreshold)
        public
        onlyOwner
    {
        require(isMember[memberAddress], "ADDRESS_NOT_MEMBER");
        require(!isOwner[memberAddress], "ADDRESS_IS_OWNER");
        require(newThreshold <= totalMembers - 1, "INVALID_THRESHOLD");
        isMember[memberAddress] = false;
        totalMembers -= 1;
        console.log("removeMember: Removed member: ", memberAddress);
        console.log("removeMember: New Threshold:", newThreshold);
    }

    // Transaction Verification

    /**
     * @dev Defines a transaction entity
     * @param wallet address of the wallet from which the tx originates,
     *        to confirm if the transaction originates from this wallet\
     * @param to address of reciever
     * @param amount amount of wei/erc20 tokens to send
     * @param transactionType 0 represents ETH transfer, 1 represents ERC20 transfer
     * @param token address of erc20token contract if transactionType is 1 else 0x0
     * @param nonce to prevent replay of tx, equal to the current amount of treansactions
     *        processed by the wallet
     */
    struct Transaction {
        address wallet;
        address payable to;
        uint256 amount;
        uint256 transactionType;
        address token;
        uint256 nonce;
    }

    /**
     * @dev takes a transaction and returns it's keccak256 hash
     * @param t input transaction
     */
    function getTransactionHash(Transaction memory t) public pure returns (bytes32) {
        return keccak256(abi.encode(t.wallet, t.to, t.amount, t.transactionType, t.token, t.nonce));
    }

    /**
     * @dev recovers address given the transaction's signature and the transaction
     * @param t transaction input transaction
     * @param v uint8 
     * @param r bytes32
     * @param s bytes32
     * @return recovered address
     */
    function recoverAddressFromTransactionSignature(Transaction memory t, uint8 v, bytes32 r, bytes32 s) public pure returns (address){
        bytes32 transactionHash = getTransactionHash(t);
        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", transactionHash));
        return ecrecover(messageHash, v, r, s); 
    }

    /**
     * @dev Allows recieving wei/eth
     */
    receive() external payable {
        console.log("receive: Recieved ", msg.value, " wei");
        console.log("receive: Current Balance: ", address(this).balance);
    }
}
