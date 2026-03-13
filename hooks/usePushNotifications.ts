import { useState, useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const notificationListener = useRef<ReturnType<typeof Notifications.addNotificationReceivedListener> | null>(null);
  const responseListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'notifsound.mp3',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (!Device.isDevice) {
      setError('Push notifications require a physical device');
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      setError('Project ID not found');
      return;
    }

    Notifications.getPermissionsAsync()
      .then(async ({ status: existingStatus }) => {
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          setError('Permission not granted for push notifications');
          return;
        }
        const token = (
          await Notifications.getExpoPushTokenAsync({ projectId })
        ).data;
        setExpoPushToken(token);
      })
      .catch((e) => setError(String(e)));

    notificationListener.current =
      Notifications.addNotificationReceivedListener(async () => {
        const count = await Notifications.getBadgeCountAsync();
        await Notifications.setBadgeCountAsync(count + 1);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(async () => {
        const count = await Notifications.getBadgeCountAsync();
        await Notifications.setBadgeCountAsync(Math.max(0, count - 1));
      });

    const subscription = AppState.addEventListener(
      'change',
      (nextState) => {
        if (nextState === 'active') {
          Notifications.setBadgeCountAsync(0);
        }
      }
    );

    return () => {
      subscription.remove();
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { expoPushToken, error };
}
