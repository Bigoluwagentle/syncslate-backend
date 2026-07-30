const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`SyncSlate backend listening on port ${PORT}`);
});
