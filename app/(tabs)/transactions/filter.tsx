import { View, Text, StyleSheet } from 'react-native';

export default function TransactionFilterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bộ lọc giao dịch</Text>
      <Text style={styles.desc}>Lọc theo loại, danh mục, khoảng thời gian, ví</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  desc: { color: '#6b7280' },
});
