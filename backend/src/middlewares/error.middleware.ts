import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { config } from '../config/env';
import { sendError } from '../utils/response';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (config.isDev) {
    logger.error('Unhandled error', err.message, err.stack);
  } else {
    logger.error('Unhandled error', err.message);
  }
  sendError(res, err.message || 'Internal server error', 500);
}
