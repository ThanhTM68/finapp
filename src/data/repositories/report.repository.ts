import { transactionDao } from '../db/dao/transaction.dao';
import { categoryDao } from '../db/dao/category.dao';
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
    const expenseTransactions = transactions.filter((t) => t.type === 'expense');

    const amountByCategory = new Map<string, number>();
    expenseTransactions.forEach((t) => {
      amountByCategory.set(t.categoryId, (amountByCategory.get(t.categoryId) ?? 0) + t.amount);
    });

    const total = [...amountByCategory.values()].reduce((sum, v) => sum + v, 0);

    const reports: CategoryReport[] = [];
    for (const [categoryId, amount] of amountByCategory.entries()) {
      const category = await categoryDao.findById(categoryId);
      reports.push({
        categoryId,
        categoryName: category?.name ?? categoryId,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: category?.color,
      });
    }
    return reports.sort((a, b) => b.amount - a.amount);
  },

  async getTrend(period: ReportPeriod): Promise<TrendPoint[]> {
    const transactions = await transactionDao.findAll({
      startDate: period.startDate,
      endDate: period.endDate,
    });

    const grouped = new Map<string, TrendPoint>();
    for (const tx of transactions) {
      const date = tx.date.slice(0, 10);
      const current = grouped.get(date) ?? { date, income: 0, expense: 0 };
      if (tx.type === 'income') {
        current.income += tx.amount;
      } else if (tx.type === 'expense') {
        current.expense += tx.amount;
      }
      grouped.set(date, current);
    }

    return [...grouped.values()].sort((a, b) => a.date.localeCompare(b.date));
  },
};
