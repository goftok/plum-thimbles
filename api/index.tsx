import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'


// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

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
  const userId = 'someUserId';
  tokenStore[userId] = tokenStore[userId] ?? 10;
  const hello_message = `Welcome to the Plum thimbles game!\nYour current balance is ${tokenStore[userId]} $PLUM`;
  console.log(tokenStore[userId])

  return c.res({
    action: '/mixing',
    image: generateImageComponent(hello_message),
    intents: [
      <Button value='start' >Play</Button>,
      <Button.Redirect location="/docs">Rules</Button.Redirect>
    ]
  });
});


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
      <Button value="1">1</Button>,
      <Button value="2">2</Button>,
      <Button value="3">3</Button>,
    ],
  });
});


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
