import { transactionDao } from '../db/dao/transaction.dao';
import { walletDao } from '../db/dao/wallet.dao';
import { ReportSummary, CategoryReport, TrendPoint, ReportPeriod } from '../../domain/report/report.types';

export const reportRepository = {
  async getSummary(period: ReportPeriod): Promise<ReportSummary> {
    const transactions = await transactionDao.findAll({
      startDate: period.startDate,
      endDate: period.endDate,
    });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      period,
    };
  },

  async getCategoryBreakdown(period: ReportPeriod): Promise<CategoryReport[]> {
    const transactions = await transactionDao.findAll({
      startDate: period.startDate,
      endDate: period.endDate,
    });

    const map = new Map<string, number>();
    transactions.forEach((t) => {
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    });

    const total = [...map.values()].reduce((sum, v) => sum + v, 0);
    return [...map.entries()].map(([categoryId, amount]) => ({
      categoryId,
      categoryName: categoryId,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }));
  },
};
