const express = require('express');
const cors = require('cors');
require('dotenv').config();

const http = require('http');
const WebSocket = require('ws');
const hocuspocus = require('./sync/hocuspocusServer');

const connectDB = require('./db');
const TestPing = require('./models/TestPing');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');


app.use('/auth', authRoutes);
app.use('/boards', boardRoutes);

// Simple route just to prove the server is alive and reachable.
app.get('/', (req, res) => {
  res.json({ message: 'SyncSlate backend is running' });
});

// A dedicated health check route — useful once we deploy, so the
// hosting platform (and we) can quickly confirm the server is up.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test route: writes a document to MongoDB, then reads it back.
// Proves the database connection is actually working end to end.
app.get('/test-db', async (req, res) => {
  try {
    const ping = await TestPing.create({ message: 'hello from SyncSlate' });
    const all = await TestPing.find().sort({ createdAt: -1 }).limit(5);
    res.json({ justSaved: ping, recentPings: all });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;

// Create a plain HTTP server wrapping Express, instead of using app.listen()
// directly — this lets us intercept WebSocket upgrade requests below.
const httpServer = http.createServer(app);

// A WebSocket server that doesn't bind to its own port — it just handles
// upgrade requests we hand it manually.
const wss = new WebSocket.Server({ noServer: true });

httpServer.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  console.log('Upgrade request received for path:', pathname); // debug line

  // Only requests to /sync get treated as CRDT sync connections.
  // Anything else (there's nothing else yet) would fall through here.
  if (pathname === '/sync') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      hocuspocus.handleConnection(ws, request);
    });
  } else {
    socket.destroy();
  }
});

httpServer.listen(PORT, () => {
  console.log(`SyncSlate backend listening on port ${PORT}`);
  console.log(`Sync server ready at ws://localhost:${PORT}/sync`);
});
