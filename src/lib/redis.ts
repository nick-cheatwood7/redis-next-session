import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(process.env.REDIS_URL || '', { enableAutoPipelining: true });

if (process.env.NODE_ENV === 'development') globalForRedis.redis = redis;
