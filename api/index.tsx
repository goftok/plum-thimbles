import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { handle } from 'frog/vercel'
import { createSystem } from 'frog/ui'
import { ethers } from 'ethers'
import { config } from 'dotenv';

config();

const provider = new ethers.AlchemyProvider('base', process.env.ALCHEMY_API_KEY)
const contractAddress = process.env.CONTRACT_ADDRESS as string
const contractAbi = [
  {
    "inputs": [],
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdrawal",
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
    "inputs": [],
    "name": "playGame",
    "outputs": [],
    "stateMutability": "payable",
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
    "name": "withdrawETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]


// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  browserLocation: '/:path',
  imageAspectRatio: '1:1',
  title: 'Plum Thimbles',
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
  const hello_message = `Welcome to the Plum thimbles game! Use your 0.001 ETH to play a game. You can win 0.002 ETH!`;

  return c.res({
    action: '/mixing',
    image: generateImageComponent(hello_message),
    intents: [
      <Button value='start' >Play</Button>,
      // <Button.Transaction target="/verify-balance">Verify Balance</Button.Transaction>,
    ]
  });
});


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
    action: '/wait-results',
    image: '/thimbles_all.jpg',
    intents: [
      <Button.Transaction target="/play-game">1</Button.Transaction>,
      <Button.Transaction target="/play-game">2</Button.Transaction>,
      <Button.Transaction target="/play-game">3</Button.Transaction>,
    ],
  });
});


app.transaction('/play-game', async (c) => {
  return c.contract({
    abi: contractAbi,
    chainId: 'eip155:8453',
    functionName: 'playGame',
    to: contractAddress,
    value: BigInt(100000000000000)
  });
});

function generateThimblesImage(buttonValue: String, isWin: boolean) {
  const winPrefix = isWin ? 'thimbles_win_' : 'thimbles_nowin_';
  const imageSrc = `/${winPrefix}${buttonValue}.jpg`;
  return <Image src={imageSrc} objectFit="contain" height="256" width="256" />
}

// Function to get game result from transaction hash
async function getGameResult(txHash: string): Promise<{ won: boolean, amountWon: ethers.BigNumber } | null> {
  try {
    // Fetch the transaction receipt
    const receipt = await provider.waitForTransaction(txHash);

    if (!receipt) {
      console.log("Transaction not found");
      return null;
    }

    // Initialize contract instance
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);

    // Parse logs for GamePlayed event
    const gamePlayedEvent = receipt.logs.map(log => {
      try {
        return contract.interface.parseLog(log);
      } catch (error) {
        return null;
      }
    }).filter(event => event && event.name === 'GamePlayed')[0];

    if (gamePlayedEvent) {
      const { player, won, amountWon } = gamePlayedEvent.args;
      return { won, amountWon };
    } else {
      console.log("No GamePlayed event found in transaction logs");
      return null;
    }
  } catch (error) {
    console.error("Error fetching transaction receipt:", error);
    return null;
  }
}

app.frame('/wait-results', (c) => {
  const { buttonIndex, transactionId } = c;

  return c.res({
    action: `/result-thimble/${buttonIndex}/${transactionId}`,
    image: '/thimbles_all.jpg',
    intents: [
      <Button>Wait 5 seconds for the result</Button>,
    ]
  });
});

// App frame handling function
app.frame('/result-thimble/:buttonIndex/:transactionId', async (c) => {
  const buttonIndex = c.req.param('buttonIndex');
  const transactionId = c.req.param('transactionId');

  if (!buttonIndex) {
    throw new Error('Invalid button value');
  }

  if (!transactionId) {
    throw new Error('Transaction ID is required');
  }

  try {
    const gameResult = await getGameResult(transactionId);


    if (!gameResult) {
      throw new Error('Unable to fetch game result');
    }

    const { won, amountWon } = gameResult;
    const message = won
      ? `You won 0.0002 ETH. Play again?`
      : `You lose 0.0001 ETH. Play again?`;

    return c.res({
      action: '/mixing',
      imageOptions: { width: 1024, height: 1024 },
      image: generateThimblesImage(buttonIndex.toString(), won),
      intents: [
        <Button value="play-again"> {message} </Button>,
        <Button.Reset>Return</Button.Reset>
      ],
    });
  } catch (error) {
    console.error("Error handling frame:", error);
    throw new Error('An error occurred while processing your request.');
  }
});


// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
