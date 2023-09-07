/* eslint-disable import/first */
import { createServer } from 'node:http';
import dotenv from 'dotenv';

dotenv.config();
import app from './app.js';
import cacheService from './services/redis.js';

const server = createServer(app);
const PORT = process.env.PORT || 8000;

async function startServer() {
  await cacheService.connect();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
