const { Hocuspocus } = require('@hocuspocus/server');
const Y = require('yjs');
const DocState = require('../models/DocState');
const jwt = require('jsonwebtoken');
const Board = require('../models/Board');

const hocuspocus = new Hocuspocus({
  // Don't save to MongoDB on every single keystroke — batch changes.
  // Wait 2s after the last edit before saving, but never wait longer
  // than 10s even if edits keep coming in constantly.
  debounce: 2000,
  maxDebounce: 10000,

  onConnect: async (data) => {
    console.log(`Client connected to document: ${data.documentName}`);
  },
  onDisconnect: async (data) => {
    console.log(`Client disconnected from document: ${data.documentName}`);
  },

  // Fires once, the moment the FIRST client connects to a document
  // that isn't already sitting in memory. We check MongoDB for saved
  // state and, if found, apply it to the fresh in-memory Y.Doc.
  onLoadDocument: async (data) => {
    const saved = await DocState.findOne({ documentName: data.documentName });
    if (saved) {
      Y.applyUpdate(data.document, saved.state);
      console.log(`Loaded saved state for document: ${data.documentName}`);
    } else {
      console.log(`No saved state found for document: ${data.documentName} (new document)`);
    }
    return data.document;
  },

  onAuthenticate: async (data) => {
    const { token, documentName } = data;

    if (!token) {
      throw new Error('No token provided');
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }

    // documentName IS the board's MongoDB _id — that's the convention
    // we're establishing: one Yjs document per board, named after it.
    const board = await Board.findOne({ _id: documentName, owner: payload.userId });

    if (!board) {
      throw new Error('Board not found or access denied');
    }

    // Whatever we return here gets attached to this connection as
    // `data.context` in every other hook — useful later (e.g. showing
    // WHO is connected, for cursor presence).
    return { userId: payload.userId };
  },

  // Fires after edits settle, per the debounce settings above.
  // Encodes the ENTIRE current document state and upserts it —
  // Yjs updates are designed to be re-encoded as one snapshot like this.
  onStoreDocument: async (data) => {
    const state = Buffer.from(Y.encodeStateAsUpdate(data.document));
    await DocState.updateOne(
      { documentName: data.documentName },
      { state },
      { upsert: true }
    );
    console.log(`Saved state for document: ${data.documentName}`);
  },
});

module.exports = hocuspocus;