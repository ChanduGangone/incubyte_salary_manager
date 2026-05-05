import 'dotenv/config';

import http from 'node:http';

import { createApp } from './app.js';
import { closeDatabase, getDatabase } from './db/index.js';
import { getConfig } from './config.js';

const config = getConfig();
const db = getDatabase(config.databasePath);
const app = createApp({ db });
const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

function shutdown() {
  server.close(() => {
    closeDatabase(db);
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
