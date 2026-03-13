import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface CoinTossGameProps {
  betAmount: number;
  onGameEnd: (result: 'win' | 'loss', amountWon: number) => void;
}

export function CoinTossGame({ betAmount, onGameEnd }: CoinTossGameProps) {
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(
    null
  );
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
  }));

  const flipCoin = () => {
    if (!selectedSide || isFlipping) return;

    setIsFlipping(true);
    setResult(null);
    rotation.value = 0;

    rotation.value = withTiming(720, { duration: 2000 });

    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(coinResult);
      setIsFlipping(false);
      setGameComplete(true);

      if (coinResult === selectedSide) {
        onGameEnd('win', betAmount * 2);
      } else {
        onGameEnd('loss', 0);
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Coin Toss</Text>
          <View style={styles.betBadge}>
            <Ionicons name="cash" size={16} color="#b45309" />
            <Text style={styles.betAmount}>${betAmount}</Text>
          </View>
        </View>

        <View style={styles.coinContainer}>
          <Animated.View style={[styles.coin, animatedStyle]}>
            <Text style={styles.coinText}>
              {!result && !isFlipping && '?'}
              {isFlipping && '🪙'}
              {result && !isFlipping && (result === 'heads' ? 'H' : 'T')}
            </Text>
          </Animated.View>
        </View>

        {!gameComplete && (
          <>
            <Text style={styles.prompt}>Choose your side:</Text>
            <View style={styles.buttonsRow}>
              <Pressable
                style={[
                  styles.sideButton,
                  selectedSide === 'heads' && styles.sideButtonActive,
                ]}
                onPress={() => setSelectedSide('heads')}
                disabled={isFlipping}
              >
                <Text
                  style={[
                    styles.sideButtonText,
                    selectedSide === 'heads' && styles.sideButtonTextActive,
                  ]}
                >
                  Heads
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.sideButton,
                  selectedSide === 'tails' && styles.sideButtonActive,
                ]}
                onPress={() => setSelectedSide('tails')}
                disabled={isFlipping}
              >
                <Text
                  style={[
                    styles.sideButtonText,
                    selectedSide === 'tails' && styles.sideButtonTextActive,
                  ]}
                >
                  Tails
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.flipButton,
                (!selectedSide || isFlipping) && styles.flipButtonDisabled,
              ]}
              onPress={flipCoin}
              disabled={!selectedSide || isFlipping}
            >
              <Text style={styles.flipButtonText}>
                {isFlipping ? 'Flipping...' : 'Flip Coin'}
              </Text>
            </Pressable>
          </>
        )}

        {gameComplete && result && (
          <View style={styles.result}>
            <Text style={styles.resultLabel}>
              Result: <Text style={styles.resultValue}>{result}</Text>
            </Text>
            <Text
              style={[
                styles.resultAmount,
                result === selectedSide ? styles.win : styles.loss,
              ]}
            >
              {result === selectedSide
                ? `You Won $${betAmount * 2}!`
                : `You Lost $${betAmount}`}
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
    backgroundColor: '#fffbeb',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  betAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  coinContainer: {
    marginBottom: 32,
  },
  coin: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  prompt: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  sideButton: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  sideButtonActive: {
    backgroundColor: '#9333ea',
    borderColor: '#9333ea',
  },
  sideButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  sideButtonTextActive: {
    color: 'white',
  },
  flipButton: {
    paddingHorizontal: 48,
    paddingVertical: 24,
    borderRadius: 12,
    backgroundColor: '#9333ea',
  },
  flipButtonDisabled: {
    opacity: 0.5,
  },
  flipButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  result: {
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 20,
    color: '#374151',
    marginBottom: 8,
  },
  resultValue: {
    fontWeight: 'bold',
  },
  resultAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  win: {
    color: '#16a34a',
  },
  loss: {
    color: '#dc2626',
  },
});
