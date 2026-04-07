import { Wallet, WalletType } from '../models/wallet.model';
import { generateId } from '../utils/response';
import { query, queryOne } from '../db/client';
import { recordSyncEvent } from './sync.service';

interface WalletRow {
  id: string;
  user_id: string;
  name: string;
  type: WalletType;
  balance: number;
  color: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

function mapWallet(row: WalletRow): Wallet {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type,
    balance: row.balance,
    color: row.color,
    isDeleted: row.is_deleted,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const walletService = {
  async getAll(userId: string): Promise<Wallet[]> {
    const rows = await query<WalletRow>(
      'SELECT * FROM wallets WHERE user_id = $1 AND is_deleted = FALSE ORDER BY created_at DESC',
      [userId],
    );
    return rows.map(mapWallet);
  },

  async getById(id: string, userId: string): Promise<Wallet | undefined> {
    const row = await queryOne<WalletRow>('SELECT * FROM wallets WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE', [id, userId]);
    return row ? mapWallet(row) : undefined;
  },

  async create(userId: string, payload: { name: string; type: WalletType; balance: number; color: string }): Promise<Wallet> {
    const row = await queryOne<WalletRow>(
      `INSERT INTO wallets (id, user_id, name, type, balance, color)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [generateId(), userId, payload.name, payload.type, payload.balance ?? 0, payload.color ?? '#16a34a'],
    );

    if (!row) throw new Error('Không thể tạo ví');
    const wallet = mapWallet(row);
    await recordSyncEvent(userId, 'wallets', 'INSERT', wallet as unknown as Record<string, unknown>);
    return wallet;
  },

  async update(id: string, userId: string, payload: Partial<Wallet>): Promise<Wallet> {
    const row = await queryOne<WalletRow>(
      `UPDATE wallets
       SET name = COALESCE($3, name),
           type = COALESCE($4, type),
           balance = COALESCE($5, balance),
           color = COALESCE($6, color),
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
       RETURNING *`,
      [id, userId, payload.name ?? null, payload.type ?? null, payload.balance ?? null, payload.color ?? null],
    );

    if (!row) throw new Error('Không tìm thấy ví');
    const wallet = mapWallet(row);
    await recordSyncEvent(userId, 'wallets', 'UPDATE', wallet as unknown as Record<string, unknown>);
    return wallet;
  },

  async delete(id: string, userId: string): Promise<void> {
    const row = await queryOne<WalletRow>(
      `UPDATE wallets SET is_deleted = TRUE, updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
       RETURNING *`,
      [id, userId],
    );
    if (!row) throw new Error('Không tìm thấy ví');
    await recordSyncEvent(userId, 'wallets', 'DELETE', { id });
  },

  async transfer(userId: string, fromId: string, toId: string, amount: number, _note?: string): Promise<void> {
    const from = await walletService.getById(fromId, userId);
    const to = await walletService.getById(toId, userId);
    if (!from || !to) throw new Error('Ví không tồn tại');
    if (from.balance < amount) throw new Error('Số dư không đủ');

    await query('UPDATE wallets SET balance = balance - $1, updated_at = NOW() WHERE id = $2', [amount, fromId]);
    await query('UPDATE wallets SET balance = balance + $1, updated_at = NOW() WHERE id = $2', [amount, toId]);
    await recordSyncEvent(userId, 'wallets', 'UPDATE', { id: fromId });
    await recordSyncEvent(userId, 'wallets', 'UPDATE', { id: toId });
  },
};
