import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { createSystem } from 'frog/ui'
import { generateImageComponent } from './utils.tsx'


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

const { Image, Heading } = createSystem()

interface TokenStore {
  [key: string]: number;
}

const tokenStore: TokenStore = {};



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
      <Button value='1'>1</Button>,
      <Button value='2'>2</Button>,
      <Button value='3'>3</Button>,
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

function generateThimblesImage(buttonValue: String, isWin: boolean) {
  const winPrefix = isWin ? 'thimbles_win_' : 'thimbles_nowin_';
  const imageSrc = `/${winPrefix}${buttonValue}.jpg`;

  return <Image src={imageSrc} objectFit="contain" height="256" width="256" />

}
app.frame('/result-thimble', (c) => {
  const { buttonValue } = c;

  if (!buttonValue) {
    throw new Error('Invalid button value');
  }

  const winningButton = Math.floor(Math.random() * 3) + 1;
  const isWin = buttonValue?.toString() == winningButton.toString()

  return c.res({
    action: '/mixing',
    imageOptions: { width: 1024, height: 1024 },
    image: generateThimblesImage(buttonValue, isWin),
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
