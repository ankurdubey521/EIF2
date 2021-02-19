import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import {
  ADDRESS_CONTRACT_PROTOCOL_DATA_PROVIDER,
  ADDRESS_TOKEN_USDT,
} from "../constants/contractMainnetAddress";
import { PROTOCOL_DATA_PROVIDER_ABI } from "../constants/abi/aave/protocolDataProvider";
import { DEBT_TOKEN_ABI } from "../constants/abi/aave/debtToken";

const delegateUsdtLoan = async (
  usdtTokenAmount: BigNumber,
  delegator: SignerWithAddress,
  delegateeAddress: string
) => {
  const providerContract = new ethers.Contract(
    ADDRESS_CONTRACT_PROTOCOL_DATA_PROVIDER,
    PROTOCOL_DATA_PROVIDER_ABI,
    delegator
  );

  // Get USDT debt token address
  const tokenDetails = await providerContract.getReserveTokensAddresses(
    ADDRESS_TOKEN_USDT
  );
  console.log(
    `delegateDaiLoan: found USDT debt token address: ${tokenDetails[1]}`
  );

  // Approve the delegation of loan
  const stableDebtContract = new ethers.Contract(
    tokenDetails[1],
    DEBT_TOKEN_ABI,
    delegator
  );
  await stableDebtContract.approveDelegation(delegateeAddress, usdtTokenAmount);
  // Verify delegation
  console.log(
    `delegateDaiLoan: Updated borrowAllowance to ${await stableDebtContract.borrowAllowance(
      delegator.address,
      delegateeAddress
    )}`
  );
};

export default delegateUsdtLoan;
