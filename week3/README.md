# Week 3 - Modern Eth Developement & getting started with DeFi

## **Objective:**

Now that you're familiar with the basics of Ethereum and developing on it, it's time to hone your skills and learn about the ecosystem. This week we'll help you start developing with the development environment that's fast becoming essential for the modern Ethereum developer. In parallel, you'll be diving into the most popular use case of Ethereum out there (DeFi) and putting your skills to use by building a basic decentralized application end-to-end.

## **Modules:**

### **1. Exploring Hardhat**

Hardhat is a development environment to compile, deploy, test, and debug your Ethereum software. It helps developers manage and automate the recurring tasks that are inherent to the process of building smart contracts and dApps, as well as easily introducing more functionality around this workflow. This means compiling, running, and testing smart contracts at the very core.

Hardhat comes built-in with Hardhat Network, a local Ethereum network designed for development. Its functionality focuses around Solidity debugging, featuring stack traces, console.log(), and explicit error messages when transactions fail.

Hardhat Runner, the CLI command to interact with Hardhat, is an extensible task runner. It's designed around the concepts of **tasks** and **plugins**. Every time you're running Hardhat from the CLI, you're running a task. E.g. npx hardhat compile is running the built-in compile task. Tasks can call other tasks, allowing complex workflows to be defined. Users and plugins can override existing tasks, making those workflows customizable and extendable.

A lot of Hardhat's functionality comes from plugins, and, as a developer, you're free to choose which ones you want to use. Hardhat is unopinionated in terms of what tools you end up using, but it does come with some built-in defaults. All of which can be overriden.

Read more about HardHat [here](https://hardhat.org/getting-started/)

### Exercise

1. Go through modules 1-7 listed here: [https://hardhat.org/tutorial/](https://hardhat.org/tutorial/)
2. Note the deployed contract address. Submit it [here]. 
3. The Tutorial uses the Ropsten test network. Learn about the different networks [https://ethereum.org/en/developers/docs/networks/](https://ethereum.org/en/developers/docs/networks/) and try to deploy on each of them. Briefly describe differences if any you notice while doing so. 

**Optional Tool - Scaffold.eth**

Scaffold.eth integrates with Hardhart and provides a handy iteration loop between creating smart contract logic and building frontend functionality.

Learn more here: [https://github.com/austintgriffith/scaffold-eth](https://github.com/austintgriffith/scaffold-eth)

Going through the tutorials and integrating Scaffold.eth into your developement workflow will greatly aid your development process and is highly recommended.

### **2. Dive into DeFi**

Decentralized finance—often called DeFi—refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on the Ethereum blockchain. From lending and borrowing platforms to stablecoins and tokenized BTC, the DeFi ecosystem has launched an expansive network of integrated protocols and financial instruments. With over $39 billion worth of value locked in Ethereum smart contracts, decentralized finance has emerged as the most active sector in the blockchain space, with a wide range of use cases for individuals, developers, and institutions. Read more [here](https://consensys.net/blockchain-use-cases/decentralized-finance/).

You can watch the following videos to get more of an understanding of the DeFi space.

- [https://www.youtube.com/watch?v=Sv0dte93lQQ](https://www.youtube.com/watch?v=Sv0dte93lQQ)
- [https://www.youtube.com/watch?v=91s4srhJPh0](https://www.youtube.com/watch?v=91s4srhJPh0)

### Further Resources

Defi Pulse: [https://defipulse.com/](https://defipulse.com/)

DeFi Pulse is a site where you can find the latest analytics and rankings of DeFi protocols.

Defi Prime: [https://defiprime.com/](https://defiprime.com/)

[DeFiprime.com](http://defiprime.com/) is a media outlet and analytical services provider for the DeFi community.

### Exercise

1. Each mentor cohort has been assigned a particular niche in DeFi as found below. All team members need to go through that particular niche in detail and pick one of the 4 most prominent protocols/projects in the space listed against your team's name. Here is the list
    1. [Derivatives](https://defiprime.com/derivatives) + [Insurance](https://defiprime.com/insurance) (Synthetix, Opyn, Yearn.finance, Nexus Mutual) - Team Arth
    2. [Decentralised Exchanges](https://defiprime.com/exchanges#ethereum) (Uniswap, Curve, Balancer, 1inch.exchange) - Team Harsh
    3. [Lending & Borrowing](https://defiprime.com/decentralized-lending) + [Stablecoins](https://defiprime.com/stablecoins) (AAVE, Compound, Maker, DefiDollar) - Team Divya
    4. [Asset Mangment Tools](https://defiprime.com/assets-management-tools#ethereum) (Instadapp, Zapper, Furucombo, Set Protocol) - Team Aniket
    5. [Prediction Markets](https://defiprime.com/prediction-markets) + [Alternate Savings](https://defiprime.com/alternative-savings)/[Payments](https://defiprime.com/payments) (Augur, Pooltogether, Superfluid, Polymarket) - Team Pranav
2. The 4 projects will be internally assigned to a team member each from the cohort group. The team members will have to present a 5 mins (incl. 2 mins for questions) presentation each on the project in a group call on Saturday evening to the entire fellowship cohort. The objective is to give a high-level summary of the project to your fellow team members.
3. [Submit]

### **3. #BUIDLing on DeFi**

Now that you've got a handle on developing on Ethereum and are familiar with a few projects in the ecosystem, it's time to put your skills and knowledge to use. As part of this module, you'll be building a simple Dapp based on a Defi Protocol/Project, preferably incorporating the project you're going to present in some way or the other. If it isn't feasible to build on the presentation project, you may choose an alternate DeFi project/protocol to build on in consultation with your mentor. Note that the project scope should be simple enough to be completed within the week. We'll have time for more ambitious projects in the second half of the fellowship.

### **Exercise:**

1. Submit your project's repo link here once you start building it (at most by Friday midnight)
2. Describe the project briefly in 2 mins following your 5 min presentation to the cohort.
3. Complete your project and get a review by your mentor