import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Xin chào!</Text>
        <Text style={styles.totalLabel}>Tổng số dư</Text>
        <Text style={styles.totalBalance}>0 ₫</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
        <Text style={styles.empty}>Chưa có giao dịch nào</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#16a34a',
    padding: 24,
    paddingTop: 56,
    alignItems: 'center',
  },
  greeting: { color: '#d1fae5', fontSize: 14, marginBottom: 8 },
  totalLabel: { color: '#d1fae5', fontSize: 14 },
  totalBalance: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  empty: { color: '#9ca3af', textAlign: 'center', marginTop: 24 },
});
