import { Router } from 'express';
import { walletController } from '../controllers/wallet.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const walletRoutes = Router();

walletRoutes.use(authMiddleware);
walletRoutes.get('/', walletController.getAll);
walletRoutes.get('/:id', walletController.getById);
walletRoutes.post('/', walletController.create);
walletRoutes.put('/:id', walletController.update);
walletRoutes.delete('/:id', walletController.delete);
walletRoutes.post('/transfer', walletController.transfer);
