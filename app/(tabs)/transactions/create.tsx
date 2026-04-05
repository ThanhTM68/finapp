import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function CreateTransactionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm giao dịch</Text>
      <TextInput style={styles.amountInput} placeholder="0 ₫" keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Ghi chú" />
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Lưu giao dịch</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 24, marginTop: 48 },
  amountInput: {
    fontSize: 36, fontWeight: 'bold', color: '#16a34a',
    borderBottomWidth: 2, borderColor: '#16a34a', paddingBottom: 8, marginBottom: 24, textAlign: 'center',
  },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, marginBottom: 16 },
  button: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
