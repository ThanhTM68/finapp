import { getDatabase } from '../sqlite';
import { Wallet } from '../../../domain/wallet/wallet.types';

interface WalletRow {
  id: string;
  name: string;
  type: Wallet['type'];
  balance: number;
  color: string;
  is_deleted: number;
  sync_status: Wallet['syncStatus'];
  created_at: string;
  updated_at: string;
}

function mapWallet(row: WalletRow): Wallet {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    balance: row.balance,
    color: row.color,
    isDeleted: row.is_deleted === 1,
    syncStatus: row.sync_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const walletDao = {
  async findAll(): Promise<Wallet[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<WalletRow>(
      'SELECT * FROM wallets WHERE is_deleted = 0 ORDER BY created_at DESC',
    );
    return rows.map(mapWallet);
  },

  async findById(id: string): Promise<Wallet | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<WalletRow>('SELECT * FROM wallets WHERE id = ?', [id]);
    return row ? mapWallet(row) : null;
  },

  async insert(wallet: Wallet): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO wallets (id, name, type, balance, color, is_deleted, sync_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 0, 'pending', ?, ?)`,
      [wallet.id, wallet.name, wallet.type, wallet.balance, wallet.color, wallet.createdAt, wallet.updatedAt],
    );
  },

  async update(wallet: Partial<Wallet> & { id: string }): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE wallets SET name = ?, balance = ?, color = ?, updated_at = ?, sync_status = 'pending'
       WHERE id = ?`,
      [wallet.name ?? '', wallet.balance ?? 0, wallet.color ?? '', wallet.updatedAt ?? new Date().toISOString(), wallet.id],
    );
  },

  async updateBalance(id: string, balance: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE wallets SET balance = ?, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
      [balance, new Date().toISOString(), id],
    );
  },

  async softDelete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE wallets SET is_deleted = 1, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
      [new Date().toISOString(), id],
    );
  },
};
