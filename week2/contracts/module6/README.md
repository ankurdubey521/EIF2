# Custom Implementation of a Multisignature Wallet

The contract implements a simple multi signature wallet that can recieve and send ETH.

## User Management

The contract support two kinds of users, **owners** and **members**. All owners are also members.
Members are users who can sign a transaction, but not add or remove existing members or change the threshold, which can only be done by owners.
Only owners can remove other owners or demote them to a member, but note that owners cannot be removed without first demoting them to member status.

## Transactions

Internally the contract uses the following structure to represent the transaction payload, which would be signed by users. A transaction can be executed only if it is signed by atleast **M** of **N** users. **M** and **N** can be changed by owners during addition or removal of a member.

```
/**
* @dev Defines a transaction entity
* @param wallet address of the wallet from which the tx originates
*        (ie the address of this contract once deployed),
*        to confirm if the transaction originates from this wallet
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
```

## Executing a transaction

The contract exposes a public function `executeTransaction(transaction, v[], r[], s[], memberAddresses[])` which verifies all the signatures `v,r,s` against the `memberAddresses` array, and then executes the transaction. Members are expected to coordinate offline to create and sign the transactions.
