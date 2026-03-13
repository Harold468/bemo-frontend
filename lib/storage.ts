import { Platform } from 'react-native';

const KEYS = {
  GAME_NAME: 'gameName',
  AVATAR_ID: 'avatarId',
  INITIAL_DEPOSIT: 'initialDeposit',
  PAYMENT_METHOD: 'paymentMethod',
} as const;

const PREFIX = 'bemo_';

// In-memory fallback when native module is unavailable (e.g. Expo Go on some setups)
const memoryStore = new Map<string, string>();

type StorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function createMemoryStorage(): StorageAdapter {
  return {
    getItem: (key) => Promise.resolve(memoryStore.get(PREFIX + key) ?? null),
    setItem: (key, value) => {
      memoryStore.set(PREFIX + key, value);
      return Promise.resolve();
    },
    removeItem: (key) => {
      memoryStore.delete(PREFIX + key);
      return Promise.resolve();
    },
  };
}

function createWebStorage(): StorageAdapter {
  if (typeof localStorage === 'undefined') return createMemoryStorage();
  return {
    getItem: (key) => Promise.resolve(localStorage.getItem(PREFIX + key)),
    setItem: (key, value) =>
      Promise.resolve(localStorage.setItem(PREFIX + key, value)),
    removeItem: (key) =>
      Promise.resolve(localStorage.removeItem(PREFIX + key)),
  };
}

async function createStorage(): Promise<StorageAdapter> {
  if (Platform.OS === 'web') {
    return createWebStorage();
  }

  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage')
      .default;
    // Test if native module works
    await AsyncStorage.getItem('__test__');
    return AsyncStorage;
  } catch {
    return createMemoryStorage();
  }
}

let storagePromise: Promise<StorageAdapter> | null = null;

function getStorage(): Promise<StorageAdapter> {
  if (!storagePromise) {
    storagePromise = createStorage();
  }
  return storagePromise;
}

export async function getGameName(): Promise<string> {
  const s = await getStorage();
  return (await s.getItem(KEYS.GAME_NAME)) || 'Player';
}

export async function setGameName(name: string): Promise<void> {
  const s = await getStorage();
  await s.setItem(KEYS.GAME_NAME, name);
}

export async function getAvatarId(): Promise<string> {
  const s = await getStorage();
  return (await s.getItem(KEYS.AVATAR_ID)) || '1';
}

export async function setAvatarId(id: string): Promise<void> {
  const s = await getStorage();
  await s.setItem(KEYS.AVATAR_ID, id);
}

export async function getInitialDeposit(): Promise<string> {
  const s = await getStorage();
  return (await s.getItem(KEYS.INITIAL_DEPOSIT)) || '';
}

export async function setInitialDeposit(amount: string): Promise<void> {
  const s = await getStorage();
  await s.setItem(KEYS.INITIAL_DEPOSIT, amount);
}

export async function getPaymentMethod(): Promise<string> {
  const s = await getStorage();
  return (await s.getItem(KEYS.PAYMENT_METHOD)) || 'bank';
}

export async function setPaymentMethod(method: string): Promise<void> {
  const s = await getStorage();
  await s.setItem(KEYS.PAYMENT_METHOD, method);
}

export async function clearAll(): Promise<void> {
  const s = await getStorage();
  for (const key of Object.values(KEYS)) {
    await s.removeItem(key);
  }
}

export const AVATARS = ['🦁', '🐯', '🐻', '🦊', '🐼', '🐨', '🦅', '🐺'];
