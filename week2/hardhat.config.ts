/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import "@nomiclabs/hardhat-waffle";
import {
  GOERLI_PRIVATE_KEY,
  GOERLI_PRIVATE_KEY_2,
  GOERLI_PRIVATE_KEY_3,
} from "./privateKey";

const INFURA_PROJECT_ID = "98b0477e69b1415cbaf0c6b49da3206a";

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [
        `0x${GOERLI_PRIVATE_KEY}`,
        `0x${GOERLI_PRIVATE_KEY_2}`,
        `0x${GOERLI_PRIVATE_KEY_3}`,
      ],
    },
  },
};
