import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3001'),
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    REDIS_URL: z.string().url().optional(),
    JWT_SECRET: z.string().min(32),
    JWT_SECRET_PREVIOUS: z.string().min(32).optional(),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET_PREVIOUS: z.string().min(32).optional(),
    JWT_EXPIRES_IN: z.string().default('10m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    LP_SOLVER_URL: z.string().url().default('http://lp-solver:8000'),
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    TELEGRAM_BOT_USERNAME: z.string().optional(),
    TELEGRAM_BOT_BACKEND_SECRET: z.string().min(16).optional(),
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    ALLOWED_ORIGINS: z.string().optional(),
    SENTRY_DSN: z.string().url().optional(),
  })
  .refine(
    (data) => {
      if (data.NODE_ENV !== 'production') return true;
      return !!data.SUPABASE_SERVICE_ROLE_KEY && !!data.REDIS_URL;
    },
    {
      message: 'In production, SUPABASE_SERVICE_ROLE_KEY and REDIS_URL are required',
      path: ['NODE_ENV'],
    }
  );

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    process.stderr.write('Invalid environment variables:\n');
    error.errors.forEach((err) => {
      process.stderr.write(`  - ${err.path.join('.')}: ${err.message}\n`);
    });
    process.exit(1);
  }
  throw error;
}

export default env;
