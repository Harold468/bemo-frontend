import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getGameName, getAvatarId, AVATARS } from '@/lib/storage';
import { GameBettingModal } from '@/components/GameBettingModal';

const userBalance = 1250.75;

const recentGames = [
  { id: 1, date: 'Mar 11', opponent: 'Player1', result: 'win', amount: 50 },
  { id: 2, date: 'Mar 10', opponent: 'Player2', result: 'loss', amount: -30 },
  { id: 3, date: 'Mar 9', opponent: 'Player3', result: 'win', amount: 75 },
  { id: 4, date: 'Mar 8', opponent: 'Player4', result: 'draw', amount: 0 },
];

const participants = [
  { id: 1, name: 'Player1', avatar: '🦁', status: 'online' },
  { id: 2, name: 'Player2', avatar: '🐯', status: 'offline' },
  { id: 3, name: 'Player3', avatar: '🐻', status: 'online' },
  { id: 4, name: 'Player4', avatar: '🦊', status: 'offline' },
  { id: 5, name: 'Player5', avatar: '🐼', status: 'online' },
];

const games = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    icon: 'grid-outline' as const,
    color: ['#a855f7', '#7c3aed'],
    description: 'Multiplayer',
  },
  {
    id: 'cointoss',
    name: 'Coin Toss',
    icon: 'cash-outline' as const,
    color: ['#f59e0b', '#d97706'],
    description: 'Win 2x',
  },
  {
    id: 'cupshuffle',
    name: 'Cup Shuffle',
    icon: 'wine-outline' as const,
    color: ['#10b981', '#059669'],
    description: 'Win 3x',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [gameName, setGameNameState] = useState('Player');
  const [userAvatar, setUserAvatar] = useState('🦁');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showBettingModal, setShowBettingModal] = useState(false);

  useEffect(() => {
    getGameName().then(setGameNameState);
    getAvatarId().then((id) => {
      const idx = parseInt(id, 10) - 1;
      setUserAvatar(AVATARS[idx] || '🦁');
    });
  }, []);

  const handleGameClick = (gameId: string) => {
    setSelectedGame(gameId);
    setShowBettingModal(true);
  };

  const handleStartGame = (betAmount: number, participant?: {
    id: number;
    name: string;
    avatar: string;
    status: string;
  }) => {
    setShowBettingModal(false);
    router.push({
      pathname: '/game',
      params: {
        gameType: selectedGame!,
        betAmount: betAmount.toString(),
        opponentName: participant?.name || '',
        opponentAvatar: participant?.avatar || '',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
      <View style={styles.header}>
        <Text style={styles.avatar}>{userAvatar}</Text>
        <View>
          <Text style={styles.welcome}>Welcome, {gameName}!</Text>
          <Text style={styles.subtitle}>Good to see you back</Text>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>${userBalance.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Choose a Game</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamesScroll}>
        {games.map((game) => (
          <Pressable
            key={game.id}
            style={[styles.gameCard, { backgroundColor: game.color[0] }]}
            onPress={() => handleGameClick(game.id)}
          >
            <Ionicons name={game.icon} size={48} color="white" />
            <Text style={styles.gameName}>{game.name}</Text>
            <Text style={styles.gameDesc}>{game.description}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Latest Games</Text>
        {recentGames.map((game) => (
          <View key={game.id} style={styles.tableRow}>
            <Text style={styles.cell}>{game.date}</Text>
            <Text style={styles.cell}>{game.opponent}</Text>
            <View
              style={[
                styles.badge,
                game.result === 'win' && styles.badgeWin,
                game.result === 'loss' && styles.badgeLoss,
                game.result === 'draw' && styles.badgeDraw,
              ]}
            >
              <Text style={styles.badgeText}>{game.result}</Text>
            </View>
            <Text
              style={[
                styles.cellAmount,
                game.amount > 0 && styles.amountWin,
                game.amount < 0 && styles.amountLoss,
              ]}
            >
              {game.amount > 0 ? '+' : ''}
              {game.amount !== 0 ? `$${Math.abs(game.amount)}` : '-'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Participants</Text>
        {participants.map((p) => (
          <View key={p.id} style={styles.participantRow}>
            <Text style={styles.participantAvatar}>{p.avatar}</Text>
            <Text style={styles.participantName}>{p.name}</Text>
            <View
              style={[
                styles.statusDot,
                p.status === 'online' ? styles.dotOnline : styles.dotOffline,
              ]}
            />
            <Text style={styles.statusText}>{p.status}</Text>
          </View>
        ))}
      </View>

      {showBettingModal && selectedGame && (
        <GameBettingModal
          visible={showBettingModal}
          onClose={() => setShowBettingModal(false)}
          gameType={selectedGame as 'tictactoe' | 'cointoss' | 'cupshuffle'}
          onStartGame={handleStartGame}
        />
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    fontSize: 40,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  balanceCard: {
    backgroundColor: '#6d28d9',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  gamesScroll: {
    marginBottom: 24,
    marginHorizontal: -16,
  },
  gameCard: {
    width: 160,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  gameDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
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
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  cellAmount: {
    fontSize: 14,
    color: '#6b7280',
  },
  amountWin: {
    color: '#16a34a',
  },
  amountLoss: {
    color: '#dc2626',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeWin: {
    backgroundColor: '#22c55e',
  },
  badgeLoss: {
    backgroundColor: '#ef4444',
  },
  badgeDraw: {
    backgroundColor: '#e5e7eb',
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  participantAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  participantName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  dotOnline: {
    backgroundColor: '#22c55e',
  },
  dotOffline: {
    backgroundColor: '#d1d5db',
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
