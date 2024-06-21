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
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

interface TokenStore {
  [key: string]: number;
}

const tokenStore: TokenStore = {};

app.frame('/', (c) => {
  const { buttonValue, status } = c;
  const initialTokens = 10;
  const userId = 'someUserId';

  tokenStore[userId] = tokenStore[userId] ?? initialTokens;

  const winningButton = Math.floor(Math.random() * 3) + 1;

  let resultMessage = 'Choose a number: 1, 2, or 3. If you win, you get 2 tokens. If you lose, you lose 1 token. You have 10 tokens to start.';
  if (status === 'response') {
    if (buttonValue?.toString() == winningButton.toString()) {
      tokenStore[userId] += 2;
      resultMessage = `You win! Your tokens: ${tokenStore[userId]}`;
    } else {
      tokenStore[userId] -= 1;
      resultMessage = `You lose. Your tokens: ${tokenStore[userId]}`;
    }
  }
  return c.res({
    image: (
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
          {resultMessage}
        </div>
      </div>
    ),
    intents: [
      <Button value="1">1</Button>,
      <Button value="2">2</Button>,
      <Button value="3">3</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});


// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
