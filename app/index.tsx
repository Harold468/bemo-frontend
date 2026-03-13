import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getInitialDeposit } from '@/lib/storage';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const deposit = await getInitialDeposit();
      if (deposit) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <View style={styles.dpad} />
          <View style={styles.buttonA} />
          <View style={styles.buttonB} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#6d28d9',
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpad: {
    position: 'absolute',
    left: 20,
    width: 24,
    height: 24,
    backgroundColor: '#9333ea',
    borderRadius: 6,
  },
  buttonA: {
    position: 'absolute',
    right: 28,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9333ea',
  },
  buttonB: {
    position: 'absolute',
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9333ea',
  },
});
