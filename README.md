# Plum Casino

## Project Overview
Plum Thimbles is an interactive web-based game that allows players to participate in a thimble guessing game using Ethereum. Players can stake a small amount of ETH and stand a chance to win double their stake. The project leverages the frog framework for building the UI and handling transactions with the Ethereum blockchain using the ethers library.

## Features
Interactive Gameplay: Players can mix thimbles and choose one to reveal if they've won.
Blockchain Integration: Transactions and game outcomes are handled on the Ethereum blockchain.
Dynamic UI: The interface is built using frog, providing a responsive and engaging user experience.

## Prerequisites
Node.js (version 14 or higher)
npm (version 6 or higher)
Ethereum wallet with test ETH
Base api key

## Installation
1. Clone the repository

```bash
git clone git@github.com:goftok/hackathon4.git
cd hackathon4
```

2. Install dependencies
```bash
npm install
```

3. Deploy the smart contract
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network base-mainnet
```
4. You can find abi for the contract in the artifacts/contracts folder. You
can find the contract address in the shell output.

5. Verify the smart contract on BaseScan

6. Start the application
```bash
npm run dev
```

7. Access the application at http://localhost:5173/api
8. Develop and test the application at http://localhost:5173/api/dev


## Information

Build for the Onchain Summer Buildathon
Hosted using vercel on https://hackathon4-taupe.vercel.app/api