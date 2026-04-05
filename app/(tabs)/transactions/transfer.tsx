import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function TransferScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chuyển tiền</Text>
      <Text style={styles.desc}>Chuyển tiền giữa các ví của bạn</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Xác nhận chuyển</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  desc: { color: '#6b7280', marginBottom: 32 },
  button: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
