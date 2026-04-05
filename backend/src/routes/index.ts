import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { walletRoutes } from './wallet.routes';
import { transactionRoutes } from './transaction.routes';
import { categoryRoutes } from './category.routes';
import { budgetRoutes } from './budget.routes';
import { syncRoutes } from './sync.routes';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/wallets', walletRoutes);
routes.use('/transactions', transactionRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/budgets', budgetRoutes);
routes.use('/sync', syncRoutes);
