import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { createSystem } from 'frog/ui'
import { ethers } from 'ethers'
import { config } from 'dotenv';

// Load environment variables
config();

const provider = new ethers.JsonRpcProvider("https://base-mainnet.g.alchemy.com/v2/fzrPGVYmChxm1yuFXyGFk194e9LYXvrz")

const tokenAddress = process.env.TOKEN_ADDRESS as string
const contractAddress = process.env.CONTRACT_ADDRESS as string
const privateKey = process.env.PRIVATE_KEY as string
const wallet = new ethers.Wallet(privateKey, provider);
const contractAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "won",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountWon",
        "type": "uint256"
      }
    ],
    "name": "GamePlayed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "playGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]
const tokenAbi = [{ "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "chainId", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "ECDSAInvalidSignature", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "length", "type": "uint256" }], "name": "ECDSAInvalidSignatureLength", "type": "error" }, { "inputs": [{ "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "ECDSAInvalidSignatureS", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }], "name": "ERC20InvalidSpender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "serverAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "chainId", "type": "uint256" }], "name": "setChainId", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_serverAddress", "type": "address" }], "name": "setServerAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "usedNonces", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }]


// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

// const ZERO_TOKEN_ADDRESS = '0x12aa2d8ebd0b0886aeb89d7b824321f0cbccb160'; // Replace with your $ZERO token address

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  browserLocation: '/:path',
  imageAspectRatio: '1:1'
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})


const { Image } = createSystem()

export const generateImageComponent = (text: string) => {
  return (
    <div
      style={{
        alignItems: 'center',
        background: 'linear-gradient(to right, #432889, #17101F)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 30,
          letterSpacing: '-0.025em',
          lineHeight: 1.4,
          marginTop: 30,
          marginLeft: 200,
          marginRight: 200,
          padding: '0 120px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

app.frame('/', (c) => {
  const hello_message = `Welcome to the Plum thimbles game! Use your 1 $PLUM to play a game.`;

  return c.res({
    action: '/mixing',
    image: generateImageComponent(hello_message),
    intents: [
      <Button value='start' >Play</Button>,
      <Button.Redirect location="/docs">Rules</Button.Redirect>
      // <Button.Transaction target="/verify-balance">Verify Balance</Button.Transaction>,
    ]
  });
});

// app.transaction('/verify-balance', (c) => {
//   console.log(c.address)
//   return c.contract({
//     abi,
//     chainId: 'eip155:8453',
//     functionName: 'balanceOf',
//     args: [c.address],
//     to: "0x12aa2d8ebd0b0886aeb89d7b824321f0cbccb160",
//   })
// });


app.frame('/mixing', (c) => {
  return c.res({
    action: '/choose-thimble',
    image: '/thimbles.gif',
    intents: [
      <Button value='stop'>Press to stop mixing thimbles</Button>,
    ]
  });
});


app.frame('/choose-thimble', (c) => {
  return c.res({
    action: '/result-thimble',
    image: '/thimbles_all.jpg',
    intents: [
      // <Button value='1'>1</Button>,
      // <Button value='2'>2</Button>,
      // <Button value='3'>3</Button>,
      <Button.Transaction target="/play-game">1</Button.Transaction>,
      <Button.Transaction target="/play-game">2</Button.Transaction>,
      <Button.Transaction target="/play-game">3</Button.Transaction>,
    ],
  });
});

// app.transaction('/play-game', async (c) => {
//   try {
//     const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);

//     const balance = await tokenContract.balanceOf(c.address);
//     const allowance = await tokenContract.allowance(c.address, tokenAddress);

//     console.log('Address: ', c.address);
//     console.log('Contract Address: ', contractAddress);
//     console.log(`Balance: ${balance.toString()}`);
//     console.log(`Allowance: ${allowance.toString()}`);

//     const requiredAllowance = 1n;

//     // if (allowance < requiredAllowance) {
//     //   console.log(`Current allowance (${allowance.toString()}) is less than required (${requiredAllowance.toString()}). Approving...`);
//     //   const approveTx = await tokenContract.approve()
//     //   const receipt = await approveTx.wait();

//     //   if (receipt.status === 0) {
//     //     throw new Error('Transaction failed');
//     //   }

//     //   console.log(`Approved 2 tokens for the contract.`);
//     // }

//     // const newAllowance = await tokenContract.allowance(c.address, contractAddress);
//     // console.log(`New Allowance: ${newAllowance.toString()}`);

//     // if (newAllowance < requiredAllowance) {
//     //   throw new Error(`New allowance (${newAllowance.toString()}) is still less than required (${requiredAllowance.toString()})`);
//     // }

//     return c.contract({
//       abi: contractAbi,
//       chainId: 'eip155:8453',
//       functionName: 'playGame',
//       args: [requiredAllowance],
//       to: contractAddress,
//     });
//   } catch (error) {
//     console.error('Error during transaction:', error);
//     throw error;
//   }
// });

app.transaction('/play-game', async (c) => {
  const { address } = c;
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);

  // if (!verified) {
  //   return c.error({ message: "Is not verified by Farcaster Hub API." });
  // }

  if (!address) {
    return c.error({ message: "No wallet connected" });
  }
  const balance = await tokenContract.balanceOf(c.address);
  const allowance = await tokenContract.allowance(c.address, tokenAddress);
  console.log('Adress2: ', wallet.address)
  console.log('Contract Address: ', contractAddress);
  console.log(`Balance: ${balance.toString()}`);
  console.log(`Allowance: ${allowance.toString()}`);
  // Approve the contract to spend tokens
  // if (allowance < "1") {
  //   // Approve the contract to spend tokens if not already approved
  //   const approvalTx = await tokenContract.approve(contractAddress, "1");
  //   await approvalTx.wait();
  //   console.log("Tokens approved successfully");
  // } else {
  //   console.log("Sufficient allowance already granted");
  // }


  return c.contract({
    abi: contractAbi,
    chainId: 'eip155:8453',
    functionName: 'playGame',
    args: [1],
    to: contractAddress,
    value: BigInt(0)
  });

});

function generateThimblesImage(buttonValue: String, isWin: boolean) {
  const winPrefix = isWin ? 'thimbles_win_' : 'thimbles_nowin_';
  const imageSrc = `/${winPrefix}${buttonValue}.jpg`;
  return <Image src={imageSrc} objectFit="contain" height="256" width="256" />
}

app.frame('/result-thimble', (c) => {
  const { buttonIndex } = c;
  console.log(c.transactionId)

  if (!buttonIndex) {
    throw new Error('Invalid button value');
  }

  const winningButton = Math.floor(Math.random() * 3) + 1;
  const isWin = buttonIndex?.toString() == winningButton.toString()

  return c.res({
    action: '/mixing',
    imageOptions: { width: 1024, height: 1024 },
    image: generateThimblesImage(buttonIndex.toString(), isWin),
    intents: [
      <Button value="play-again"> Play Again</Button>,
      <Button.Reset>Return</Button.Reset>
    ],
  });
});



// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
