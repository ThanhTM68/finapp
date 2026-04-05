export interface ReportPeriod {
  type: 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
}

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  period: ReportPeriod;
}

export interface CategoryReport {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface TrendPoint {
  date: string;
  income: number;
  expense: number;
}
