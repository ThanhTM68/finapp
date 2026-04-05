import { Request, Response } from 'express';
import { syncService } from '../services/sync.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types/express.d';

export const syncController = {
  async push(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const result = await syncService.push(userId, req.body);
      sendSuccess(res, result);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async pull(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user!.id;
      const since = req.query['since'] as string | undefined;
      const changes = await syncService.pull(userId, since);
      sendSuccess(res, changes);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },
};
