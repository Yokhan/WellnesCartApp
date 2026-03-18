import cors from 'cors';
import { Request } from 'express';
import env from '../config/env';
import { logger } from '../utils/logger';

const baseOrigins = [
  env.FRONTEND_URL,
  'https://web.telegram.org',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
];

const extraOrigins = env.ALLOWED_ORIGINS
  ? env.ALLOWED_ORIGINS.split(',')
      .map((o) => o.trim())
      .filter(Boolean)
  : [];

const allowedOrigins = [...baseOrigins, ...extraOrigins];

export const corsMiddleware = cors((req: Request, cb) => {
  const path = req.path ?? '';
  const isHealthRoute = path === '/health' || path.startsWith('/health/');
  const isProduction = env.NODE_ENV === 'production';

  cb(null, {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!origin) {
        if (isProduction && !isHealthRoute) {
          logger.warn({ path }, 'Rejected request with no Origin in production');
          return callback(new Error('Origin required for API requests'));
        }
        return callback(null, true);
      }

      if (env.NODE_ENV === 'development') {
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true);
        }
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn({ origin, path }, 'Blocked by CORS');
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
});
