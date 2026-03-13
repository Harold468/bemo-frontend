# Push Notifications Setup Guide

This guide covers installing and configuring push notifications in an Expo app using `expo-notifications` with FCM V1 for Android.

> **Note:** Push notifications require a **physical device**. They do not work on emulators/simulators.

---

## 1. Installation

```bash
npx expo install expo-notifications expo-device expo-constants
```

---

## 2. App Configuration

### 2.1 Add Plugin to `app.json`

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": ["./notifsound.mp3"]
        }
      ]
    ]
  }
}
```

- `sounds`: Optional array of custom notification sound files (relative to project root)

### 2.2 Android: Add `google-services.json`

1. Create a [Firebase project](https://console.firebase.google.com/)
2. Add an Android app with your package name (e.g. `com.harold616.bemo`)
3. Download `google-services.json` from Firebase Console → Project settings
4. Place it in your project root
5. Add to `app.json`:

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### 2.3 EAS: FCM V1 Service Account Key

1. In [Firebase Console](https://console.firebase.google.com/) → Project settings → **Service accounts**
2. Click **Generate new private key** → Download the JSON file
3. In [EAS Dashboard](https://expo.dev) or via CLI:
   - Go to your project → Credentials → Android
   - **FCM V1 Service Account Key** → Upload new key
   - Select the downloaded JSON file
   - Save

4. Add the JSON filename to `.gitignore` (it contains secrets):

```
google-service-account-key.json
*-service-account*.json
```

---

## 3. Code Implementation

### 3.1 Create the Hook: `hooks/usePushNotifications.ts`

```tsx
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
    // Android: Create notification channel with custom sound
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

    // Request permissions and get push token
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

    // Badge: increment when notification received
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async () => {
        const count = await Notifications.getBadgeCountAsync();
        await Notifications.setBadgeCountAsync(count + 1);
      });

    // Badge: decrement when user taps notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(async () => {
        const count = await Notifications.getBadgeCountAsync();
        await Notifications.setBadgeCountAsync(Math.max(0, count - 1));
      });

    // Badge: clear when app becomes active
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        Notifications.setBadgeCountAsync(0);
      }
    });

    return () => {
      subscription.remove();
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { expoPushToken, error };
}
```

### 3.2 Provider Component: `components/PushNotificationProvider.tsx`

```tsx
import { useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function PushNotificationProvider({ children }: { children: React.ReactNode }) {
  const { expoPushToken, error } = usePushNotifications();

  useEffect(() => {
    if (expoPushToken) {
      console.log('Expo push token:', expoPushToken);
      // TODO: Send token to your backend
    }
    if (error) {
      console.warn('Push notification error:', error);
    }
  }, [expoPushToken, error]);

  return <>{children}</>;
}
```

### 3.3 Add to Root Layout: `app/_layout.tsx`

```tsx
import { PushNotificationProvider } from '@/components/PushNotificationProvider';

export default function RootLayout() {
  return (
    <ToastProvider>
      <PushNotificationProvider>
        <Stack />
      </PushNotificationProvider>
    </ToastProvider>
  );
}
```

---

## 4. Sending Notifications

### 4.1 Via Expo Push API

```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ExponentPushToken[YOUR_TOKEN]",
    "sound": "notifsound.mp3",
    "title": "Hello",
    "body": "World",
    "data": { "key": "value" }
  }'
```

### 4.2 Via Expo Push Tool

1. Go to [expo.dev/notifications](https://expo.dev/notifications)
2. Enter your `ExponentPushToken[xxx]` (from console log)
3. Add title, body, and optional custom sound
4. Send

### 4.3 Custom Sound in Payload

To use your custom sound when sending:

```json
{
  "to": "ExponentPushToken[xxx]",
  "sound": "notifsound.mp3",
  "title": "Title",
  "body": "Body"
}
```

Use `"sound": "default"` for system default.

---

## 5. Build & Test

```bash
# EAS Build
pnpm dlx eas-cli build -p android --profile preview
pnpm dlx eas-cli build -p ios --profile preview
```

1. Install the build on a physical device
2. Open the app and grant notification permission
3. Check the console for the Expo push token
4. Send a test notification from [expo.dev/notifications](https://expo.dev/notifications)

---

## 6. Checklist

- [ ] `expo-notifications`, `expo-device`, `expo-constants` installed
- [ ] `expo-notifications` plugin in `app.json`
- [ ] `google-services.json` in project root and referenced in `app.json`
- [ ] FCM V1 Service Account Key uploaded to EAS
- [ ] `usePushNotifications` hook created
- [ ] `PushNotificationProvider` wraps app in `_layout.tsx`
- [ ] App built with EAS (not Expo Go)
- [ ] Tested on physical device

---

## References

- [Expo Push Notifications Setup](https://docs.expo.dev/push-notifications/push-notifications-setup/)
- [Expo FCM V1 Credentials](https://docs.expo.dev/push-notifications/fcm-credentials/)
- [Expo Push API](https://docs.expo.dev/push-notifications/sending-notifications/)
