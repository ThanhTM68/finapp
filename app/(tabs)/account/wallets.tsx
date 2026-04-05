import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function WalletsManagementScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Quản lý ví</Text>
      <Text style={styles.desc}>Danh sách ví của bạn</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', paddingTop: 56 },
  back: { marginBottom: 16 },
  backText: { color: '#16a34a', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  desc: { color: '#6b7280' },
});
