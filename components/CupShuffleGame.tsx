import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CupShuffleGameProps {
  betAmount: number;
  onGameEnd: (result: 'win' | 'loss', amountWon: number) => void;
}

export function CupShuffleGame({ betAmount, onGameEnd }: CupShuffleGameProps) {
  const [coinPosition, setCoinPosition] = useState(1);
  const [selectedCup, setSelectedCup] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showCoin, setShowCoin] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCoin(false);
      setIsShuffling(true);
      const shuffleTimer = setTimeout(() => {
        setCoinPosition(Math.floor(Math.random() * 3));
        setIsShuffling(false);
      }, 3000);
      return () => clearTimeout(shuffleTimer);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCupClick = (cupIndex: number) => {
    if (isShuffling || gameComplete || selectedCup !== null) return;

    setSelectedCup(cupIndex);
    setShowCoin(true);
    setGameComplete(true);

    if (cupIndex === coinPosition) {
      onGameEnd('win', betAmount * 3);
    } else {
      onGameEnd('loss', 0);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Cup Shuffle</Text>
          <View style={styles.betBadge}>
            <Text style={styles.betAmount}>${betAmount}</Text>
          </View>
          <Text style={styles.hint}>
            {isShuffling ? 'Watch carefully...' : gameComplete ? '' : 'Pick a cup!'}
          </Text>
        </View>

        <View style={styles.cupsRow}>
          {[0, 1, 2].map((cupIndex) => (
            <View key={cupIndex} style={styles.cupWrapper}>
              <Pressable
                style={[
                  styles.cup,
                  selectedCup === cupIndex && styles.cupSelected,
                ]}
                onPress={() => handleCupClick(cupIndex)}
                disabled={isShuffling || gameComplete}
              />
              {showCoin && cupIndex === coinPosition && (
                <View style={styles.coin}>
                  <Text style={styles.coinEmoji}>💰</Text>
                </View>
              )}
              {!showCoin && <View style={styles.coinPlaceholder} />}
            </View>
          ))}
        </View>

        {gameComplete && selectedCup !== null && (
          <View style={styles.result}>
            <Text
              style={[
                styles.resultAmount,
                selectedCup === coinPosition ? styles.win : styles.loss,
              ]}
            >
              {selectedCup === coinPosition
                ? `You Won $${betAmount * 3}!`
                : `You Lost $${betAmount}`}
            </Text>
            <Text style={styles.resultHint}>
              The coin was under cup #{coinPosition + 1}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    padding: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  betBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginBottom: 8,
  },
  betAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#047857',
  },
  hint: {
    fontSize: 14,
    color: '#6b7280',
  },
  cupsRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
    alignItems: 'flex-end',
  },
  cupWrapper: {
    alignItems: 'center',
  },
  cup: {
    width: 64,
    height: 80,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: '#ef4444',
  },
  cupSelected: {
    borderWidth: 4,
    borderColor: '#eab308',
  },
  coin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  coinEmoji: {
    fontSize: 16,
  },
  coinPlaceholder: {
    width: 32,
    height: 32,
    marginTop: -16,
  },
  result: {
    alignItems: 'center',
  },
  resultAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultHint: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  win: {
    color: '#16a34a',
  },
  loss: {
    color: '#dc2626',
  },
});
