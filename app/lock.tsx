import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { appLock } from '@/security/appLock';
import { secureStorage } from '@/security/secureStore';

const LAST_UNLOCK_AT_KEY = 'app_lock_last_unlock_at';

export default function LockScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const unlockWithPin = async () => {
    const ok = await appLock.verifyPin(pin);
    if (!ok) {
      setError('PIN không đúng');
      return;
    }
    await secureStorage.setString(LAST_UNLOCK_AT_KEY, Date.now().toString());
    router.replace('/(tabs)');
  };

  const unlockWithBiometric = async () => {
    const ok = await appLock.authenticateBiometric();
    if (!ok) {
      setError('Không thể xác thực sinh trắc học');
      return;
    }
    await secureStorage.setString(LAST_UNLOCK_AT_KEY, Date.now().toString());
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ứng dụng đã khóa</Text>
      <Text style={styles.subtitle}>Nhập PIN hoặc dùng sinh trắc học để tiếp tục</Text>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={(value) => {
          setPin(value.replace(/[^0-9]/g, '').slice(0, 6));
          setError('');
        }}
        keyboardType='number-pad'
        secureTextEntry
        placeholder='Nhập PIN'
        placeholderTextColor='#9ca3af'
      />
      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.primary} onPress={() => void unlockWithPin()}>
        <Text style={styles.primaryText}>Mở khóa bằng PIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondary} onPress={() => void unlockWithBiometric()}>
        <Text style={styles.secondaryText}>Dùng sinh trắc học</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { color: '#6b7280', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 12, fontSize: 20, letterSpacing: 6, textAlign: 'center' },
  error: { color: '#dc2626', marginTop: 8 },
  primary: { marginTop: 16, backgroundColor: '#16a34a', padding: 14, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: { marginTop: 10, borderWidth: 1, borderColor: '#d1d5db', padding: 14, borderRadius: 12, alignItems: 'center' },
  secondaryText: { color: '#374151', fontWeight: '600' },
});
