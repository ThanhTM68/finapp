import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types/express.d';

export const categoryController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const categories = await categoryService.getAll(userId);
      sendSuccess(res, categories);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const category = await categoryService.create(userId, req.body);
      sendSuccess(res, category, 'Tạo danh mục thành công', 201);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const category = await categoryService.update(req.params['id']!, userId, req.body);
      sendSuccess(res, category);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      await categoryService.delete(req.params['id']!, userId);
      sendSuccess(res, null, 'Đã xóa danh mục');
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },
};
