import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="Index" options={{ title: 'Home' }} />
      <Stack.Screen name="Login" options={{ title: 'Login' }} />
      <Stack.Screen name="Signup" options={{ title: 'Sign Up' }} />
    </Stack>
  );
}
