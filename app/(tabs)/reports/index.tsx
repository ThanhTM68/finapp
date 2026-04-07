import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { useReports } from '@/hooks/useReports';
import { getMonthRange } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';

const CHART_COLORS = ['#16a34a', '#3b82f6', '#f97316', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function ReportsScreen() {
  const period = useMemo(
    () => ({ type: 'month' as const, ...getMonthRange() }),
    [],
  );
  const { summary, breakdown, trend } = useReports(period);

  const maxTrend = Math.max(1, ...trend.map((item) => Math.max(item.income, item.expense)));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Báo cáo</Text>
      </View>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Thu nhập</Text>
          <Text style={[styles.summaryValue, { color: '#16a34a' }]}>{formatCurrency(summary?.totalIncome ?? 0)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Chi tiêu</Text>
          <Text style={[styles.summaryValue, { color: '#dc2626' }]}>{formatCurrency(summary?.totalExpense ?? 0)}</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Xu hướng thu/chi</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendRow}>
          {trend.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
          ) : trend.map((item) => (
            <View key={item.date} style={styles.trendItem}>
              <View style={styles.barWrap}>
                <View style={[styles.bar, styles.incomeBar, { height: Math.max(4, (item.income / maxTrend) * 90) }]} />
                <View style={[styles.bar, styles.expenseBar, { height: Math.max(4, (item.expense / maxTrend) * 90) }]} />
              </View>
              <Text style={styles.trendLabel}>{item.date.slice(5)}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Chi tiêu theo danh mục</Text>
        {breakdown.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
        ) : breakdown.slice(0, 6).map((item, index) => (
          <View key={item.categoryId} style={styles.pieRow}>
            <View style={[styles.colorDot, { backgroundColor: item.color ?? CHART_COLORS[index % CHART_COLORS.length] }]} />
            <Text style={styles.pieName}>{item.categoryName}</Text>
            <Text style={styles.pieValue}>{Math.round(item.percentage)}%</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 16, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  summaryCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  summaryLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: 'bold' },
  chartCard: { margin: 16, marginTop: 12, backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2 },
  chartTitle: { color: '#111827', fontWeight: '700', marginBottom: 12 },
  trendRow: { alignItems: 'flex-end', minHeight: 120, gap: 14 },
  trendItem: { alignItems: 'center' },
  barWrap: { flexDirection: 'row', alignItems: 'flex-end', height: 96, gap: 4 },
  bar: { width: 10, borderRadius: 4 },
  incomeBar: { backgroundColor: '#16a34a' },
  expenseBar: { backgroundColor: '#dc2626' },
  trendLabel: { fontSize: 10, color: '#6b7280', marginTop: 6 },
  pieRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  pieName: { flex: 1, color: '#111827' },
  pieValue: { color: '#374151', fontWeight: '600' },
  emptyText: { color: '#9ca3af' },
});
