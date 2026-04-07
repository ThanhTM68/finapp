import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authRateLimitMiddleware } from '../middlewares/rateLimit.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRoutes = Router();

authRoutes.post('/register', authRateLimitMiddleware, authController.register);
authRoutes.post('/login', authRateLimitMiddleware, authController.login);
authRoutes.post('/refresh', authRateLimitMiddleware, authController.refresh);
authRoutes.post('/logout', authMiddleware, authController.logout);
authRoutes.post('/reset-password', authRateLimitMiddleware, authController.resetPassword);
authRoutes.get('/profile', authMiddleware, authController.getProfile);
