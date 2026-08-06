const { HocuspocusProvider } = require('@hocuspocus/provider');
const WebSocket = require('ws');
const Y = require('yjs');

const doc = new Y.Doc();
const provider = new HocuspocusProvider({
  url: 'ws://localhost:4000/sync',
  name: 'persistence-test', // same room name as test-save.js
  document: doc,
  WebSocketPolyfill: WebSocket,
});

provider.on('synced', () => {
  console.log('Synced. Document contains:', doc.getMap('shapes').toJSON());
  process.exit(0);
});