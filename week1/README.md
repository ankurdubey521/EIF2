# Week 1: Interacting with a node

## **Objective**

The goal of this week is to give you some familiarity with interacting with an Ethereum node. Even though you might use a service like [infura](https://infura.io/) to abstract node interactions away for most projects, it’s valuable to understand what’s going on under the hood when debugging contracts.

In this lab, you’ll do the following:

1. run and sync a goerli geth node
2. manage an account and send transactions with your node
3. use your node to retrieve data from goerli Ethereum
4. (optional challenge) learn about merkle trees

## **Requirements**

- a computer you can run geth on with 6GB disk space
- a command line

## **Modules**

### **1: Running geth on goerli**

In this module, we’ll get a [Goerli](https://goerli.net/) Ethereum node running. Goerli is a testnet that’s particularly suited for experimentation because it’s relatively small and quick to sync.

First, [install geth](https://geth.ethereum.org/docs/install-and-build/installing-geth).

Once installation is done, open a terminal and run geth with the RPC API open:

```
$ geth --goerli --rpc --rpcapi="eth,web3,personal,web3"

```

If all went well, your node will start syncing. Let it sync and rest easy; that’s it for this module!

### **2: Sending transactions**

In this module, we’ll use our newly synced geth node to do some basic Eth account management and send a transaction.

Still have that node running? Great. Let’s do something with it.

There are multiple ways you can interact with your geth node to read or write blockchain data. The exercises in this module will teach you to interact with a new account and we don’t care which method you choose, but some options are:

1. attach to your geth node with the in-built [javascript console](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console)
2. use [web3js](https://web3js.readthedocs.io/en/v1.2.8/index.html) and javascript scripting
3. use [web3py](https://web3py.readthedocs.io/en/stable/)

Time for the first set of exercises

### **Exercises**

1. Create an Ethereum account managed by your node ([hint](https://github.com/ethereum/go-ethereum/wiki/Management-APIs#personal)) **Output**: your account address
2. Use [the Goerli faucet](https://goerli-faucet.slock.it/) to get some testnet Eth
3. Use the management API to sign the message ‘gEth is Money’ **Output**: your signed message
4. Use the management API to build a transaction sending gEth from your account and send it **Output**: transaction hash of your (sent) transaction

### **3: Scraping blockchain data**

In this module, we’ll switch from writing to reading. By the end of it, you’ll have some experience scripting more interesting scrapers.

As in the previous module, we don’t care what technique or library you use.

### **Exercises**

1. Retrieve the first 128 block hashes and put them in a text file **Output**: text file with first 128 block hashes
2. Retrieve the first block in which a smart contract is deployed **Output**: block number of first smart contract block

### **4 (optional): Merkle tree challenge**

This part if for people who are not satisfied easily and have completed the above sections, merkle trees are some amazing data structures that and are a part of what makes blockchain tick. [Here’s](https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/) a great overview by vitalik.

### **Exercises**

1. Create a merkle tree with all the leaves containing the blockhashes of blocks from 0-127 on goerli network. Do not use any libs which create Merkle trees automatically but feel free to use any of them to learn. Can do this task in any language.**Output**: Root hash of the merkle tree

### **References**

### **How to interact with node**

- Web3JS
- Web3Py
- Geth Console

### **Merkle tree libs**

- [https://merkletree.js.org/](https://merkletree.js.org/)

### **Health check your geth node**

- [https://github.com/leapdao/eth-node-healthcheck](https://github.com/leapdao/eth-node-healthcheck)
- [Geth console API](https://ethereum.stackexchange.com/a/5761)
