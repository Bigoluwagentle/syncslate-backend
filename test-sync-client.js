const { HocuspocusProvider } = require('@hocuspocus/provider');
const WebSocket = require('ws');
const Y = require('yjs');

// --- Simulated Client 1 ---
const doc1 = new Y.Doc();
const provider1 = new HocuspocusProvider({
  url: 'ws://localhost:4000/sync',
  name: 'test-room',       // both clients must use the same room name
  document: doc1,
  WebSocketPolyfill: WebSocket, // Node has no built-in WebSocket, so we supply one
});

// --- Simulated Client 2 ---
const doc2 = new Y.Doc();
const provider2 = new HocuspocusProvider({
  url: 'ws://localhost:4000/sync',
  name: 'test-room',
  document: doc2,
  WebSocketPolyfill: WebSocket,
});

// After 1 second, Client 1 "draws a shape" by writing to its shared map.
setTimeout(() => {
  console.log('Client 1 adding a shape...');
  doc1.getMap('shapes').set('shape1', { x: 10, y: 20, color: 'blue' });
}, 2000);

setTimeout(() => {
  console.log('Client 2 sees:', doc2.getMap('shapes').toJSON());
  process.exit(0);
}, 4000);