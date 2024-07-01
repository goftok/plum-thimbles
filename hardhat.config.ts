import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.19',
  },
  networks: {
    'base-mainnet': {
      url: 'https://mainnet.base.org',
      accounts: [process.env.WALLET_KEY as string],
    },
  },
  etherscan: {
    apiKey: {
     base: process.env.BASE_API_KEY as string,
    },
    customChains: [
      {
        network: "base-mainnet",
        chainId: 84532,
        urls: {
         apiURL: "https://api.basescan.org/api",
         browserURL: "https://basescan.org"
        }
      }
    ]
  },
  defaultNetwork: 'hardhat',
};

export default config;