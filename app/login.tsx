import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { useToastContext } from '@/contexts/ToastContext';

const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export default function LoginScreen() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    if (isExpoGo) {
      showToast(
        'Expo Go: Google Sign-In requires a dev build. Continuing to setup.',
        'info'
      );
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
        console.log('Signed in with Google successfully!', JSON.stringify(result.data.user));
        showToast('Signed in with Google successfully!', 'success');
        router.replace('/setup');
      } else if (result.type === 'cancelled') {
        showToast('Sign in was cancelled.', 'info');
      }
    } catch (err) {
      const errStr = String(err?.message ?? err ?? '');
      const isDeveloperError =
        err?.code === 10 ||
        errStr.includes('DEVELOPER_ERROR') ||
        errStr.includes('10');
      const message = isDeveloperError
        ? 'Add app SHA-1 to Google Cloud Console'
        : 'Google Sign-In failed. Continuing to setup.';
      console.warn('Google Sign-In error:', err);
      showToast(message, 'warning');
      router.replace('/setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons name="game-controller" size={64} color="white" />
        </View>
        <Text style={styles.title}>GameTracker</Text>
        <Text style={styles.subtitle}>
          Track your games, manage your balance
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </Pressable>
        <Text style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6d28d9',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    marginTop: 24,
  },
  iconWrapper: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  actions: {
    gap: 16,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  terms: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
