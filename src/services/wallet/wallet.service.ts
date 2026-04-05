import { walletRepository } from '../../data/repositories/wallet.repository';
import { Wallet, CreateWalletPayload, UpdateWalletPayload } from '../../domain/wallet/wallet.types';
import { transactionRepository } from '../../data/repositories/transaction.repository';
import { generateId } from '../../utils/id';
import { syncQueueDao } from '../../data/db/dao/sync_queue.dao';
import { walletDao } from '../../data/db/dao/wallet.dao';

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
    // Deduct from source wallet
    const fromWallet = await walletDao.findById(fromId);
    const toWallet = await walletDao.findById(toId);

    if (!fromWallet || !toWallet) throw new Error('Ví không tồn tại');
    if (fromWallet.balance < amount) throw new Error('Số dư không đủ');

    await walletDao.updateBalance(fromId, fromWallet.balance - amount);
    await walletDao.updateBalance(toId, toWallet.balance + amount);

    await syncQueueDao.enqueue('wallets', 'UPDATE', { id: fromId, balance: fromWallet.balance - amount });
    await syncQueueDao.enqueue('wallets', 'UPDATE', { id: toId, balance: toWallet.balance + amount });
  },
};
