import { getDb } from '../db/client';
import { Transaction, Wallet } from '../types';
import { generateId, nowIso } from './utils';
import { enqueueSyncItem } from './syncService';

/**
 * Atomically adds a transaction and updates the wallet balance.
 * All writes happen inside a single SQLite transaction.
 */
export function addTransaction(
  data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
): Transaction {
  const db = getDb();
  const id = generateId();
  const now = nowIso();

  const transaction: Transaction = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  db.withTransactionSync(() => {
    db.runSync(
      `INSERT INTO transactions
         (id, type, amount, note, date, wallet_id, category_id, to_wallet_id, transfer_id,
          created_at, updated_at, is_deleted, version)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
      [
        transaction.id,
        transaction.type,
        transaction.amount,
        transaction.note ?? null,
        transaction.date,
        transaction.walletId,
        transaction.categoryId ?? null,
        transaction.toWalletId ?? null,
        transaction.transferId ?? null,
        transaction.createdAt,
        transaction.updatedAt,
      ],
    );

    // Update wallet balance
    const delta = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    db.runSync(
      'UPDATE wallets SET balance = balance + ?, updated_at = ? WHERE id = ?',
      [delta, now, transaction.walletId],
    );

    enqueueSyncItem(db, 'transaction', id, 'create', transaction);
  });

  return transaction;
}

/**
 * Transfers money between two wallets atomically.
 * Creates two linked transactions (transfer_out + transfer_in) with a shared transfer_id.
 */
export function transferBetweenWallets(
  fromWalletId: string,
  toWalletId: string,
  amount: number,
  note: string | undefined,
  date: string,
): { out: Transaction; in: Transaction } {
  const db = getDb();
  const transferId = generateId();
  const outId = generateId();
  const inId = generateId();
  const now = nowIso();

  const outTx: Transaction = {
    id: outId,
    type: 'transfer',
    amount,
    note,
    date,
    walletId: fromWalletId,
    toWalletId,
    transferId,
    createdAt: now,
    updatedAt: now,
  };

  const inTx: Transaction = {
    id: inId,
    type: 'transfer',
    amount,
    note,
    date,
    walletId: toWalletId,
    toWalletId: fromWalletId,
    transferId,
    createdAt: now,
    updatedAt: now,
  };

  db.withTransactionSync(() => {
    const insertSql = `INSERT INTO transactions
      (id, type, amount, note, date, wallet_id, to_wallet_id, transfer_id,
       created_at, updated_at, is_deleted, version)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`;

    db.runSync(insertSql, [
      outTx.id, outTx.type, outTx.amount, outTx.note ?? null,
      outTx.date, outTx.walletId, outTx.toWalletId ?? null, outTx.transferId ?? null,
      outTx.createdAt, outTx.updatedAt,
    ]);

    db.runSync(insertSql, [
      inTx.id, inTx.type, inTx.amount, inTx.note ?? null,
      inTx.date, inTx.walletId, inTx.toWalletId ?? null, inTx.transferId ?? null,
      inTx.createdAt, inTx.updatedAt,
    ]);

    // Debit from-wallet, credit to-wallet
    db.runSync(
      'UPDATE wallets SET balance = balance - ?, updated_at = ? WHERE id = ?',
      [amount, now, fromWalletId],
    );
    db.runSync(
      'UPDATE wallets SET balance = balance + ?, updated_at = ? WHERE id = ?',
      [amount, now, toWalletId],
    );

    enqueueSyncItem(db, 'transaction', outId, 'create', outTx);
    enqueueSyncItem(db, 'transaction', inId, 'create', inTx);
  });

  return { out: outTx, in: inTx };
}

export function getTransactions(
  opts: {
    walletId?: string;
    limit?: number;
    offset?: number;
    dateFrom?: string;
    dateTo?: string;
  } = {},
): Transaction[] {
  const db = getDb();
  const conditions: string[] = ['is_deleted = 0'];
  const params: (string | number)[] = [];

  if (opts.walletId) {
    conditions.push('wallet_id = ?');
    params.push(opts.walletId);
  }
  if (opts.dateFrom) {
    conditions.push('date >= ?');
    params.push(opts.dateFrom);
  }
  if (opts.dateTo) {
    conditions.push('date <= ?');
    params.push(opts.dateTo);
  }

  const where = conditions.join(' AND ');
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;

  const rows = db.getAllSync<Record<string, unknown>>(
    `SELECT * FROM transactions WHERE ${where} ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  return rows.map(mapRowToTransaction);
}

function mapRowToTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: row.id as string,
    type: row.type as Transaction['type'],
    amount: row.amount as number,
    note: row.note as string | undefined,
    date: row.date as string,
    walletId: row.wallet_id as string,
    categoryId: row.category_id as string | undefined,
    toWalletId: row.to_wallet_id as string | undefined,
    transferId: row.transfer_id as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    deletedAt: row.deleted_at as string | undefined,
  };
}

export function recalculateWalletBalance(walletId: string): void {
  const db = getDb();

  db.withTransactionSync(() => {
    // Transfers are handled via direct balance updates (debit/credit) during `transferBetweenWallets`,
    // so recalculation only sums income and expense entries.
    const row = db.getFirstSync<{ balance: number }>(
      `SELECT
         COALESCE(SUM(CASE type WHEN 'income' THEN amount ELSE -amount END), 0) AS balance
       FROM transactions
       WHERE wallet_id = ?
         AND is_deleted = 0
         AND type IN ('income','expense')`,
      [walletId],
    );

    const balance = row?.balance ?? 0;
    db.runSync(
      'UPDATE wallets SET balance = ?, updated_at = ? WHERE id = ?',
      [balance, nowIso(), walletId],
    );
  });
}

export function getWallets(): Wallet[] {
  const db = getDb();
  const rows = db.getAllSync<Record<string, unknown>>(
    'SELECT * FROM wallets WHERE is_deleted = 0 ORDER BY created_at ASC',
  );
  return rows.map(mapRowToWallet);
}

function mapRowToWallet(row: Record<string, unknown>): Wallet {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as Wallet['type'],
    balance: row.balance as number,
    color: row.color as string,
    icon: row.icon as string | undefined,
    isArchived: (row.is_archived as number) === 1,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    deletedAt: row.deleted_at as string | undefined,
  };
}
