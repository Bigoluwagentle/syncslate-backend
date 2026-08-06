const { HocuspocusProvider } = require('@hocuspocus/provider');
const WebSocket = require('ws');
const Y = require('yjs');

const doc1 = new Y.Doc();
const provider1 = new HocuspocusProvider({
  url: 'ws://localhost:4000/sync',
  name: 'test-room',
  document: doc1,
  WebSocketPolyfill: WebSocket,
});
provider1.on('status', (e) => console.log('Client 1 status:', e.status));
provider1.on('close', (e) => console.log('Client 1 closed:', e));
provider1.on('synced', () => console.log('Client 1 synced'));

const doc2 = new Y.Doc();
const provider2 = new HocuspocusProvider({
  url: 'ws://localhost:4000/sync',
  name: 'test-room',
  document: doc2,
  WebSocketPolyfill: WebSocket,
});
provider2.on('status', (e) => console.log('Client 2 status:', e.status));
provider2.on('close', (e) => console.log('Client 2 closed:', e));
provider2.on('synced', () => console.log('Client 2 synced'));

setTimeout(() => {
  console.log('Client 1 adding a shape...');
  doc1.getMap('shapes').set('shape1', { x: 10, y: 20, color: 'blue' });
}, 2000);

setTimeout(() => {
  console.log('Client 2 sees:', doc2.getMap('shapes').toJSON());
  process.exit(0);
}, 4000);