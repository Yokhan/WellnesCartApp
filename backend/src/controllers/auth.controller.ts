import { Request, Response, NextFunction } from 'express';
import { authenticateTelegram } from '../services/auth.service';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * POST /api/v1/auth/telegram
 * Authenticate via Telegram WebApp initData
 */
export async function telegramAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { initData } = req.body as { initData: unknown };

    if (typeof initData !== 'string' || initData.length === 0) {
      sendError(res, 'VALIDATION_ERROR', 'initData is required', 400);
      return;
    }

    const result = await authenticateTelegram(initData);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    logger.error({ err }, 'Telegram auth error');
    if (err instanceof Error && err.message.includes('Invalid Telegram')) {
      sendError(res, 'UNAUTHORIZED', err.message, 401);
      return;
    }
    next(err);
  }
}
