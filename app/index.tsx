import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../src/theme';

export default function IndexPage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}
