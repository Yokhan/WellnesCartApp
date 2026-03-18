import Redis from 'ioredis';
import env from '../config/env';
import { logger } from './logger';

let redisClient: Redis | null = null;
let redisAvailable = false;

export const getRedisClient = (): Redis | null => {
  if (redisClient && !redisAvailable) {
    return null;
  }

  if (!redisClient) {
    const redisUrl = env.REDIS_URL;

    if (!redisUrl) {
      logger.info('Redis not configured (REDIS_URL not set). Running without cache.');
      return null;
    }

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 3) {
          redisAvailable = false;
          logger.warn('Redis connection failed after multiple attempts. Running without cache.');
          return null;
        }
        return Math.min(times * 50, 1000);
      },
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    redisClient.on('error', (_err) => {
      if (redisAvailable) {
        logger.warn('Redis connection error. Running without cache.');
        redisAvailable = false;
      }
    });

    redisClient.on('connect', () => {
      redisAvailable = true;
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      redisAvailable = true;
      logger.info('Redis client ready');
    });

    redisClient.on('close', () => {
      redisAvailable = false;
    });

    redisClient.connect().catch(() => {
      redisAvailable = false;
    });
  }

  return redisAvailable ? redisClient : null;
};

export const isRedisAvailable = (): boolean => redisAvailable;

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch {
      // Ignore errors on close
    }
    redisClient = null;
    redisAvailable = false;
  }
};
