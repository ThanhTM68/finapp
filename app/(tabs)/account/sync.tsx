import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function SyncScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Đồng bộ dữ liệu</Text>
      <Text style={styles.desc}>Đồng bộ dữ liệu với máy chủ khi có kết nối mạng</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Đồng bộ ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', paddingTop: 56 },
  back: { marginBottom: 16 },
  backText: { color: '#16a34a', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  desc: { color: '#6b7280', marginBottom: 24 },
  button: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
