import { Router } from 'express';
import { telegramAuth } from '../controllers/auth.controller';
import { rateLimiters } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { telegramAuthSchema } from '../middleware/schemas/auth.schemas';

const router = Router();

/**
 * POST /api/v1/auth/telegram
 * Authenticate via Telegram WebApp initData
 */
router.post(
  '/telegram',
  rateLimiters.auth,
  validate(telegramAuthSchema, 'body'),
  telegramAuth
);

export default router;
