import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function TransactionsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Giao dịch</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/transactions/create')}>
          <Text style={styles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={[]}
        keyExtractor={(item) => String(item)}
        renderItem={() => null}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có giao dịch nào</Text>}
        contentContainerStyle={styles.list}
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
  empty: { color: '#9ca3af', textAlign: 'center', marginTop: 48 },
});
