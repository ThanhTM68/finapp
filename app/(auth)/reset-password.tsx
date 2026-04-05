import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function ResetPasswordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lại mật khẩu</Text>
      <Text style={styles.desc}>Nhập email để nhận hướng dẫn đặt lại mật khẩu</Text>
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#16a34a', marginBottom: 12 },
  desc: { fontSize: 14, color: '#6b7280', marginBottom: 32 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#16a34a', textAlign: 'center', marginTop: 8 },
});
