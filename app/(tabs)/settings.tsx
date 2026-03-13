import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getGameName, getAvatarId, clearAll, AVATARS } from '@/lib/storage';
import { useToastContext } from '@/contexts/ToastContext';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function SettingsScreen() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [gameName, setGameName] = useState('Player');
  const [userAvatar, setUserAvatar] = useState('🦁');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  useEffect(() => {
    getGameName().then(setGameName);
    getAvatarId().then((id) => {
      const idx = parseInt(id, 10) - 1;
      setUserAvatar(AVATARS[idx] || '🦁');
    });
  }, []);

  const confirmLogout = async () => {
    await clearAll();
    setLogoutConfirmVisible(false);
    router.replace('/login');
  };

  const handleDeposit = () => {
    showToast(`Deposit of $${depositAmount} processed successfully!`, 'success');
    setDepositAmount('');
    setDepositModal(false);
  };

  const handleWithdraw = () => {
    showToast(`Withdrawal of $${withdrawAmount} processed successfully!`, 'success');
    setWithdrawAmount('');
    setWithdrawModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.profileRow}>
          <Text style={styles.profileAvatar}>{userAvatar}</Text>
          <View>
            <Text style={styles.profileName}>{gameName}</Text>
            <Text style={styles.profileStatus}>Active Player</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Financial</Text>
        <Pressable
          style={styles.menuItem}
          onPress={() => setDepositModal(true)}
        >
          <View style={[styles.iconWrapper, styles.iconGreen]}>
            <Ionicons name="wallet" size={20} color="#16a34a" />
          </View>
          <Text style={styles.menuText}>Deposit</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => setWithdrawModal(true)}
        >
          <View style={[styles.iconWrapper, styles.iconOrange]}>
            <Ionicons name="card" size={20} color="#ea580c" />
          </View>
          <Text style={styles.menuText}>Withdraw</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <Pressable
          style={styles.menuItem}
          onPress={() => router.push('/setup')}
        >
          <View style={[styles.iconWrapper, styles.iconBlue]}>
            <Ionicons name="person" size={20} color="#2563eb" />
          </View>
          <Text style={styles.menuText}>My Account</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => setLogoutConfirmVisible(true)}>
          <View style={[styles.iconWrapper, styles.iconRed]}>
            <Ionicons name="log-out" size={20} color="#dc2626" />
          </View>
          <Text style={[styles.menuText, styles.logoutText]}>Log Out</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>
      </View>

      <Modal visible={depositModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Deposit Funds</Text>
            <Text style={styles.modalDesc}>
              Add money to your account balance
            </Text>
            <Text style={styles.modalLabel}>Amount</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="decimal-pad"
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => setDepositModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalConfirm,
                  (!depositAmount || parseFloat(depositAmount) <= 0) &&
                    styles.modalConfirmDisabled,
                ]}
                onPress={handleDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                <Text style={styles.modalConfirmText}>
                  Deposit ${depositAmount || '0.00'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={withdrawModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Withdraw Funds</Text>
            <Text style={styles.modalDesc}>
              Transfer money from your account to your bank
            </Text>
            <Text style={styles.modalLabel}>Amount</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="decimal-pad"
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => setWithdrawModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalConfirm,
                  (!withdrawAmount || parseFloat(withdrawAmount) <= 0) &&
                    styles.modalConfirmDisabled,
                ]}
                onPress={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
              >
                <Text style={styles.modalConfirmText}>
                  Withdraw ${withdrawAmount || '0.00'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={logoutConfirmVisible}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
        confirmStyle="destructive"
        onConfirm={confirmLogout}
        onCancel={() => setLogoutConfirmVisible(false)}
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileAvatar: {
    fontSize: 48,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  profileStatus: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconGreen: {
    backgroundColor: '#dcfce7',
  },
  iconOrange: {
    backgroundColor: '#ffedd5',
  },
  iconBlue: {
    backgroundColor: '#dbeafe',
  },
  iconRed: {
    backgroundColor: '#fee2e2',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  logoutText: {
    color: '#dc2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modalConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  modalConfirmDisabled: {
    opacity: 0.5,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
