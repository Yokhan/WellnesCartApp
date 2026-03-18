import { Request, Response, NextFunction } from 'express';
import env from '../config/env';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError & { timeout?: boolean },
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.timeout ? 503 : err.statusCode ?? 500;
  const message = err.message || 'Internal Server Error';
  const isDevelopment = env.NODE_ENV !== 'production';

  if (isDevelopment) {
    logger.error({ err, path: req.path, method: req.method }, 'Request error');
  } else {
    logger.error({ message: err.message, statusCode, path: req.path }, 'Request error');
  }

  sendError(res, err.code ?? 'INTERNAL_ERROR', message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`, 404);
};

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
