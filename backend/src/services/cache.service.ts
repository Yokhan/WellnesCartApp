import { getRedisClient } from '../utils/redis';
import { logger } from '../utils/logger';

/**
 * Cache key TTL constants (seconds)
 */
export const CacheTTL = {
  VALUE_SCORES: 86400,     // 24 hours
  SHOPPING_LIST: 86400,    // 24 hours
  PRODUCT_SEARCH: 3600,    // 1 hour
} as const;

/**
 * Cache key helpers
 */
export const CacheKeys = {
  valueScores: (userId: string, weekStart: string) =>
    `value_scores:${userId}:${weekStart}`,
  shoppingList: (userId: string, weekStart: string) =>
    `shopping_list:${userId}:${weekStart}`,
  productSearch: (queryHash: string) =>
    `products:search:${queryHash}`,
} as const;

/**
 * Retrieve a JSON-serialised value from cache.
 * Returns null on cache miss or when Redis is unavailable.
 */
export async function getJson<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const raw = await redis.get(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    logger.warn({ err, key }, 'Cache get error');
    return null;
  }
}

/**
 * Store a value in cache as JSON with a TTL (seconds).
 * Silently no-ops when Redis is unavailable.
 */
export async function setJson(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    logger.warn({ err, key }, 'Cache set error');
  }
}

/**
 * Delete a single cache key.
 */
export async function del(key: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.del(key);
  } catch (err) {
    logger.warn({ err, key }, 'Cache del error');
  }
}

/**
 * Delete all keys matching a glob pattern.
 * Uses SCAN to avoid blocking the Redis event loop.
 */
export async function invalidatePattern(pattern: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch (err) {
    logger.warn({ err, pattern }, 'Cache invalidatePattern error');
  }
}
