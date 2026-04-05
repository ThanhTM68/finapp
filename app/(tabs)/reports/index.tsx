import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ReportsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Báo cáo</Text>
      </View>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Thu nhập</Text>
          <Text style={[styles.summaryValue, { color: '#16a34a' }]}>0 ₫</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Chi tiêu</Text>
          <Text style={[styles.summaryValue, { color: '#dc2626' }]}>0 ₫</Text>
        </View>
      </View>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>📊 Biểu đồ xu hướng</Text>
      </View>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>🍕 Biểu đồ danh mục</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 16, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  summaryRow: { flexDirection: 'row', padding: 16, gap: 12 },
  summaryCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  summaryLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: 'bold' },
  chartPlaceholder: {
    margin: 16, height: 180, backgroundColor: '#fff', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', elevation: 2,
  },
  placeholderText: { color: '#9ca3af', fontSize: 16 },
});
