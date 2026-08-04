const { Hocuspocus } = require('@hocuspocus/server');

// This is the CRDT sync server. Right now it just holds documents in
// memory — anyone connected to the same "document name" sees the same
// shared state. MongoDB persistence gets added in the next step.
const hocuspocus = new Hocuspocus({
  onConnect: async (data) => {
    console.log(`Client connected to document: ${data.documentName}`);
  },
  onDisconnect: async (data) => {
    console.log(`Client disconnected from document: ${data.documentName}`);
  },
});

module.exports = hocuspocus;