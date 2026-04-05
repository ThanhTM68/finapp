import { Request, Response } from 'express';
import { budgetService } from '../services/budget.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types/express.d';

export const budgetController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const budgets = await budgetService.getAll(userId);
      sendSuccess(res, budgets);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const budget = await budgetService.create(userId, req.body);
      sendSuccess(res, budget, 'Tạo ngân sách thành công', 201);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      await budgetService.delete(req.params['id']!, userId);
      sendSuccess(res, null, 'Đã xóa ngân sách');
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },
};
