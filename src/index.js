const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const TestPing = require('./models/TestPing');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`SyncSlate backend listening on port ${PORT}`);
});
