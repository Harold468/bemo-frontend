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
import { setInitialDeposit, setPaymentMethod } from '@/lib/storage';
import { useToastContext } from '@/contexts/ToastContext';

export default function DepositScreen() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethodState] = useState<'bank' | 'mobile'>(
    'bank'
  );
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    if (paymentMethod === 'bank') {
      if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
        showToast('Please fill in all card details', 'error');
        return;
      }
    } else {
      if (!phoneNumber) {
        showToast('Please enter your phone number', 'error');
        return;
      }
    }
    try {
      await setInitialDeposit(amount);
      await setPaymentMethod(paymentMethod);
      router.replace('/(tabs)');
      showToast(
        `Processing ${paymentMethod === 'bank' ? 'card' : 'mobile money'} payment of $${amount}...`,
        'success'
      );
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Initial Deposit</Text>
        <Text style={styles.subtitle}>Add funds to start playing</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Deposit Amount</Text>
          <View style={styles.amountRow}>
            <Text style={styles.dollar}>$</Text>
            <TextInput
              style={[styles.input, styles.amountInput]}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.tabs}>
            <Pressable
              style={[
                styles.tab,
                paymentMethod === 'bank' && styles.tabActive,
              ]}
              onPress={() => setPaymentMethodState('bank')}
            >
              <Text
                style={[
                  styles.tabText,
                  paymentMethod === 'bank' && styles.tabTextActive,
                ]}
              >
                Bank Card
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tab,
                paymentMethod === 'mobile' && styles.tabActive,
              ]}
              onPress={() => setPaymentMethodState('mobile')}
            >
              <Text
                style={[
                  styles.tabText,
                  paymentMethod === 'mobile' && styles.tabTextActive,
                ]}
              >
                Mobile Money
              </Text>
            </Pressable>
          </View>

          {paymentMethod === 'bank' && (
            <View style={styles.form}>
              <Text style={styles.fieldLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="JOHN DOE"
                placeholderTextColor="#9ca3af"
                value={cardName}
                onChangeText={(t) => setCardName(t.toUpperCase())}
              />
              <Text style={styles.fieldLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#9ca3af"
                value={cardNumber}
                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                keyboardType="number-pad"
                maxLength={19}
              />
              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.fieldLabel}>Expiry</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#9ca3af"
                    value={cardExpiry}
                    onChangeText={(t) => setCardExpiry(formatExpiry(t))}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.fieldLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#9ca3af"
                    value={cardCVV}
                    onChangeText={(t) =>
                      setCardCVV(t.replace(/\D/g, '').substring(0, 3))
                    }
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                </View>
              </View>
            </View>
          )}

          {paymentMethod === 'mobile' && (
            <View style={styles.form}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="024 123 4567"
                placeholderTextColor="#9ca3af"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          )}
        </View>
      </ScrollView>

      <Pressable style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Complete Deposit</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dollar: {
    position: 'absolute',
    left: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  amountInput: {
    paddingLeft: 40,
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#9333ea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  tabTextActive: {
    color: 'white',
  },
  form: {
    gap: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  half: {
    flex: 1,
    gap: 4,
  },
  button: {
    backgroundColor: '#9333ea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
