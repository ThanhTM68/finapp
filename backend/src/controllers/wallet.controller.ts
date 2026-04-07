import { Request, Response } from 'express';
import { walletService } from '../services/wallet.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types/express.d';

export const walletController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const wallets = await walletService.getAll(userId);
      sendSuccess(res, wallets);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const wallet = await walletService.getById(req.params['id']!, userId);
      if (!wallet) { sendError(res, 'Không tìm thấy ví', 404); return; }
      sendSuccess(res, wallet);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const wallet = await walletService.create(userId, req.body);
      sendSuccess(res, wallet, 'Tạo ví thành công', 201);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const wallet = await walletService.update(req.params['id']!, userId, req.body);
      sendSuccess(res, wallet);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      await walletService.delete(req.params['id']!, userId);
      sendSuccess(res, null, 'Đã xóa ví');
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async transfer(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const { fromId, toId, amount } = req.body as { fromId: string; toId: string; amount: number };
      await walletService.transfer(userId, fromId, toId, amount);
      sendSuccess(res, null, 'Chuyển tiền thành công');
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },
};
