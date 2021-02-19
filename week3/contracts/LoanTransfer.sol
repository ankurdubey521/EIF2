// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./aave/FlashLoanReceiverBase.sol";
import "./aave/ILendingPool.sol";
import "./aave/ILendingPoolAddressesProvider.sol";
import "./aave/IERC20.sol";
import "hardhat/console.sol";

contract LoanTransfer is FlashLoanReceiverBase {
  address constant DAI_TOKEN = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

  constructor(ILendingPoolAddressesProvider provider)
    FlashLoanReceiverBase(provider)
  {}

  function executeOperation(
    address[] calldata assets,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    bytes calldata params
  ) external override returns (bool) {
    console.log(
      "executeOperation: DAI balance at start of flash loan: ",
      IERC20(DAI_TOKEN).balanceOf(address(this))
    );

    for (uint256 i = 0; i < assets.length; i++) {
      uint256 amountOwing = amounts[i] + premiums[i];
      IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
      console.log(
        "executeOperation: Asset:",
        assets[i],
        ", amount:",
        amounts[i]
      );
      console.log("executeOperation: premium: ", premiums[i]);
    }

    return true;
  }

  function initiateLoanTransfer() public {
    address receiverAddress = address(this);

    address[] memory assets = new address[](1);
    assets[0] = address(DAI_TOKEN);

    uint256[] memory amounts = new uint256[](1);
    amounts[0] = 1000000000000;

    // 0 = no debt, 1 = stable, 2 = variable
    uint256[] memory modes = new uint256[](1);
    modes[0] = 0;

    address onBehalfOf = address(this);
    bytes memory params = "";
    uint16 referralCode = 0;

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
