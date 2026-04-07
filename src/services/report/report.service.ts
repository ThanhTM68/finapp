import { reportRepository } from '../../data/repositories/report.repository';
import { ReportPeriod, ReportSummary, CategoryReport, TrendPoint } from '../../domain/report/report.types';
import { getWeekRange, getMonthRange, getYearRange } from '../../utils/date';

export const reportService = {
  async getSummary(period: ReportPeriod): Promise<ReportSummary> {
    return reportRepository.getSummary(period);
  },

  async getCategoryBreakdown(period: ReportPeriod): Promise<CategoryReport[]> {
    return reportRepository.getCategoryBreakdown(period);
  },

  async getTrend(period: ReportPeriod): Promise<TrendPoint[]> {
    return reportRepository.getTrend(period);
  },

  async getWeeklySummary(): Promise<ReportSummary> {
    return reportRepository.getSummary({ type: 'week', ...getWeekRange() });
  },

  async getMonthlySummary(): Promise<ReportSummary> {
    return reportRepository.getSummary({ type: 'month', ...getMonthRange() });
  },

  async getYearlySummary(): Promise<ReportSummary> {
    return reportRepository.getSummary({ type: 'year', ...getYearRange() });
  },
};
