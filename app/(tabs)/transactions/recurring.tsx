import { View, Text, StyleSheet } from 'react-native';

export default function RecurringScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giao dịch định kỳ</Text>
      <Text style={styles.desc}>Quản lý các giao dịch lặp lại (hàng tuần, hàng tháng)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  desc: { color: '#6b7280' },
});
