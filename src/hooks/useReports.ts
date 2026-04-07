import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/report/report.service';
import { useReportStore } from '../store/report.store';
import { ReportPeriod } from '../domain/report/report.types';

export function useReports(period: ReportPeriod) {
  const { setSummary, setCategoryBreakdown, setTrend } = useReportStore();

  const summaryQuery = useQuery({
    queryKey: ['report-summary', period],
    queryFn: () => reportService.getSummary(period),
  });

  const breakdownQuery = useQuery({
    queryKey: ['report-breakdown', period],
    queryFn: () => reportService.getCategoryBreakdown(period),
  });

  const trendQuery = useQuery({
    queryKey: ['report-trend', period],
    queryFn: () => reportService.getTrend(period),
  });

  useEffect(() => {
    if (summaryQuery.data) setSummary(summaryQuery.data);
  }, [summaryQuery.data, setSummary]);

  useEffect(() => {
    if (breakdownQuery.data) setCategoryBreakdown(breakdownQuery.data);
  }, [breakdownQuery.data, setCategoryBreakdown]);

  useEffect(() => {
    if (trendQuery.data) setTrend(trendQuery.data);
  }, [trendQuery.data, setTrend]);

  return {
    summary: summaryQuery.data,
    breakdown: breakdownQuery.data ?? [],
    trend: trendQuery.data ?? [],
    isLoading: summaryQuery.isLoading || breakdownQuery.isLoading || trendQuery.isLoading,
  };
}
