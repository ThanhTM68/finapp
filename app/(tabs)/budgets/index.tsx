import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function BudgetsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ngân sách</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/budgets/create')}>
          <Text style={styles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.empty}>Chưa có ngân sách nào</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  addBtn: { backgroundColor: '#16a34a', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  empty: { color: '#9ca3af', textAlign: 'center', marginTop: 48 },
});
