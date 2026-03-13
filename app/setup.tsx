import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setGameName, setAvatarId, AVATARS } from '@/lib/storage';
import { useToastContext } from '@/contexts/ToastContext';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [gameName, setGameNameState] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const handleContinue = async () => {
    if (!gameName || !selectedAvatar) return;
    try {
      await setGameName(gameName);
      await setAvatarId(selectedAvatar.toString());
      const { getInitialDeposit } = await import('@/lib/storage');
      const deposit = await getInitialDeposit();
      if (deposit) {
        router.back();
      } else {
        router.replace('/deposit');
      }
      showToast('Profile set up successfully!', 'success');
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Setup Your Profile</Text>
        <Text style={styles.subtitle}>Choose your game name and avatar</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Game Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your game name"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={gameName}
            onChangeText={setGameNameState}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Pick Your Avatar</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((emoji, index) => (
              <Pressable
                key={index}
                style={[
                  styles.avatarButton,
                  selectedAvatar === index + 1 && styles.avatarSelected,
                ]}
                onPress={() => setSelectedAvatar(index + 1)}
              >
                <Text style={styles.avatarEmoji}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={[
          styles.continueButton,
          (!gameName || !selectedAvatar) && styles.continueDisabled,
        ]}
        onPress={handleContinue}
        disabled={!gameName || !selectedAvatar}
      >
        <Text style={styles.continueText}>Continue</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6d28d9',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: 'white',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarButton: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSelected: {
    backgroundColor: 'white',
    transform: [{ scale: 1.1 }],
  },
  avatarEmoji: {
    fontSize: 36,
  },
  continueButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueDisabled: {
    opacity: 0.5,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6d28d9',
  },
});
