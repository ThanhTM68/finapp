import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const categoryRoutes = Router();

categoryRoutes.use(authMiddleware);
categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.post('/', categoryController.create);
categoryRoutes.put('/:id', categoryController.update);
categoryRoutes.delete('/:id', categoryController.delete);
