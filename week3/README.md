# Transfer a loan from compound to aave using a flash loan

Current Plan:
Assume <owner> has taken a loan of x USDT against x DAI collateral from COMPOUND
Assume <contract> is the contract responsible for transferring the loan

Steps to transfer the loan to AAVE without touching the x USDT taken by user:

Pre flash loan: 
1. <owner> uses DAI.approveDelegation() to allow <contact> to take a loan of x DAI. [1]
2. <owner> use Compound.cDAI.approve() to allow transfer of x cDAI from <owner> to <contract>. [1]

Flash Loan:
1. <contract> takes flash loan of x USDT. [2]
2. <contract> uses Compound.cUSDT.repayBorrowBehalf() to repay loan of x USDT on behalf of <owner>. [3]
3. <contract> uses Compound.cDAI.transferFrom() to transfer x cDAI from <owner> to <contract>. [1]
4. <contract> uses Compound.cDAI.redeem() to get x DAI back. [4]
5. <contract> uses Aave.LendingPool.deposit() to deposit x DAI on behalf of <owner>. [5]
6. <contract> uses Aave.LendingPool.borrow() to takes an uncollateralized loan of x USDT on behalf of <owner> from Aave. [6]
7. <contract> returns x USDT to flash loan.

Links:

[1] https://docs.openzeppelin.com/contracts/2.x/api/token/erc20

[2] https://docs.aave.com/developers/guides/flash-loans

[3] https://compound.finance/docs/ctokens#repay-borrow-behalf

[4] https://compound.finance/docs/ctokens#redeem

[5] https://docs.aave.com/developers/the-core-protocol/lendingpool#deposit

[6] https://docs.aave.com/developers/the-core-protocol/lendingpool#borrow