const { HocuspocusProvider } = require('@hocuspocus/provider');
const WebSocket = require('ws');
const Y = require('yjs');

const doc = new Y.Doc();
const provider = new HocuspocusProvider({
  url: 'ws://localhost:4000/sync',
  name: 'persistence-test',
  document: doc,
  WebSocketPolyfill: WebSocket,
});

provider.on('synced', () => {
  console.log('Connected. Writing a shape...');
  doc.getMap('shapes').set('shapeA', { x: 5, y: 5, color: 'red' });

  // Wait past the 2s debounce so we know onStoreDocument has fired
  // before we exit.
  setTimeout(() => {
    console.log('Done — check server terminal for "Saved state" log.');
    process.exit(0);
  }, 3000);
});