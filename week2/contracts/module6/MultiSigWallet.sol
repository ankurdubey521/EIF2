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

  /**
   * @dev Allows recieving wei/eth
   */
  receive() external payable {
    console.log("receive: Recieved ", msg.value, " wei");
    console.log("receive: Current Balance: ", address(this).balance);
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
  function getTransactionHash(Transaction memory t)
    public
    pure
    returns (bytes32)
  {
    return
      keccak256(
        abi.encode(
          t.wallet,
          t.to,
          t.amount,
          t.transactionType,
          t.token,
          t.nonce
        )
      );
  }

  /**
   * @dev recovers address given the transaction's signature and the transaction
   * @param t transaction input transaction
   * @param v uint8
   * @param r bytes32
   * @param s bytes32
   * @return recovered address
   */
  function recoverAddressFromTransactionSignature(
    Transaction memory t,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public pure returns (address) {
    bytes32 transactionHash = getTransactionHash(t);
    bytes32 messageHash =
      keccak256(
        abi.encodePacked("\x19Ethereum Signed Message:\n32", transactionHash)
      );
    return ecrecover(messageHash, v, r, s);
  }

  /**
   * @dev Returns true if array contains no duplicates
   * @param addressList list of addresses
   * @return bool true if there are no duplicates
   */
  function checkNoDuplicates(address[] memory addressList)
    internal
    pure
    returns (bool)
  {
    for (uint256 i = 0; i < addressList.length; ++i) {
      for (uint256 j = 0; j < i; ++j) {
        if (addressList[i] == addressList[j]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @dev verifies a transaction against signatures provided by members
   *      note that memberAddress.length should be greater than or equal
   *      to threshold
   * @param t tranasaction to be verified
   * @param v array of v of signatures
   * @param r array of r of signatures
   * @param s array of s of signatures
   * @param memberAddresses array of addresses of members
   * @return bool return verfication status.
   */
  function verifyTransaction(
    Transaction memory t,
    uint8[] memory v,
    bytes32[] memory r,
    bytes32[] memory s,
    address[] memory memberAddresses
  ) public view returns (bool) {
    // Parmeter Verification
    require(v.length == r.length, "INVALID_PARAMETERS");
    require(r.length == s.length, "INVALID_PARAMETERS");
    require(s.length == memberAddresses.length, "INVALID_PARAMETERS");
    require(checkNoDuplicates(memberAddresses), "DUPLICATE_ADDRESSES");
    require(memberAddresses.length >= threshold, "INSUFFICIENT_MEMBERS");

    // Transaction signature verification
    for (uint256 i = 0; i < memberAddresses.length; ++i) {
      require(isMember[memberAddresses[i]], "ADDRESS_NOT_MEMBER");
      require(
        memberAddresses[i] ==
          recoverAddressFromTransactionSignature(t, v[i], r[i], s[i]),
        "SIGNATURE_VERIFICATION_FAILED"
      );
    }

    // Transaction Parameters Verification
    require(t.wallet == address(this), "WALLET_ADDRESS_MISMATCH");
    require(t.nonce == nonce, "INVALID_NONCE");
    require(
      t.transactionType == 0 || t.transactionType == 1,
      "INVALID_TRANSACTION_TYPE"
    );

    if (t.transactionType == 0) {
      verifyEthTransaction(t);
    } else if (t.transactionType == 1) {
      verifyErc20Transaction(t);
    }

    console.log("verifyTransaction: transaction verified");
    return true;
  }

  /**
   * @dev Verifies the amount in eth transaction.
   *      Supposed to be called only from verifyTransaction
   * @param t Transaction to be verified
   * @return bool validity of transaction
   */
  function verifyEthTransaction(Transaction memory t)
    internal
    view
    returns (bool)
  {
    // Check account balance against amount
    require(t.amount <= address(this).balance);
    return true;
  }

  /**
   * @dev Verifies the amount in token transaction.
   *      Supposed to be called only from verifyTransaction
   * @param t Transaction to be verified
   * @return bool validity of transaction
   */
  function verifyErc20Transaction(Transaction memory t)
    internal
    pure
    returns (bool)
  {
    // TODO: IMPLEMENT
    t.token;
    return true;
  }

  // Transaction Execution

  /**
   * @dev Verfies and Executes Transaction based on type
   * @param t transaction to be executed
   * @param v array of v of signatures
   * @param r array of r of signatures
   * @param s array of s of signatures
   * @param memberAddresses array of addresses of members
   */
  function executeTransaction(
    Transaction memory t,
    uint8[] memory v,
    bytes32[] memory r,
    bytes32[] memory s,
    address[] memory memberAddresses
  ) public payable onlyMember {
    verifyTransaction(t, v, r, s, memberAddresses);
    if (t.transactionType == 0) {
      (bool sent, ) = t.to.call{ value: t.amount }("");
      require(sent, "ETH_SEND_FAILED");
      nonce += 1;
      console.log("executeTransaction: Transaction Successfull");
    } else if (t.transactionType == 1) {
      // TODO: implement
    }
  }
}
