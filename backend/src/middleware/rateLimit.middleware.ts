import { Request, Response, NextFunction } from 'express';
import { getRedisClient, isRedisAvailable } from '../utils/redis';
import env from '../config/env';
import { sendError } from '../utils/response';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function cleanupMemoryStore(): void {
  const now = Date.now();
  for (const [k, v] of memoryStore.entries()) {
    if (v.resetAt < now) memoryStore.delete(k);
  }
}

function memoryRateLimit(
  key: string,
  windowMs: number
): { current: number; resetAt: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    if (memoryStore.size > 10000) cleanupMemoryStore();
    return { current: 1, resetAt };
  }
  entry.count += 1;
  return { current: entry.count, resetAt: entry.resetAt };
}

export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    keyGenerator = (req) => req.ip ?? req.socket.remoteAddress ?? 'unknown',
    message = 'Too many requests, please try again later.',
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const redis = getRedisClient();
    const useRedis = redis && isRedisAvailable();

    try {
      let current: number;
      let resetAt: number;

      if (useRedis) {
        const key = `rate_limit:${keyGenerator(req)}`;
        const incr = await redis.incr(key);
        if (incr === 1) {
          await redis.expire(key, Math.ceil(windowMs / 1000));
        }
        current = incr;
        resetAt = Date.now() + windowMs;
      } else {
        const result = memoryRateLimit(`rate_limit:${keyGenerator(req)}`, windowMs);
        current = result.current;
        resetAt = result.resetAt;
      }

      if (current > max) {
        res.setHeader('Retry-After', Math.ceil(windowMs / 1000).toString());
        sendError(res, 'RATE_LIMIT_EXCEEDED', message, 429);
        return;
      }

      res.setHeader('X-RateLimit-Limit', max.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - current).toString());
      res.setHeader('X-RateLimit-Reset', new Date(resetAt).toISOString());
      next();
    } catch {
      const { current, resetAt } = memoryRateLimit(
        `rate_limit:${keyGenerator(req)}`,
        windowMs
      );
      if (current > max) {
        res.setHeader('Retry-After', Math.ceil(windowMs / 1000).toString());
        sendError(res, 'RATE_LIMIT_EXCEEDED', message, 429);
        return;
      }
      res.setHeader('X-RateLimit-Limit', max.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - current).toString());
      res.setHeader('X-RateLimit-Reset', new Date(resetAt).toISOString());
      next();
    }
  };
}

export const rateLimiters = {
  strict: rateLimit({
    windowMs: 60 * 1000,
    max: env.NODE_ENV === 'development' ? 50 : 10,
    message: 'Too many requests. Please slow down.',
  }),
  standard: rateLimit({
    windowMs: 60 * 1000,
    max: env.NODE_ENV === 'development' ? 500 : 100,
  }),
  auth: rateLimit({
    windowMs: 60 * 1000,
    max: env.NODE_ENV === 'development' ? 50 : 20,
    message: 'Too many authentication attempts. Please try again later.',
  }),
};
