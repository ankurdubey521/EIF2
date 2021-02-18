/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import { PRIVATE_KEY_1, PRIVATE_KEY_2, PRIVATE_KEY_3 } from "./privateKey";

const INFURA_PROJECT_ID = "98b0477e69b1415cbaf0c6b49da3206a";

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      forking: {
        url:
          "https://eth-mainnet.alchemyapi.io/v2/isjc2sza8ZV0h7V2nNh4Iiey9Y_k6EoW",
      },
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [
        `0x${PRIVATE_KEY_1}`,
        `0x${PRIVATE_KEY_2}`,
        `0x${PRIVATE_KEY_3}`,
      ],
    },
  },
};
