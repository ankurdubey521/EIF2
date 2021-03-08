import "@nomiclabs/hardhat-waffle";

import {
  GOERLI_PRIVATE_KEY,
  GOERLI_PRIVATE_KEY_2,
  GOERLI_PRIVATE_KEY_3,
} from "./privateKey";

const INFURA_PROJECT_ID = "98b0477e69b1415cbaf0c6b49da3206a";

module.exports = {
  solidity: { compilers: [{ version: "0.7.6" }, { version: "0.6.6" }] },
  hardhat: {
    forking: {
      url:
        "https://eth-mainnet.alchemyapi.io/v2/isjc2sza8ZV0h7V2nNh4Iiey9Y_k6EoW",
    },
  },
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [
        `0x${GOERLI_PRIVATE_KEY}`,
        `0x${GOERLI_PRIVATE_KEY_2}`,
        `0x${GOERLI_PRIVATE_KEY_3}`,
      ],
    },
    matic: {
      url: "https://rpc-mumbai.matic.today",
      accounts: [
        `0x${GOERLI_PRIVATE_KEY}`,
        `0x${GOERLI_PRIVATE_KEY_2}`,
        `0x${GOERLI_PRIVATE_KEY_3}`,
      ],
      chainId: 80001,
    },
  },
};
