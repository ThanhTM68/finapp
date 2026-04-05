import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/report/report.service';
import { useReportStore } from '../store/report.store';
import { ReportPeriod } from '../domain/report/report.types';

export function useReports(period: ReportPeriod) {
  const { setSummary, setCategoryBreakdown } = useReportStore();

  const summaryQuery = useQuery({
    queryKey: ['report-summary', period],
    queryFn: () => reportService.getSummary(period),
  });

  const breakdownQuery = useQuery({
    queryKey: ['report-breakdown', period],
    queryFn: () => reportService.getCategoryBreakdown(period),
  });

  useEffect(() => {
    if (summaryQuery.data) setSummary(summaryQuery.data);
  }, [summaryQuery.data, setSummary]);

  useEffect(() => {
    if (breakdownQuery.data) setCategoryBreakdown(breakdownQuery.data);
  }, [breakdownQuery.data, setCategoryBreakdown]);

  return {
    summary: summaryQuery.data,
    breakdown: breakdownQuery.data ?? [],
    isLoading: summaryQuery.isLoading || breakdownQuery.isLoading,
  };
}
