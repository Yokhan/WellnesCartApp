import * as Sentry from '@sentry/node';
import express, { Express } from 'express';
import { Server } from 'http';
import helmet from 'helmet';
import compression from 'compression';
import timeout from 'connect-timeout';
import xss from 'xss';
import env from './config/env';

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
}

import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { rateLimiters } from './middleware/rateLimit.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import apiRoutes from './routes';
import { closeRedisConnection } from './utils/redis';

const app: Express = express();
let httpServer: Server | null = null;

app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        connectSrc: ["'self'"],
        frameAncestors: ['https://web.telegram.org', 'https://t.me', 'https://*.telegram.org'],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  })
);
app.disable('x-powered-by');

app.use(corsMiddleware);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(timeout('30s'));

// Basic XSS sanitization for string body fields
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        (req.body as Record<string, unknown>)[key] = xss(value);
      }
    }
  }
  next();
});

// Health check: liveness
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'SmartCart API is running',
    timestamp: new Date().toISOString(),
  });
});

// Health check: readiness
app.get('/health/ready', async (_req, res) => {
  const checks: { db: boolean; redis: boolean } = { db: false, redis: false };

  try {
    const { getSupabaseAdminClient } = await import('./utils/supabase');
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from('universal_products').select('id').limit(1);
    checks.db = !error;
  } catch {
    checks.db = false;
  }

  try {
    const { getRedisClient, isRedisAvailable } = await import('./utils/redis');
    const client = getRedisClient();
    checks.redis = !!client && isRedisAvailable();
  } catch {
    checks.redis = false;
  }

  const ready = checks.db;
  res.status(ready ? 200 : 503).json({
    success: ready,
    timestamp: new Date().toISOString(),
    checks,
  });
});

// Metrics
app.get('/metrics', (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    uptime_seconds: Math.floor(process.uptime()),
    memory: {
      rss_mb: Math.round(mem.rss / 1024 / 1024),
      heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(mem.heapTotal / 1024 / 1024),
    },
    node_version: process.version,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1', rateLimiters.standard);
app.use('/api/v1', apiRoutes);

if (env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = parseInt(env.PORT, 10);

export async function gracefulShutdown(): Promise<void> {
  logger.info('Shutdown signal received, closing server...');
  await closeRedisConnection();
  if (httpServer) {
    httpServer.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
    setTimeout(() => {
      logger.warn('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  if (env.SENTRY_DSN) Sentry.captureException(err);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled rejection');
  if (env.SENTRY_DSN) Sentry.captureException(reason);
  gracefulShutdown();
});

export const startServer = async (): Promise<void> => {
  try {
    httpServer = app.listen(PORT, () => {
      logger.info({ port: PORT, env: env.NODE_ENV }, 'SmartCart server running');
    });

    httpServer.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        logger.error({ port: PORT }, 'Port already in use');
      } else {
        logger.error({ err }, 'Server error');
      }
      process.exit(1);
    });

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export default app;
