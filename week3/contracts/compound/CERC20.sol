// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../aave/IERC20.sol";

interface CERC20 is IERC20 {
  function repayBorrowBehalf(address borrower, uint256 repayAmount)
    external
    returns (uint256);

  function redeem(uint256 redeemTokens) external returns (uint256);
}
