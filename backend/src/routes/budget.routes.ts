import { Router } from 'express';
import { budgetController } from '../controllers/budget.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const budgetRoutes = Router();

budgetRoutes.use(authMiddleware);
budgetRoutes.get('/', budgetController.getAll);
budgetRoutes.post('/', budgetController.create);
budgetRoutes.delete('/:id', budgetController.delete);
