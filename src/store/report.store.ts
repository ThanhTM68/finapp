import { create } from 'zustand';
import { ReportSummary, CategoryReport, ReportPeriod } from '../domain/report/report.types';

interface ReportState {
  summary: ReportSummary | null;
  categoryBreakdown: CategoryReport[];
  activePeriod: ReportPeriod['type'];
  setSummary: (summary: ReportSummary) => void;
  setCategoryBreakdown: (data: CategoryReport[]) => void;
  setActivePeriod: (period: ReportPeriod['type']) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  summary: null,
  categoryBreakdown: [],
  activePeriod: 'month',
  setSummary: (summary) => set({ summary }),
  setCategoryBreakdown: (categoryBreakdown) => set({ categoryBreakdown }),
  setActivePeriod: (activePeriod) => set({ activePeriod }),
}));
