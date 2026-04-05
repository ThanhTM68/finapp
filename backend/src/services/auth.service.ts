import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { generateId } from '../utils/response';
import { User } from '../models/user.model';

// In-memory store placeholder – replace with real DB
const users: User[] = [];

export const authService = {
  async register(payload: { name: string; email: string; password: string }) {
    const existing = users.find((u) => u.email === payload.email);
    if (existing) throw new Error('Email đã được sử dụng');

    const passwordHash = await hashPassword(payload.password);
    const now = new Date();
    const user: User = {
      id: generateId(),
      name: payload.name,
      email: payload.email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };
    users.push(user);

    const tokenPayload = { id: user.id, email: user.email };
    return {
      tokens: {
        accessToken: signAccessToken(tokenPayload),
        refreshToken: signRefreshToken(tokenPayload),
      },
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    };
  },

  async login(payload: { email: string; password: string }) {
    const user = users.find((u) => u.email === payload.email);
    if (!user) throw new Error('Email hoặc mật khẩu không đúng');

    const valid = await comparePassword(payload.password, user.passwordHash);
    if (!valid) throw new Error('Email hoặc mật khẩu không đúng');

    const tokenPayload = { id: user.id, email: user.email };
    return {
      tokens: {
        accessToken: signAccessToken(tokenPayload),
        refreshToken: signRefreshToken(tokenPayload),
      },
      user: { id: user.id, name: user.name, email: user.email },
    };
  },

  async getProfile(userId: string) {
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('Không tìm thấy người dùng');
    return { id: user.id, name: user.name, email: user.email };
  },

  async resetPassword(email: string) {
    const user = users.find((u) => u.email === email);
    if (!user) return; // Don't expose whether email exists
    // TODO: send reset password email
  },
};
