import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
      <TextInput style={styles.input} placeholder="Họ tên" />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', paddingTop: 56 },
  back: { marginBottom: 16 },
  backText: { color: '#16a34a', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, marginBottom: 16 },
  button: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
