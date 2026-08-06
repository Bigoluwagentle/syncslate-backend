const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { HocuspocusProvider } = require('@hocuspocus/provider');
const WebSocket = require('ws');
const Y = require('yjs');

const API = 'http://localhost:4000';

async function main() {
  // 1. Sign up a fresh test user (random email so this can be rerun)
  const email = `test${Date.now()}@example.com`;
  const signupRes = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'test1234', name: 'Test User' }),
  });
  const { token } = await signupRes.json();
  console.log('Signed up, got token.');

  // 2. Create a board as that user
  const boardRes = await fetch(`${API}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: 'Auth Test Board' }),
  });
  const board = await boardRes.json();
  console.log('Created board:', board._id);

  // 3. Attempt to connect to /sync using that board's real ID + a valid token
  const doc = new Y.Doc();
  const provider = new HocuspocusProvider({
    url: 'ws://localhost:4000/sync',
    name: board._id,   // documentName = board's real Mongo _id
    token,              // sent to onAuthenticate as data.token
    document: doc,
    WebSocketPolyfill: WebSocket,
  });

  provider.on('synced', () => {
    console.log('SUCCESS: authenticated and synced to real board.');
    process.exit(0);
  });

  provider.on('close', (e) => {
    console.log('Connection closed:', e);
  });

  // 4. Also try connecting with a bogus token, to confirm rejection works
  setTimeout(() => {
    const badDoc = new Y.Doc();
    const badProvider = new HocuspocusProvider({
      url: 'ws://localhost:4000/sync',
      name: board._id,
      token: 'not-a-real-token',
      document: badDoc,
      WebSocketPolyfill: WebSocket,
    });
    badProvider.on('close', (e) => {
      console.log('EXPECTED: bad-token connection was rejected:', e);
    });
  }, 2000);
}

main();