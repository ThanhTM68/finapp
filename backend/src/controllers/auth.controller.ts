import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body as { name: string; email: string; password: string };
      const result = await authService.register({ name, email, password });
      sendSuccess(res, result, 'Đăng ký thành công', 201);
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const result = await authService.login({ email, password });
      sendSuccess(res, result, 'Đăng nhập thành công');
    } catch (err) {
      sendError(res, (err as Error).message, 401);
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as { refreshToken?: string };
    await authService.logout(refreshToken);
    sendSuccess(res, null, 'Đã đăng xuất');
  },

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body as { refreshToken: string };
      const tokens = await authService.refresh(refreshToken);
      sendSuccess(res, tokens, 'Làm mới token thành công');
    } catch (err) {
      sendError(res, (err as Error).message, 401);
    }
  },

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as { user?: { id: string } }).user?.id ?? '';
      const user = await authService.getProfile(userId);
      sendSuccess(res, user);
    } catch (err) {
      sendError(res, (err as Error).message, 404);
    }
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body as { email: string };
      await authService.resetPassword(email);
      sendSuccess(res, null, 'Email đặt lại mật khẩu đã được gửi');
    } catch (err) {
      sendError(res, (err as Error).message);
    }
  },
};
