import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function SecurityScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Bảo mật</Text>
      <Text style={styles.desc}>Đổi mật khẩu &amp; Khóa ứng dụng (PIN / sinh trắc học)</Text>
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
