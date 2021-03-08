# Devfolio Ethereum India Fellowship 2.0: My Journey as a Track 1 Fellow

This is a record of my journey through the Ethereum India Fellowship 2.0, as a track one fellow. To give a brief introduction about the program:

[Ethereum India Fellowship 2.0](https://devfolio.co/blog/devfolio-ethereum-india-fellowship-2-0-is-here/)
> The objective of Track1 is to educate, upskill, and introduce talented Web2 developers with no prior experience with Ethereum to Web3 development. 20 high-agency Web2 developers will be selected, whose Ethereum journey we aim to kickstart with this fellowship. Their 8-week journey will be divided into three main parts — Learn. Explore. Build. They will be paired off in groups of 2-3 with allotted mentors. They will go through detailed orientations and will be given a basic understanding of the ecosystem before they begin building. The associated payout over the course of the program is $1000.

To introduce myself briefly, I'm Ankur, a prefinal year CSE undergraduate at BIT Mesra (at the time this article was written). Before the events of the fellowship, I've been primarily a web2 full-stack developer, with an inclination towards backend development and studying systems at a scale. I've always had a huge interest in decentralized architectures and have explored protocols like torrent and products such as Matrix, Mastodon, and similar. When I discovered the fellowship it was clear to me that this would be the ideal next step in my journey of understanding decentralized systems, having no prior experience with crypto and ethereum. 

# Week 0: Reflection and a lot of Self Exploration
After a round of interviews, I was selected as one of the 20 fellows for track 1. The fellowship was to start in a week, and I decided to explore the blockchain ecosystem to prepare myself adequately for the fellowship.

Having no prior experience with blockchain and fintech I started exploring blockchain purely from an architectural point of view. With time I gradually explored more and more and began to appreciate the thought that went into the architecture, and the use-cases that it enables. During this phase, I went through a lot of different material but would like to mention [3b1b's video on bitcoin](https://www.youtube.com/watch?v=bBC-nXj3Ng4) and [Aners Brownworth's Blockchain 101 video](https://www.youtube.com/watch?v=_160oMzblY8) which solidified my fundamental understanding of a PoW chain. 

Once I got a general idea of blockchain, I went over and started digging deep into Ethereum. I started by understanding the [Ethereum White Paper](https://ethereum.org/en/whitepaper). The paper is awesome, and explains a lot of the nuances of the Ethereum Ecosystem in a detail, and also discusses a lot of use-cases for it. I found the paper to be very detailed and had to spend a lot of time recursively googling stuff (examples would be a lot of the financial concepts that Ethereum Leverages). Reading the whitepaper helped me develop an internal visualization and understanding of how the data flows around the chain during various operations. As a newcomer to the ecosystem devouring the whitepaper wasn't a trivial task😅, but at the end that made it worth the time spent.

Devfolio's [EtherPunk](https://etherpunk.devfolio.co/) was also going on at this time, and a lot of [sessions](https://www.youtube.com/watch?v=aGq9dVJlkfQ&list=PLar2Ti_Qchk7sf6jKM6rWyfl3P8XReXXA) were being conducted on different DeFi protocols. We were suggested to attend these sessions, and needless to say most of the content went over my head 😥. The best I could do was to attempt to form a set of assumptions in real-time and try to come up with an understanding of what was being covered based on that. I used to note all the terms, technologies, and stuff being discussed in brief in a notion doc and research them later. Thankfully this approach allowed me to keep up with the session frequency and I was able to develop a rudimentary understanding of DeFi.

Apart from this, I explored basic solidity and deployed a few simple contracts on test-net using remix. Honestly, so far this was the easiest part as solidity as language beautifully abstracts away all the complexities of using an EVM compatible chain, and this fact honestly blew me away when I was looking into it. Though of course, I should mention that there is a lot of nuances that you need to be careful of to keep your contract secure. Solidity documentation was also on point, so I didn't need to refer to any extra tutorials which saved a lot of time.

This week was over before I realized it, and I felt somewhat prepared for what was in store for the next few weeks.

# Week 1: Geth Rekt
The fellowship starts, and after a brief round of introductions, we were onboarded to the fellowship Discord. Track 1 fellows were grouped in cohorts of 4 and Track 2 fellows in groups of 2 and each cohort was assigned to a mentor. The fellowship follows the usual format: solve the assignments on your own and feel free to help out your fellows on the Discord channel. Mentors would pitch in if things go out of hand. In addition to that, we would have weekly sync-ups with our Mentors. So far the mentor sessions have been awesome, we discuss a lot of topics and do a lot of brainstorming sessions (the most fun part for me 😂).

On Monday, the worksheet for the upcoming week was released, the solutions of which were to be submitted by Saturday. The tasks were as follows:
1. Spin up a geth node.
2. Use the geth node to do send a couple of simple transactions.
3. Scrape some data using the APIs provided by your node.
4. Code a simple Merkle tree.

Now spinning up a geth node is as simple as downloading the geth client binary locally and running a single command to start the node. Post that, creating transactions and scraping data is just a matter of calling some `ethers` or `web3` functions. So you must be thinking all of this is pretty simple right? 

Well at least I thought the same, and in an ideal world, I might even be right. It turned out, however, that I was in for some fair bit of struggle.

<p align="center"><img src="https://user-images.githubusercontent.com/16562513/110236628-d90a9400-7f5c-11eb-8a2c-023965b323c6.png" width=400 }></p>

Our objective was to create a full node of the Goerli TestNet using geth. For starters, the Goerli chain is about 14GB in size, and geth's sync speed is heavily dependent on your network bandwidth as well as your system's IO performance. For a lot of us, Geth sync took upwards of 15 hours to finish syncing, and even then for a lot of fellows, the sync would never finish. Finding peers to download data off was also an issue, sometimes for hours, no peers would be available. In the end, the majority of us shifted our nodes from our local machine to a cloud VM (in my case Azure) or leveraged an existing node provider such as [Infura](https://infura.io/). 

To set the context, the laptop that I use had a core i7-9750H 6c12t processor, 32GB of 2666MHz RAM, and a 256GB NVMe storage running under RAID0 configuration. I use a 150mbps broadband connection with a ping of around 20-30ms. This was still not enough to run a full Goerli Node as the sync never finished when I tried it locally, and I was never able to locate the bottleneck even after extensive performance monitoring and profiling. A low-tier Azure VM (4c/16GB) with an identical operating environment (os + programs involved) in comparison was able to have a node up and running after around 12h of syncing. This still bugs me, and I plan to retry this sometime.

Once the node was up querying it was comparatively simpler. The only part where I got stuck for some time was the task to find the first block on which a smart contract is deployed on the Goerli chain (it's [12841](https://goerli.etherscan.io/block/12841), go check it out 😃). This required one to scan for a special kind of transaction called a ["contract creating transaction"](https://github.com/ethereumbook/ethereumbook/blob/develop/06transactions.asciidoc#special-transaction-contract-creation), the properties of which I was unaware off. I had to spend quite a while googling until I became aware of the existence of such transactions.

It was mostly smooth sailing for this week afterwards, didn't face any issue with the Merkle tree implementation. I was done with my assignments by Thursday.

### Epilogue: Uniswap and revelation of the "why" behind DeFi.
[Denver](https://www.linkedin.com/in/denverjude/) (the fellowship organizer), randomly invited us for a call one night on discord to discuss how things were going and similar stuff. As we discussed stuff he introduced [Uniswap](https://uniswap.org/blog/uniswap-v2/), a protocol for providing on-chain liquidity and token swapping in a completely decentralized way. I was intrigued, and decide to research into it further.

I went through some of their [documentation](https://uniswap.org/docs/v2) and their [whitepaper](https://uniswap.org/whitepaper.pdf). At the heart of Uniswap are its liquidity pools, which are based on a constraint called the [constant product rule](https://uniswap.org/docs/v2/protocol-overview/glossary/#constant-product-formula). To state it simply, the product of the quantities of two tokens inside a pool must not change after a trade has been made.

It is this constraint that ensures that the conversion ratio between two tokens of a liquidity pool always converges to their external "real" price ratio in terms of their value in fiat (or just value). Initially, this constraint made no sense to me from a mathematical point of view, neither was I able to grasp how in any way this would help in maintaining the conversion ratio between the two assets. However, once I dug deeper and understood the various economic incentives and did the actual math for myself (basically assuming the constraint and figuring out its effect on the conversation ratio of the tokens) I realized how beautifully the simple-looking constraint abstracts the mechanisms required to maintain the price, **without** relying on any external information about the prices of the tokens, making it truly decentralized. 

I think it was at this moment I began to grasp the "why" behind DeFi and the craze behind it. Solutions like these are simple, require no (and are resistant to) human intervention, and just "run" on their own.

# Week 2: The birth of CryptoPizza 🍕
Week 2 was all about solidity and smart contract development. As a pre-week exercise, we were asked to complete the first three modules of the awesome [CryptoZombies](https://cryptozombies.io) tutorial. It was pretty fun going through the modules and testing out solidity stuff on the go. Would recommend checking them out if you're starting with Solidity Development. This was followed by various getting acquainted with Remix as an IDE, and basic usage of `ethers`.

I had heard about [Hardhat](https://hardhat.org/) from one of the EtherPunk sessions. It's a development framework similar to [Truffle Suit](https://www.trufflesuite.com/) which allows you to rapidly test and deploy smart contracts and most notably, allows you to perform `console.log()` operations from within your contract. A couple of mentors also recommended using hardhat, so I switched to it for the remainder of the fellowship. In retrospect, this was a very good decision, as hardhat's debugging and scripting capabilities proved to be extremely useful for the rest of the module and in all coming weeks.

This week had three major goals:
1. To create an ERC20 token (equivalently, a new cryptocurrency) and launch it on the goerli test-net. Also create a liquidity pool on Uniswap so that other people could buy your token using goETH.
2. To implement a dead man's switch contract.
3. To create a simple multi-sig wallet.

### Creating our ERC20 token
This was easier than it sounds. One can think of [ERC20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) as a standard that defines the standard for creating fungible cryptocurrencies on Ethereum. You deploy a smart contract that is responsible for maintaining the balances of each address that holds your token and associated functions responsible for token transfer between contracts. This is nicely explained in the ERC20 standard, I didn't face many issues here. 

I launched [PIZZA🍕](https://goerli.etherscan.io/token/0x80f4150deaacf17ba2ae00d7206d8e985521eab4) on Goerli Testnet. Now whenever someone pings me for a party, I can just send these tokens to them instead😂.

I did get stuck in a slightly awkward place during pool creation on Uniswap. When you use the Uniswap UI and create a pool it's not apparent where you're supposed to get the pool address from. I couldn't find it anywhere on the dashboards, so in the end, I had to use React DevTools to extract the pool address from the component state.
![image](https://user-images.githubusercontent.com/16562513/110238960-70c2af00-7f6a-11eb-9a7d-dc61dee82c0b.png)

### The DeadMan's switch contract
> A well-known problem for cryptocurrency holders is that all funds are lost if the owner is incapacitated and has not shared his/her private key with anyone else.

The goal was to write a smart contract that will send all of its balance to a pre-set address if the owner of that contract has not called a `still_alive` function on the contract in the last 10 blocks.

Checking the condition proved to be a relatively simple exercise, and overall I didn't face any issue as such implementing the contract. However, I'd like to highlight the problem of sending funds from the contract to a trusted owner. This can be handled in two major ways, both having pros and cons and we had a good discussion amongst the fellows highlighting the same:
1. The first is to just call the solidity `transfer()` function and transfer all funds to the preset address, and then mark the contract as non-operational. 
2. Another option is to use the special `selfdestruct()` call, which optionally takes an address as a parameter. What self destruct does is that it deletes** the contract and its state from the blockchain and sends any funds the contract holds to the address specified as the parameter. The advantage of doing this is that `selfdestuct()` consumes negative gas (making the transaction cost less) and the downside is that the contract's functions can still be called but they won't have any effect. Consequently, any further funds sent to the contract would be lost forever.

We did not reach a clear consensus on which method was better in this case, so I'll just leave [this](https://ethereum.stackexchange.com/questions/315/why-are-selfdestructs-used-in-contract-programming) StackOverflow thread here for now.

** when I say delete I mean that the contract is rendered in-operational from the latest block, not that it's removed from all previous blocks in history (which is not possible as blockchains are immutable).

###  Implementation of a Multisignature Wallet
This was the most informative section of this week. We were required to implement a wallet that can own assets (ERC20/721 tokens) and store ETH that requires an "m of n" threshold of key holders to move funds.
The challenging aspects were:
1. Design a protocol to allow the addition or removal of key holders, and this should be done in a way to prevent a hostile takeover. I added the concept of `owners` as privileged holders to mitigate this.
2. Look into how some given data can be signed off-chain using the holders' addresses as public keys. `ethers` has inbuilt functions to handle this, but certain nuances need to be taken care of.
3. Look into how on-chain signature verification is done. Again, solidity has functions to handle this, but certain things had to be considered for the signature generated by an off-chain `ethers` script is successfully verified on-chain.
4. Prevent replay of transactions, for this I added a nonce field to the transaction body. 

Checkout out [this](https://github.com/ankurdubey521/EIF2/tree/master/week2/contracts/module6) for more information on my implementation. To get an idea of the functionality, take a look at the [tests](https://github.com/ankurdubey521/EIF2/blob/master/week2/test/module6-tests.ts).

# Week 3: Peak of dΦ/dt
> Decentralized finance—often called DeFi—refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on the Ethereum blockchain. From lending and borrowing platforms to stable-coins and tokenized BTC, the DeFi ecosystem has launched an expansive network of integrated protocols and financial instruments. With over $39 billion worth of value locked in Ethereum smart contracts, decentralized finance has emerged as the most active sector in the blockchain space, with a wide range of use cases for individuals, developers, and institutions. 

This week was all about Decentralized Finance; each cohort was assigned a particular DeFi niche. By the end of the week, each member was supposed to pick one of the top four protocols of the niche, understand it and present it to the fellows at the end of the week. In addition to this, we were instructed to build a DApp utilizing our chosen protocol.

Our cohort was assigned the **Lending and Borrowing + StableCoins** niche. The four most popular protocols in this niche are the Lending Protocols [AAVE](https://aave.com) and [Compound](https://compound.finance/) and the Stable Coins [MakerDAO](https://makerdao.com/en/) and [DefiDollar](https://dusd.finance/). I decided to pick MakerDAO as my presentation topic and began looking into it.

![image](https://user-images.githubusercontent.com/16562513/110244984-5f3bd000-7f87-11eb-93c4-6378bf72e002.png)
> image from [dappradar](https://dappradar.com/blog/top-5-defi-dapps-of-the-week)

MakerDAO is a very interesting project, as it is (probably) the first stable-coin that operates in a completely decentralized manner. Stablecoins are cryptocurrencies that are designed to resist changes in their value, and in DAI's case, its value is pegged to 1 USD. There are other centralized stable-coins as well such as [Tether](https://tether.to/) and [USDC](https://www.circle.com/en/usdc), but DAI has become much more popular due to its decentralized aspect. Once again, going through the [MakerDAO White Paper](https://makerdao.com/en/whitepaper) was enough to give me a decent understanding of the project, and create a small [presentation](https://docs.google.com/presentation/d/1X0clhDnVCwu6myD5jmeZ7J50v14_XeiG0TG-4LiaaRM/edit?usp=sharing) on top of it.

I did not want to limit myself to a single topic and as I still had time, I decided to look into the other three protocols. However, this is where my relative inexperience with financial terminology started catching up with me. AAVE and Compound are very similar, both are lending protocols and operate on a similar set of principles. I had spent some time researching how lending works in the normal Centralized Finance world and then jumped into the DeFi counterparts. [Finematics'](https://www.youtube.com/channel/UCh1ob28ceGdqohUnR7vBACA) videos on DeFi proved to be extremely helpful as they also cover the required financial background to understand the DeFi protocol in question. Once I developed a basic understanding I went through both AAVE's and Compound's Developer Documentation, and made the following conclusions:
1. Both AAVE and Compound allow you to deposit ETH and ERC20 tokens as collateral, and borrow a different ERC20 token as a loan against the collateral. AAVE issues aTokens against the collateral, and Compound issues cTokens, which can be liquidated to get back your collateral.
2. Compound provides variable interest rates only, while AAVE provides both stable and variable interest rates on your collateral depending on the token.
3. One of AAVE's main differentiating factors is its flash loan service, which allows you to take an uncollateralized loan of any amount of crypto as long as you return the loan within the same transaction. This has a wide range of applications, the most popular being arbitrage bots.

Based on my research it looked like AAVE was the better platform, and I wanted to try the flash loan thing out. So I decided to dig deeper into it, [this](https://arxiv.org/pdf/2010.12252) research paper helped a lot.

I noticed that flash loans can be used for many applications where the net resultant fund gain or loss is 0 if you ignore the premiums and gas costs involved. I decided to build a [loan transfer utility](https://docs.google.com/presentation/d/1wwlSkuSxtyfH0ozRuBQVZ4_lE_VfyCrBqort2kKat-A/edit?usp=sharing) that would utilize AAVE's flash loans to transfer a loan from Compound to AAVE without requiring the user to pay back their loan to Compound. The idea seemed interesting to me, but this meant that I would have to work with three different unknown protocols (AAVE's loan, AAVE's flash loan, and Compound's loan) in the same week. This proved to be quite time-consuming and somewhat challenging but I managed to complete a PoC of the contract that would handle the loan transfer and a script that would be responsible for simulating the situation before the end of the week. The logic as well the code can be found [here](https://github.com/ankurdubey521/EIF2/tree/master/week3).

To mention a couple of difficulties I faced:
1. There was a lot of material to cover, so had to rush through certain sections to complete in time.
2. The test loan that I took was USDT against DAI. Apparently on main-net USDT's approve function doesn't return anything when it should be returning a bool according to ERC20 spec, which caused a bug that took me a long time to trace. Had to use openzeppelin's [SafeERC20](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#SafeERC20) wrapper to fix that.

Hardhat's [Mainnet Forking](https://hardhat.org/guides/mainnet-forking.html) feature helped with the development, as it allowed me to directly interface with main-net contracts of AAVE and Compound from my local hardhat node, allowing me to test on the actual contracts without spending any gas or real money.

I learned a lot about DeFi this week, therefore dΦ/dt was at its peak.

# Week 4: BUIDLing for EtherPunk
We fellows thought that the last week was hectic, turns out that was just to prepare us for this week.

Enter EtherPunk. EtherPunk originally kicked off on 22nd January and was to end on February 28th, exactly one week for now. The fellows were encouraged to buidl and submit a hack in a week. There were no general prizes in this hackathon; as such we were heavily incentivized to incorporate as many bounties into our hack as possible. This meant researching a couple of different (and unfamiliar) protocols, coming up with a good idea, and finally implementing everything in one week. Initially, I was uncertain if I would be able to pull it off but decided to participate anyway and see how far I could go, a very good decision in retrospect.

I teamed up with [Dipanwita](https://github.com/susiejojo), a fellow from the same cohort. Here's her [write-up](https://www.notion.so/Looking-back-at-Week4-Letting-my-imagination-run-wild-2401d9327e094c4dacb1bf4456bd0268) of how the whole week progressed, make sure to give it a read! 

We decided to build [🌪 HurriCARE 🌪](https://github.com/ankurdubey521/HurriCARE), a decentralized insurance platform where you pay a premium based on your location and get super-fast guaranteed relief funds when you are hit by a cyclone or a hurricane.
The project's backbones were the [SuperFluid](https://www.superfluid.finance) and [Chainlink](https://chain.link) protocols. We utilized SuperFluid to allow gasless streaming of premiums from users and the protocol gave us an easy way to track which users are currently paying premiums and which are not. Chainlink was used to get the location data from OpenWeatherApi on-chain, using which we decided when to disburse relief funds to affected individuals. Chainlink's alarm clock was also essential for running the check function periodically.

In addition to these, the project was deployed on [Polygon (previously Matic)](https://matic.network) Mumbai test-net and supported [Metamask](https://metamask.io) and [Portis](https://www.portis.io) as login methods.

To mention a couple of challenges that we ran into:
1. Our knowledge of DeFi being a little over a week old, we struggled to understand a lot of the concepts and architecture of the protocols as well as following docs religiously and implementing them. 
2. Further, we tested our contracts on the test-nets, but while switching networks we realized that a lot of features were not cross-network, such as the Chainlink Alarm Clock oracle on Matic.
3.  Also since our application is heavily dependent on current weather conditions, it was difficult to test and demo our application, and we had to simulate using scripts to test out our contracts.

Our [hack](https://devfolio.co/submissions/hurricare-5e67) won the runner-up bounties of both SuperFluid and Chainlink, which amounted to a total of 1000$ in crypto🤩. Aside from the bounties we won this victory also symbolized that we'd made real progress over these four weeks as DeFi developers, especially considering that four weeks ago a lot of the stuff covered in the EtherPunk sessions just flew over my head.

Throughout the hackathon, we had the full support of the Chainlink and SuperFluid communities. We hopped over to their discord servers and any questions or issues would be resolved within a day. This allowed us to get started with their SDKs quickly and focus on the main business logic of the app.

Video Demo: 

 [![hurriCARE](https://img.youtube.com/vi/KZ0pRlZStT8/0.jpg)](https://www.youtube.com/watch?v=KZ0pRlZStT8)
