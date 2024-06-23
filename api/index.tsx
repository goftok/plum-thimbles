import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'


// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

// const ZERO_TOKEN_ADDRESS = '0x12aa2d8ebd0b0886aeb89d7b824321f0cbccb160'; // Replace with your $ZERO token address

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  browserLocation: '/:path',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})


interface TokenStore {
  [key: string]: number;
}

const tokenStore: TokenStore = {};

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
          fontSize: 60,
          letterSpacing: '-0.025em',
          lineHeight: 1.4,
          marginTop: 30,
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
      // <Button.Transaction target="/verify-balance">Verify Balance</Button.Transaction>,
      <Button.Redirect location="/docs">Rules</Button.Redirect>
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
  const mixing_message = "/mixing gif with thimbles/";

  return c.res({
    action: '/choose-thimble',
    image: generateImageComponent(mixing_message),
    intents: [
      <Button value='stop'>Press to stop mixing thimbles</Button>,
    ]
  });
});


app.frame('/choose-thimble', (c) => {
  let resultMessage = '/image of the thimbles/\nChoose a number: 1, 2, or 3. If you win, you get 2 tokens. If you lose, you lose 1 token.';
  return c.res({
    action: '/result-thimble',
    image: generateImageComponent(resultMessage),
    intents: [
      <Button value='1'>1</Button>,
      <Button value='2'>2</Button>,
      <Button value='3'>3</Button>
      // <Button.Transaction target="/choose/1">1</Button.Transaction>,
      // <Button.Transaction target="/choose/2">2</Button.Transaction>,
      // <Button.Transaction target="/choose/3">3</Button.Transaction>,
    ],
  });
});

// app.transaction('/choose/:number', (c) => {
//   const number = c.req.param('number')
//   const winningButton = Math.floor(Math.random() * 3) + 1;

//   // if buttonValue?.toString() == winningButton.toString() then send 2 $ZERO to user
//   // if not take 1 $ZERO from user
//   return c.contract({

//   })
// });


app.frame('/result-thimble', (c) => {
  const { buttonValue } = c;
  const userId = 'someUserId';

  const winningButton = Math.floor(Math.random() * 3) + 1;

  let resultMessage = '/opening one thimble/\n'

  if (buttonValue?.toString() == winningButton.toString()) {
    tokenStore[userId] += 2;
    resultMessage += `You win! Your tokens: ${tokenStore[userId]}`;
  } else {
    tokenStore[userId] -= 1;
    resultMessage += `You lose. Your tokens: ${tokenStore[userId]}`;
  }

  return c.res({
    action: '/choose-thimble',
    image: generateImageComponent(resultMessage),
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
