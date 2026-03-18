import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { JWTPayload } from '../utils/jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'UNAUTHORIZED', 'No token provided', 401);
      return;
    }

    const token = authHeader.substring(7);

    try {
      const payload = verifyToken(token);
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('expired')) {
          sendError(res, 'UNAUTHORIZED', 'Token expired', 401);
          return;
        }
        if (error.message.toLowerCase().includes('invalid')) {
          sendError(res, 'UNAUTHORIZED', 'Invalid token', 401);
          return;
        }
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        req.user = verifyToken(token);
      } catch {
        // Ignore errors — optional auth
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
