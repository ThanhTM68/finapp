import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { generateId } from '../utils/response';
import { User } from '../models/user.model';
import { query, queryOne } from '../db/client';

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    avatarUrl: row.avatar_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parseRefreshExpiry(): Date {
  const raw = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
  const match = raw.match(/^(\d+)([dhm])$/i);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multiplier = unit === 'd' ? 24 * 60 * 60 * 1000 : unit === 'h' ? 60 * 60 * 1000 : 60 * 1000;
  return new Date(Date.now() + value * multiplier);
}

async function issueTokens(user: Pick<User, 'id' | 'email'>): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = { id: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await query(
    `INSERT INTO refresh_tokens (id, user_id, token, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [generateId(), user.id, refreshToken, parseRefreshExpiry()],
  );

  return { accessToken, refreshToken };
}

export const authService = {
  async register(payload: { name: string; email: string; password: string }) {
    const existing = await queryOne<UserRow>('SELECT * FROM users WHERE email = $1', [payload.email]);
    if (existing) throw new Error('Email đã được sử dụng');

    const passwordHash = await hashPassword(payload.password);
    const row = await queryOne<UserRow>(
      `INSERT INTO users (id, name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [generateId(), payload.name, payload.email, passwordHash],
    );

    if (!row) throw new Error('Không thể tạo tài khoản');
    const user = mapUser(row);
    const tokens = await issueTokens(user);

    return {
      tokens,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    };
  },

  async login(payload: { email: string; password: string }) {
    const row = await queryOne<UserRow>('SELECT * FROM users WHERE email = $1', [payload.email]);
    if (!row) throw new Error('Email hoặc mật khẩu không đúng');

    const user = mapUser(row);
    const valid = await comparePassword(payload.password, user.passwordHash);
    if (!valid) throw new Error('Email hoặc mật khẩu không đúng');

    const tokens = await issueTokens(user);
    return {
      tokens,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    };
  },

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const tokenRow = await queryOne<{ id: string; revoked_at: Date | null; expires_at: Date }>(
      `SELECT id, revoked_at, expires_at FROM refresh_tokens WHERE token = $1`,
      [refreshToken],
    );

    if (!tokenRow || tokenRow.revoked_at || tokenRow.expires_at.getTime() <= Date.now()) {
      throw new Error('Refresh token không hợp lệ');
    }

    await query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1', [tokenRow.id]);
    return issueTokens({ id: payload.id, email: payload.email });
  },

  async logout(refreshToken?: string) {
    if (!refreshToken) return;
    await query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token = $1 AND revoked_at IS NULL',
      [refreshToken],
    );
  },

  async getProfile(userId: string) {
    const row = await queryOne<UserRow>('SELECT * FROM users WHERE id = $1', [userId]);
    if (!row) throw new Error('Không tìm thấy người dùng');
    const user = mapUser(row);
    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
  },

  async resetPassword(email: string) {
    const row = await queryOne<{ id: string }>('SELECT id FROM users WHERE email = $1', [email]);
    if (!row) return;
  },
};
