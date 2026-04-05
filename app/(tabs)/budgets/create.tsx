import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function CreateBudgetScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo ngân sách</Text>
      <TextInput style={styles.input} placeholder="Tên ngân sách" />
      <TextInput style={styles.input} placeholder="Hạn mức (₫)" keyboardType="numeric" />
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Lưu ngân sách</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, marginBottom: 16 },
  button: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
