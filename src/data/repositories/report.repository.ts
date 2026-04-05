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

    const amountByCategory = new Map<string, number>();
    transactions.forEach((t) => {
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
      });
    }
    return reports;
  },
};
