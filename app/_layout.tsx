import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { ToastProvider } from '@/contexts/ToastContext';
import { PushNotificationProvider } from '@/components/PushNotificationProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <PushNotificationProvider>
          <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="setup" />
        <Stack.Screen name="deposit" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="game"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
          </Stack>
          <StatusBar style="auto" />
          </PushNotificationProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
    </QueryClientProvider>
  );
}
