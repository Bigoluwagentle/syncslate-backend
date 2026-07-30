# SyncSlate — Backend

This is Step 1 of the backend: a minimal Express server that runs and
responds. No database, no auth, no real-time yet — just proving the
server itself works, locally and (soon) when deployed.

## What's here

```
backend/
├── src/
│   └── index.js       # the whole server for now
├── .env.example        # copy to .env, no real secrets yet needed
├── .gitignore
└── package.json
```

## Run it locally

```bash
npm install
npm run dev        # auto-restarts on file changes (nodemon)
# or: npm start     # plain node, no auto-restart
```

Then check:
- http://localhost:4000/ → `{"message":"SyncSlate backend is running"}`
- http://localhost:4000/health → `{"status":"ok","timestamp":"..."}`

## What's next

- Step 2: connect MongoDB, add a test route that saves/reads data
- Step 3: real routes — auth, create/list boards
- Step 4: the real-time CRDT sync layer (Hocuspocus + Yjs)
