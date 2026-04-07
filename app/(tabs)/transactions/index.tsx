import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionCard } from '@/ui/components/transaction/TransactionCard';
import { Transaction } from '@/domain/transaction/transaction.types';

interface TransactionSection {
  title: string;
  data: Transaction[];
}

function groupByDate(transactions: Transaction[]): TransactionSection[] {
  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, item) => {
    const key = item.date.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([title, data]) => ({ title, data }));
}

export default function TransactionsScreen() {
  const { transactions } = useTransactions();
  const sections = useMemo(() => groupByDate(transactions), [transactions]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Giao dịch</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/transactions/add')}>
          <Text style={styles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có giao dịch nào</Text>}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  addBtn: { backgroundColor: '#16a34a', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  list: { flexGrow: 1, padding: 16 },
  sectionHeader: { fontWeight: '700', color: '#374151', marginTop: 8, marginBottom: 8 },
  empty: { color: '#9ca3af', textAlign: 'center', marginTop: 48 },
});
