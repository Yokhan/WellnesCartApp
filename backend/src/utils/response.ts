import { Response } from 'express';

export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
}

export interface ApiError {
  success: false;
  error: { code: string; message: string };
}

export function sendSuccess<T>(res: Response, data?: T, status = 200): void {
  res.status(status).json({ success: true, ...(data !== undefined && { data }) });
}

export function sendError(res: Response, code: string, message: string, status = 400): void {
  res.status(status).json({ success: false, error: { code, message } });
}
