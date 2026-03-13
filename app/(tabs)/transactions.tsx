import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const transactions = [
  { id: 1, date: 'Mar 12, 2026', type: 'deposit', description: 'Deposit via Bank', amount: 500 },
  { id: 2, date: 'Mar 11, 2026', type: 'game', description: 'Game vs Player1', amount: 50 },
  { id: 3, date: 'Mar 10, 2026', type: 'game', description: 'Game vs Player2', amount: -30 },
  { id: 4, date: 'Mar 9, 2026', type: 'withdraw', description: 'Withdrawal to Bank', amount: -200 },
  { id: 5, date: 'Mar 9, 2026', type: 'game', description: 'Game vs Player3', amount: 75 },
  { id: 6, date: 'Mar 8, 2026', type: 'deposit', description: 'Deposit via Card', amount: 300 },
  { id: 7, date: 'Mar 7, 2026', type: 'game', description: 'Game vs Player5', amount: -45 },
  { id: 8, date: 'Mar 6, 2026', type: 'game', description: 'Game vs Player6', amount: 60 },
];

export default function TransactionsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.subtitle}>View your transaction history</Text>
      </View>

      <View style={styles.card}>
        {transactions.map((tx) => (
          <View key={tx.id} style={styles.row}>
            <Text style={styles.cellDate}>{tx.date}</Text>
            <View
              style={[
                styles.badge,
                tx.type === 'deposit' && styles.badgeDeposit,
                tx.type === 'withdraw' && styles.badgeWithdraw,
                tx.type === 'game' && styles.badgeGame,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  tx.type === 'game' ? { color: '#374151' } : styles.badgeTextWhite,
                ]}
              >
                {tx.type}
              </Text>
            </View>
            <Text style={styles.cellDesc} numberOfLines={1}>
              {tx.description}
            </Text>
            <Text
              style={[
                styles.cellAmount,
                tx.amount > 0 ? styles.amountPos : styles.amountNeg,
              ]}
            >
              {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
            </Text>
          </View>
        ))}
      </View>
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cellDate: {
    width: 90,
    fontSize: 12,
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  badgeDeposit: {
    backgroundColor: '#3b82f6',
  },
  badgeWithdraw: {
    backgroundColor: '#ef4444',
  },
  badgeGame: {
    backgroundColor: '#e5e7eb',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  badgeTextWhite: {
    color: 'white',
  },
  cellDesc: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  cellAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountPos: {
    color: '#16a34a',
  },
  amountNeg: {
    color: '#dc2626',
  },
});
