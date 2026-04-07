import { Redirect } from 'expo-router';

/** FAB placeholder – tapping + in tab bar navigates to create transaction */
export default function AddPlaceholder() {
  return <Redirect href="/(tabs)/transactions/create" />;
}
