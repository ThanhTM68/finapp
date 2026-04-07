import { getBudgets, getCategories, getTransactions, getWallets } from './transactionService';
import { currentPeriod } from './utils';
import { useBudgetStore } from '../stores/budgetStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useWalletStore } from '../stores/walletStore';

export async function initializeStoresFromDb(): Promise<void> {
  const walletStore = useWalletStore.getState();
  const categoryStore = useCategoryStore.getState();
  const transactionStore = useTransactionStore.getState();
  const budgetStore = useBudgetStore.getState();

  walletStore.setLoading(true);
  categoryStore.setLoading(true);
  transactionStore.setLoading(true);
  budgetStore.setLoading(true);

  try {
    const period = currentPeriod();
    budgetStore.setCurrentPeriod(period);

    const [wallets, categories, transactions, budgets] = await Promise.all([
      Promise.resolve(getWallets()),
      Promise.resolve(getCategories()),
      Promise.resolve(getTransactions({ limit: 100 })),
      Promise.resolve(getBudgets(period)),
    ]);

    walletStore.setWallets(wallets);
    categoryStore.setCategories(categories);
    transactionStore.setTransactions(transactions);
    budgetStore.setBudgets(budgets);
  } finally {
    walletStore.setLoading(false);
    categoryStore.setLoading(false);
    transactionStore.setLoading(false);
    budgetStore.setLoading(false);
  }
}
