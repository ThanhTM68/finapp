import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fincoin</Text>
      <Text style={styles.subtitle}>Quản lý tài chính cá nhân thông minh</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.buttonText}>Bắt đầu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#16a34a', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 48 },
  button: { backgroundColor: '#16a34a', paddingHorizontal: 48, paddingVertical: 16, borderRadius: 24 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
