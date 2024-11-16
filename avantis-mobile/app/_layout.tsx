import { Stack } from "expo-router";
import { StyleSheet } from "react-native"

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="men" options={{ title: 'Men' }} />
      <Stack.Screen name="women" options={{ title: 'Women' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
    </Stack>
  );
}