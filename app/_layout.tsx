import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { runMigrations } from '../src/db/migrations';
import { useAuthStore } from '../src/stores/authStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    async function init() {
      try {
        await runMigrations();
        // TODO: restore auth token from secure store
      } catch (err) {
        console.error('[Init] Failed to initialise database', err);
      } finally {
        setLoading(false);
        SplashScreen.hideAsync();
      }
    }
    init();
  }, [setLoading]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="report" />
      </Stack>
    </>
  );
}
