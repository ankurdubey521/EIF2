// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./aave/FlashLoanReceiverBase.sol";
import "./aave/ILendingPool.sol";
import "./aave/ILendingPoolAddressesProvider.sol";
import "./aave/IERC20.sol";
import "./compound/CERC20.sol";
import "./IUSDT.sol";
import "hardhat/console.sol";

contract LoanTransfer is FlashLoanReceiverBase {
  IERC20 DAI_TOKEN = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
  IUSDT USDT_TOKEN = IUSDT(0xdAC17F958D2ee523a2206206994597C13D831ec7);
  CERC20 CDAI_TOKEN = CERC20(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);
  CERC20 CUSDT_TOKEN = CERC20(0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9);

  uint256 usdtLoanToBeRepaidAmount =  3 * (10**6);

  constructor(ILendingPoolAddressesProvider provider)
    FlashLoanReceiverBase(provider)
  {}

  function loanTransfer(address owner) internal {
    console.log("loanTransfer: arting loan transfer for owner: ", owner, "...");

    // Repay USDT loan of owner
    console.log("loanTransfer: repaying loan on behalf of owner...");
    USDT_TOKEN.approve(
      0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9,
      usdtLoanToBeRepaidAmount
    );
    CUSDT_TOKEN.repayBorrowBehalf(owner, usdtLoanToBeRepaidAmount);

    // Transfer all cDAO from owner to contact
    console.log("loanTransfer: transferring all cDAI to contract from owner");
    uint256 cDaiBalanceOwner = CDAI_TOKEN.balanceOf(owner);
    CDAI_TOKEN.transferFrom(owner, address(this), cDaiBalanceOwner);
    uint256 cDaiBalanceContract = CDAI_TOKEN.balanceOf(address(this));
    console.log("loanTransfer: contract cDAI balance: ", cDaiBalanceContract);

    // Redeem all cdai tokens
    console.log("loanTransfer: redeeming all cDAI tokens..");
    CDAI_TOKEN.redeem(cDaiBalanceContract);
    uint256 daiBalanceContract = DAI_TOKEN.balanceOf(address(this));
    console.log("loanTransfer: contract DAI balance: ", daiBalanceContract);

    // Deposit DAI on behalf of owner
    console.log("loanTransfer: depositing DAI on behalf of owner");
    DAI_TOKEN.approve(
      0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9,
      daiBalanceContract
    );
    LENDING_POOL.deposit(
      0x6B175474E89094C44Da98b954EedeAC495271d0F,
      daiBalanceContract,
      owner,
      0
    );

    // Take a loan of USDT on owner's behalf
    console.log("loanTransfer: taking loan on owner's behalf");
    LENDING_POOL.borrow(
      0xdAC17F958D2ee523a2206206994597C13D831ec7,
      usdtLoanToBeRepaidAmount,
      1,
      0,
      owner
    );
  }

  function executeOperation(
    address[] calldata assets,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    bytes calldata params
  ) external override returns (bool) {
    console.log(
      "executeOperation: USDT balance at start of flash loan: ",
      USDT_TOKEN.balanceOf(address(this))
    );

    address owner = abi.decode(params, (address));

    // Execute Loan Operation
    loanTransfer(owner);

    // Approve transfer of owed USDT after flash loan
    uint256 amountOwing = amounts[0] + premiums[0];
    IUSDT(assets[0]).approve(address(LENDING_POOL), amountOwing);
    console.log(
      "executeOperation: Asset:",
      assets[0],
      ", amountOwed:",
      amountOwing
    );

    return true;
  }

  function initiateLoanTransfer(address token, uint256 flashLoanAmount) public {
    address receiverAddress = address(this);

    address[] memory assets = new address[](1);
    assets[0] = address(token);

    uint256[] memory amounts = new uint256[](1);
    amounts[0] = flashLoanAmount;

    // 0 = no debt, 1 = stable, 2 = variable
    uint256[] memory modes = new uint256[](1);
    modes[0] = 0;

    address onBehalfOf = address(this);
    bytes memory params = abi.encode(msg.sender);
    uint16 referralCode = 0;

    console.log(
      "initializeLoanTransfer: requested flash loan of token ",
      token,
      "amount: ",
      flashLoanAmount
    );

    LENDING_POOL.flashLoan(
      receiverAddress,
      assets,
      amounts,
      modes,
      onBehalfOf,
      params,
      referralCode
    );
  }
}
