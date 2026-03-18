import jwt from 'jsonwebtoken';
import env from '../config/env';

export interface JWTPayload {
  userId: string;
  telegramId?: string;
  role?: 'user' | 'admin' | 'trainer';
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

function verifyWithFallback(
  token: string,
  currentSecret: string,
  previousSecret: string | undefined,
  label: string
): JWTPayload {
  try {
    return jwt.verify(token, currentSecret) as JWTPayload;
  } catch (error) {
    if (
      previousSecret &&
      error instanceof jwt.JsonWebTokenError &&
      !(error instanceof jwt.TokenExpiredError)
    ) {
      try {
        return jwt.verify(token, previousSecret) as JWTPayload;
      } catch {
        // Fall through
      }
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(`${label} expired`);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Invalid ${label.toLowerCase()}`);
    }
    throw error;
  }
}

export function verifyToken(token: string): JWTPayload {
  return verifyWithFallback(token, env.JWT_SECRET, env.JWT_SECRET_PREVIOUS, 'Token');
}

export function verifyRefreshToken(token: string): JWTPayload {
  return verifyWithFallback(
    token,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_SECRET_PREVIOUS,
    'Refresh token'
  );
}

export function generateTokenPair(payload: JWTPayload): {
  token: string;
  refreshToken: string;
} {
  return {
    token: signToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}
