import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Connected to Redis...'));

async function connect() {
  await client.connect();
}

async function getRedisClient() {
  if (!client) await connect();
  return client;
}

async function get(key) {
  const rateData = await (await getRedisClient()).get(key);
  return rateData || null;
}

async function set(key, value) {
  await (await getRedisClient()).set(
    key,
    value,
    { EX: 60 * 60 * process.env.RATE_CACHE_TTL_HOURS },
  );
}

export default { connect, get, set };
