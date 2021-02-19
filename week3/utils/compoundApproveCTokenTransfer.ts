import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import {
  ADDRESS_TOKEN_CDAI,
  ADDRESS_TOKEN_DAI,
} from "../constants/contractMainnetAddress";
import { CERC20_ABI } from "../constants/abi/compound/cerc20abi";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { keccak256 } from "ethers/lib/utils";

const approveAllCTokenTransfer = async (
  signer: SignerWithAddress,
  spenderAddress: string
) => {
  const contract = new ethers.Contract(ADDRESS_TOKEN_CDAI, CERC20_ABI, signer);
  // Get cDAI balance of signer
  const balance: BigNumber = await contract.balanceOf(signer.address);
  console.log(
    `approveAllCTokenTransfer: found cDAI balance ${balance} of signer.`
  );
  // Call apptove and confirm
  console.log(
    `approveAllCTokenTransfer: Approving expenditure of ${balance} by ${spenderAddress}'`
  );
  await contract.approve(spenderAddress, balance);
  console.log(
    `approveAllCTokenTransfer: Updated spend limit of cDAI by ${spenderAddress} to ${await contract.allowance(
      signer.address,
      spenderAddress
    )}`
  );
};

export default approveAllCTokenTransfer;
