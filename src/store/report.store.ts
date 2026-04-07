import { create } from 'zustand';
import { ReportSummary, CategoryReport, ReportPeriod, TrendPoint } from '../domain/report/report.types';

interface ReportState {
  summary: ReportSummary | null;
  categoryBreakdown: CategoryReport[];
  trend: TrendPoint[];
  activePeriod: ReportPeriod['type'];
  setSummary: (summary: ReportSummary) => void;
  setCategoryBreakdown: (data: CategoryReport[]) => void;
  setTrend: (data: TrendPoint[]) => void;
  setActivePeriod: (period: ReportPeriod['type']) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  summary: null,
  categoryBreakdown: [],
  trend: [],
  activePeriod: 'month',
  setSummary: (summary) => set({ summary }),
  setCategoryBreakdown: (categoryBreakdown) => set({ categoryBreakdown }),
  setTrend: (trend) => set({ trend }),
  setActivePeriod: (activePeriod) => set({ activePeriod }),
}));
