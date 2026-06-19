import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL?.trim() || 'redis://127.0.0.1:6379';
let redisUnavailable = false;

const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: () => false,
  },
});

let connectPromise = null;

const getRedisClient = async () => {
  if (redisUnavailable) {
    return null;
  }

  if (redisClient.isOpen) {
    return redisClient;
  }

  if (!connectPromise) {
    connectPromise = redisClient.connect().catch(error => {
      connectPromise = null;
      redisUnavailable = true;
      throw error;
    });
  }

  try {
    await connectPromise;
    return redisClient;
  } catch (error) {
    return null;
  }
};

const disconnectRedis = async () => {
  if (redisClient?.isOpen) {
    await redisClient.quit();
  }
};

export { getRedisClient, disconnectRedis };
