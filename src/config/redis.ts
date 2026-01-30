import Redis from 'ioredis';

const {
  REDIS_URL,
  REDIS_HOST = '127.0.0.1',
  REDIS_PORT = '6379',
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_DB = '3',
  NODE_ENV,
} = process.env;

const shouldUseUrl = Boolean(REDIS_URL);

const redis = shouldUseUrl
  ? new Redis(REDIS_URL as string)
  : new Redis({
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
      db: Number(REDIS_DB),
      lazyConnect: NODE_ENV === 'test',
    });

redis.on('error', (err) => {
  console.error('[Redis] connection error', err);
});

export { redis };
