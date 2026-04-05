import { Request, Response } from 'express';
import { transactionService } from '../services/transaction.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types/express.d';

export const transactionController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const transactions = await transactionService.getAll(userId, req.query);
      sendSuccess(res, transactions);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const tx = await transactionService.getById(req.params['id']!, userId);
      if (!tx) { sendError(res, 'Không tìm thấy giao dịch', 404); return; }
      sendSuccess(res, tx);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const tx = await transactionService.create(userId, req.body);
      sendSuccess(res, tx, 'Tạo giao dịch thành công', 201);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const tx = await transactionService.update(req.params['id']!, userId, req.body);
      sendSuccess(res, tx);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      await transactionService.delete(req.params['id']!, userId);
      sendSuccess(res, null, 'Đã xóa giao dịch');
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },
};
