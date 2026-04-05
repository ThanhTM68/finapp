import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { sendError } from '../utils/response';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error('Unhandled error', err.message, err.stack);
  sendError(res, err.message || 'Internal server error', 500);
}
