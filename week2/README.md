# Week 2: Smart contract development

## **Objective**

The ability to execute smart contracts is the single largest differentiator between Ethereum and Bitcoin. Smart contracts present a vastly different paradigm of programming than the usual CS 101 class will teach. It is essential that you understand the intricacies of smart contracts, and the Solidity programming language.

The development of any large project requires the use of developer tools to streamline the process. The tools you will learn in this week’s lab find their place in every smart contract developer’s toolkit.

## **Modules**

### **1: Introduction to Remix IDE & Solidity**

Remix IDE is an open source web and desktop application. It fosters a fast development cycle and has a rich set of plugins with intuitive GUIs. Remix is used for the entire journey of contract development as well as being a playground for learning and teaching Ethereum.

Remix has a dedicated plugin for beginners named ‘Learneth’. Go through the Learneth ‘Remix Basics’ tutorial to get an understanding of Remix IDE. Click [here](https://remix.ethereum.org/?#activate=udapp,solidity,LearnEth&call=LearnEth//startTutorial//ethereum/remix-workshops//master//basics) to start

After Remix basics, go through the ‘Solidity Introduction’ tutorial and spend some time on Remix with the available default files.

Learneth Documentation is available [here](https://remix-learneth-plugin.readthedocs.io/en/latest/ui.html)

Optionally, Go through the first 3 courses in the awesome Crypto Zombies course.

[https://lh3.googleusercontent.com/W7G82-WZfPZXZdPGTRnnWz9SCNynuQSNc6-8D44mmpAMo79vA7nukvgucO5gxSpHtHrZQvJ2IU-LF7IAHiTpPgn1_hEfsMBlKWXll_RIfGfe7hsdh3m0Kzt5ORxP9A8ZOBQ6Dt6X](https://lh3.googleusercontent.com/W7G82-WZfPZXZdPGTRnnWz9SCNynuQSNc6-8D44mmpAMo79vA7nukvgucO5gxSpHtHrZQvJ2IU-LF7IAHiTpPgn1_hEfsMBlKWXll_RIfGfe7hsdh3m0Kzt5ORxP9A8ZOBQ6Dt6X)

### **Exercises**

a. Find 2_Owner.sol in the Remix file explorer (hint: it will be in the contracts folder) i. If you don’t see the default files - try Remix on a private browser window.

b. Read it & try to understand what is going on.

c. Compile

d. Deploy to JSVM

e. Interact with the changeOwner function

f. Change addresses in Remix (in the JSVM environment)

### **2: Exploring Remix**

### **2a: Compiling a contract**

On Remix, a contract can be compiled using 'Solidity Compiler' plugin. It is loaded by default on Remix IDE.

https://remix-ide.readthedocs.io/en/latest/compile.html

**2b: Deploying contract**

A contract can be deployed using ‘Deploy and Run Transactions’ plugin. Remix provides a 'Javascript VM' environment using which one can deploy and interact with the contract without caring about Ether/gas required

https://remix-ide.readthedocs.io/en/latest/run.html

### **2c: Interacting with a contract**

After deployment, one can interact with a contract’s functions using ‘Deploy and Run’ Module itself.

https://remix-ide.readthedocs.io/en/latest/udapp.html

### **2d: Testing contract**

Remix IDE has a testing plugin named ‘Solidity Unit Testing’ to test your contract by writing the unit tests in Solidity itself.

https://remix-ide.readthedocs.io/en/latest/unittesting.html

Optionally, You can also use truffle to perform all above action. See

https://www.trufflesuite.com/docs/truffle/overview

### **Exercises**

1. Write some unit tests for the default 1_Storage.sol contract and run tests using Remix Solidity Unit Testing plugin

### **3: Using Web3.js or ethers.js scripts**

In the unit test, you wrote an automated way of hitting functions in a smart contract. There are javascript libraries for deploying and interacting with contracts. In Remix, we can use async/await scripts to access these libraries.

In the Remix File Explorer there are 2 default scripts that show how to deploy a contract.

To learn more about ethers.js and web3.js go to the Ethers docs, the Web3.js docs and see the [Remix medium article](https://medium.com/remix-ide/running-js-async-await-scripts-in-remix-ide-3115b5dd7687?sk=04e650dfa65905fdab0ecd5b10513d41) about using async/await scripts and also the [Remix docs](https://remix-ide.readthedocs.io/en/latest/running_js_scripts.html) on the scripts.

### **Exercises**

1. Deploy 2_Owner.sol with web3 or ethers by modifying one of the existing default scripts.
2. Get the current owner’s address with web3 or ethers.
3. Convert a string into bytes32 with ethers.js

### **4: Create your own ERC20 token**

For this last project, you’ll create your own ERC20 token *on a testnet* and distribute it to the group.

ERC20 tokens are the backbone of DeFi. They’re a way to represent ownership of a fungible asset that can represent anything.

This set of exercises is an opportunity for you to design and deploy your own ERC20. You’ll then create an exchange for your token with Uniswap so that anyone can buy your token with Eth.

You could create tokens that are redeemable for your time or that represent ownership of some real world asset. Get creative!

Distribution of tokens can be done in creative ways, find some here or use anything else to distribute your tokens to people.

### **Exercises**

1. Design, write and deploy a personal ERC20 token to testnet **Output**: a description of your token and the address of the token on testnet
2. Create a Uniswap pool for trading your token with Eth. The Uniswap v2 factory on goerli can be found [here](https://goerli.etherscan.io/address/0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f) **Output**: address of the pool on testnet
3. Share your token with the Ethereum India Fellowship #general channel 

### **5: DIY smart contract**

Writing a program that is not found in a tutorial is the best way to reinforce your knowledge.

**“Dead-man’s switch”**

A well-known problem for cryptocurrency holders is that all funds are lost if the owner is incapacitated and has not shared his/her private key with anyone else.

For this week’s submission, you are expected to write a smart contract that will send all of its balance to a pre-set address if the owner of that contract has not called a still_alive function on the contract in the last 10 blocks.

**Exercises**

1. Design, write, and deploy a dead man’s switch to goerli **Output**: goerli address of your deployed contract *and* link to the github repo for your contract’s code

### 6. **Create a simple multi-sig wallet** (Optional)

Write a smart contract that can own assets (ERC20/721 tokens) and store ETH that requires an "m of n" threshold of key holders in order to move funds. The wallet should be designed so keys can be added and removed and the threshold for signatures can be updated as keys are added and removed. There should be a check so that the threshold can never better greater than the number of keys controlling the wallet.

Do not worry about optimizing for off-chain signatures, assume all interactions are on-chain.

### **Exercises**

1. Add key and update threshold to 2 of 2 to move 1 ETH to 0x0 address (burn) **Output:** Transaction hash
