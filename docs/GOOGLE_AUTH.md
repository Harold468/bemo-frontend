# Google Sign-In Setup Guide

This guide covers installing and configuring Google Sign-In in an Expo app using `@react-native-google-signin/google-signin`.

> **Note:** Google Sign-In does **not** work in Expo Go. You must use a development build (EAS Build or `npx expo run:android` / `npx expo run:ios`).

---

## 1. Installation

```bash
npx expo install @react-native-google-signin/google-signin
```

---

## 2. Google Cloud Console Setup

### 2.1 Create OAuth Clients

Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).

#### Web Client (required)

1. Create OAuth client ID → **Web application**
2. Copy the **Client ID** (e.g. `867885568012-xxx.apps.googleusercontent.com`)
3. This is used in your app's `GoogleSignin.configure()`

#### Android Client

1. Create OAuth client ID → **Android**
2. **Package name:** `com.harold616.bemo` (or your app's package from `app.json`)
3. **SHA-1 fingerprint:** Get from EAS credentials or local build:
   - **EAS:** Run `pnpm dlx eas-cli credentials -p android` → copy SHA-1 from Android upload keystore
   - **Local:** `cd android && ./gradlew signingReport`
4. Add the SHA-1 to the Android OAuth client
5. Click **Create**

#### iOS Client

1. Create OAuth client ID → **iOS**
2. **Bundle ID:** `com.harold616.bemo` (or your app's bundle identifier)
3. Copy the **iOS Client ID** (e.g. `867885568012-xxx.apps.googleusercontent.com`) — used in `GoogleSignin.configure({ iosClientId })`
4. Copy the **iOS URL scheme** (reversed client ID, e.g. `com.googleusercontent.apps.867885568012-xxx`) — used in `app.json` plugin

---

## 3. App Configuration

### 3.1 Add Plugin to `app.json`

```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.867885568012-YOUR_IOS_CLIENT_SUFFIX"
        }
      ]
    ]
  }
}
```

Replace `YOUR_IOS_CLIENT_SUFFIX` with the suffix from your iOS OAuth client's reversed client ID.

### 3.2 Add Bundle/Package Identifiers

Ensure `app.json` has:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.harold616.bemo"
    },
    "android": {
      "package": "com.harold616.bemo"
    }
  }
}
```

---

## 4. Environment Variables

Create a `.env` file in the project root (add to `.gitignore`):

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
```

Copy `.env.example` to `.env` and fill in your values. For **EAS Build**, set these in `eas.json` build profiles or EAS Secrets, since `.env` may not be uploaded.

---

## 5. Code Implementation

### 5.1 Login Screen Example

```tsx
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);

    // Expo Go fallback - native module not available
    if (isExpoGo) {
      showToast('Expo Go: Google Sign-In requires a dev build.', 'info');
      router.replace('/setup');
      setLoading(false);
      return;
    }

    try {
      const { GoogleSignin } = await import(
        '@react-native-google-signin/google-signin'
      );

      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        offlineAccess: true,
      });

      const result = await GoogleSignin.signIn();

      if (result.type === 'success') {
        // Signed in successfully
        const user = result.data.user;
        router.replace('/setup');
      } else if (result.type === 'cancelled') {
        // User cancelled
        showToast('Sign in was cancelled.', 'info');
      }
    } catch (err) {
      // DEVELOPER_ERROR (code 10) = add SHA-1 to Google Cloud Console
      const isDeveloperError =
        err?.code === 10 || String(err).includes('DEVELOPER_ERROR');
      showToast(
        isDeveloperError
          ? 'Add app SHA-1 to Google Cloud Console'
          : 'Google Sign-In failed.',
        'warning'
      );
      router.replace('/setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={handleGoogleLogin} disabled={loading}>
      <Text>Continue with Google</Text>
    </Pressable>
  );
}
```

### 5.2 Response Types

| `result.type` | Description |
|---------------|-------------|
| `success`    | User signed in. Access user via `result.data.user` |
| `cancelled`  | User dismissed the sign-in flow |

### 5.3 Error Handling

- **DEVELOPER_ERROR (code 10):** SHA-1 fingerprint not registered in Google Cloud Console. Add your app's SHA-1 to the Android OAuth client.
- **`GoogleService-Info.plist was not found and iosClientId was not provided`:** Pass `iosClientId` to `configure()` with your iOS OAuth client ID. Required when not using Firebase.
- **Expo Go:** Skip the import and show a fallback message. Use `Constants.executionEnvironment === ExecutionEnvironment.StoreClient` to detect.

---

## 6. Build & Test

```bash
# EAS Build (recommended)
pnpm dlx eas-cli build -p android --profile preview
pnpm dlx eas-cli build -p ios --profile preview

# Or local development build
npx expo prebuild --clean
npx expo run:android
npx expo run:ios
```

---

## 7. Summary: What Goes Where

| Item | Used In | Location |
|------|---------|----------|
| **Web Client ID** | `GoogleSignin.configure({ webClientId })` | Code |
| **iOS Client ID** | `GoogleSignin.configure({ iosClientId })` | Code |
| **Android OAuth Client** | Google verifies app (package + SHA-1) | Google Cloud Console only |
| **iOS URL Scheme** | `iosUrlScheme` in plugin config | `app.json` |
| **SHA-1 Fingerprint** | Android OAuth client | Google Cloud Console |

---

## References

- [Expo Google Authentication Guide](https://docs.expo.dev/guides/google-authentication/)
- [@react-native-google-signin Expo Setup](https://react-native-google-signin.github.io/docs/setting-up/expo)
