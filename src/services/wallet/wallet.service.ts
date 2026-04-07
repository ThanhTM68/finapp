import { walletRepository } from '../../data/repositories/wallet.repository';
import { Wallet, CreateWalletPayload, UpdateWalletPayload } from '../../domain/wallet/wallet.types';
import { transactionDao } from '../../data/db/dao/transaction.dao';
import { generateId } from '../../utils/id';
import { syncQueueDao } from '../../data/db/dao/sync_queue.dao';
import { walletDao } from '../../data/db/dao/wallet.dao';

const TRANSFER_CATEGORY_ID = 'transfer';

export const walletService = {
  async getAll(): Promise<Wallet[]> {
    return walletRepository.getAll();
  },

  async create(payload: CreateWalletPayload): Promise<Wallet> {
    return walletRepository.create(payload);
  },

  async update(payload: UpdateWalletPayload): Promise<void> {
    return walletRepository.update(payload);
  },

  async delete(id: string): Promise<void> {
    return walletRepository.delete(id);
  },

  async transfer(fromId: string, toId: string, amount: number, note?: string): Promise<void> {
    const now = new Date().toISOString();
    const fromWallet = await walletDao.findById(fromId);
    const toWallet = await walletDao.findById(toId);

    if (!fromWallet || !toWallet) throw new Error('Ví không tồn tại');
    if (fromWallet.balance < amount) throw new Error('Số dư không đủ');

    const transferId = generateId();
    const date = now.slice(0, 10);

    // Debit leg – expense from source wallet
    const debitTx = {
      id: generateId(),
      walletId: fromId,
      categoryId: TRANSFER_CATEGORY_ID,
      amount,
      type: 'transfer' as const,
      note: note ?? '',
      date,
      isRecurring: false,
      recurringInterval: undefined,
      transferId,
      syncStatus: 'pending' as const,
      createdAt: now,
      updatedAt: now,
    };

    // Credit leg – income to destination wallet
    const creditTx = {
      id: generateId(),
      walletId: toId,
      categoryId: TRANSFER_CATEGORY_ID,
      amount,
      type: 'transfer' as const,
      note: note ?? '',
      date,
      isRecurring: false,
      recurringInterval: undefined,
      transferId,
      syncStatus: 'pending' as const,
      createdAt: now,
      updatedAt: now,
    };

    await transactionDao.insert(debitTx);
    await transactionDao.insert(creditTx);

    await walletDao.updateBalance(fromId, fromWallet.balance - amount);
    await walletDao.updateBalance(toId, toWallet.balance + amount);

    await syncQueueDao.enqueue('transactions', 'INSERT', debitTx);
    await syncQueueDao.enqueue('transactions', 'INSERT', creditTx);
    await syncQueueDao.enqueue('wallets', 'UPDATE', { id: fromId, balance: fromWallet.balance - amount });
    await syncQueueDao.enqueue('wallets', 'UPDATE', { id: toId, balance: toWallet.balance + amount });
  },
};
