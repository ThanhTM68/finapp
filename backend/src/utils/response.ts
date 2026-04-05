import { Response } from 'express';
import { ApiResponse } from '../types/express.d';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): void {
  const response: ApiResponse<T> = { success: true, data, message };
  res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode = 400, error?: string): void {
  const response: ApiResponse = { success: false, message, error };
  res.status(statusCode).json(response);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
