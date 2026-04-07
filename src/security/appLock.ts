import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';
import { secureStorage } from './secureStore';

const PIN_HASH_KEY = 'app_lock_pin_hash';

async function hashPin(pin: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
}

export const appLock = {
  async isAvailable(): Promise<boolean> {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  },

  async authenticateBiometric(): Promise<boolean> {
    const available = await appLock.isAvailable();
    if (!available) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Xác thực để mở ứng dụng',
      fallbackLabel: 'Dùng PIN',
    });

    return result.success;
  },

  async setPin(pin: string): Promise<void> {
    const hash = await hashPin(pin);
    await secureStorage.setString(PIN_HASH_KEY, hash);
  },

  async hasPin(): Promise<boolean> {
    const hash = await secureStorage.getString(PIN_HASH_KEY);
    return Boolean(hash);
  },

  async verifyPin(pin: string): Promise<boolean> {
    const [stored, incoming] = await Promise.all([
      secureStorage.getString(PIN_HASH_KEY),
      hashPin(pin),
    ]);
    if (!stored) return false;
    return stored === incoming;
  },

  async clearPin(): Promise<void> {
    await secureStorage.remove(PIN_HASH_KEY);
  },
};
