import { Stack } from 'expo-router';

export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="wallets" />
      <Stack.Screen name="wallet-create" options={{ presentation: 'modal' }} />
      <Stack.Screen name="transfer" options={{ presentation: 'modal' }} />
      <Stack.Screen name="categories" />
      <Stack.Screen name="category-create" options={{ presentation: 'modal' }} />
      <Stack.Screen name="export" />
      <Stack.Screen name="security" />
      <Stack.Screen name="sync" />
    </Stack>
  );
}
