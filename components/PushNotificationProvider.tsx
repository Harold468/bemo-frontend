import { useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

/**
 * Registers for push notifications on app load.
 * Token is available via usePushNotifications() or in console for testing.
 */
export function PushNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { expoPushToken, error } = usePushNotifications();

  useEffect(() => {
    if (expoPushToken) {
      console.log('Expo push token:', expoPushToken);
    }
    if (error) {
      console.warn('Push notification error:', error);
    }
  }, [expoPushToken, error]);

  return <>{children}</>;
}
