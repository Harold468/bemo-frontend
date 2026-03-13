import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const stats = [
  { metric: 'Total Games', value: '24' },
  { metric: 'Games Won', value: '14' },
  { metric: 'Games Lost', value: '8' },
  { metric: 'Games Drawn', value: '2' },
  { metric: 'Win Rate', value: '58.3%' },
  { metric: 'Total Winnings', value: '$850' },
  { metric: 'Total Losses', value: '$315' },
  { metric: 'Net Profit', value: '$535' },
  { metric: 'Avg Win Amount', value: '$60.71' },
  { metric: 'Avg Loss Amount', value: '$39.38' },
  { metric: 'Best Opponent', value: 'Player3' },
  { metric: 'Current Streak', value: '2 Wins' },
];

const opponentStats = [
  { opponent: 'Player1', games: 5, won: 3, lost: 2, drawn: 0 },
  { opponent: 'Player2', games: 4, won: 2, lost: 1, drawn: 1 },
  { opponent: 'Player3', games: 6, won: 4, lost: 2, drawn: 0 },
  { opponent: 'Player4', games: 3, won: 2, lost: 1, drawn: 0 },
  { opponent: 'Player5', games: 4, won: 2, lost: 1, drawn: 1 },
  { opponent: 'Player6', games: 2, won: 1, lost: 1, drawn: 0 },
];

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Your gaming performance</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overall Statistics</Text>
        {stats.map((stat, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cellMetric}>{stat.metric}</Text>
            <Text style={styles.cellValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Performance vs Opponents</Text>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.headerCell}>Opponent</Text>
          <Text style={styles.headerCellCenter}>W</Text>
          <Text style={styles.headerCellCenter}>L</Text>
          <Text style={styles.headerCellCenter}>D</Text>
          <Text style={styles.headerCellRight}>Total</Text>
        </View>
        {opponentStats.map((stat) => (
          <View key={stat.opponent} style={styles.row}>
            <Text style={styles.cellMetric}>{stat.opponent}</Text>
            <Text style={[styles.cellCenter, styles.winText]}>{stat.won}</Text>
            <Text style={[styles.cellCenter, styles.lossText]}>{stat.lost}</Text>
            <Text style={[styles.cellCenter, styles.drawText]}>{stat.drawn}</Text>
            <Text style={styles.cellRight}>{stat.games}</Text>
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
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerRow: {
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  cellMetric: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  cellValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  headerCellCenter: {
    width: 32,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  headerCellRight: {
    width: 48,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'right',
  },
  cellCenter: {
    width: 32,
    fontSize: 14,
    textAlign: 'center',
  },
  cellRight: {
    width: 48,
    fontSize: 14,
    textAlign: 'right',
    color: '#374151',
  },
  winText: {
    color: '#16a34a',
  },
  lossText: {
    color: '#dc2626',
  },
  drawText: {
    color: '#6b7280',
  },
});
