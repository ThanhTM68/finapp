import { Router } from 'express';
import { syncController } from '../controllers/sync.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const syncRoutes = Router();

syncRoutes.use(authMiddleware);
syncRoutes.post('/push', syncController.push);
syncRoutes.get('/pull', syncController.pull);
