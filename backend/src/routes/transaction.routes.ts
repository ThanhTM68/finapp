import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const transactionRoutes = Router();

transactionRoutes.use(authMiddleware);
transactionRoutes.get('/', transactionController.getAll);
transactionRoutes.get('/:id', transactionController.getById);
transactionRoutes.post('/', transactionController.create);
transactionRoutes.put('/:id', transactionController.update);
transactionRoutes.delete('/:id', transactionController.delete);
