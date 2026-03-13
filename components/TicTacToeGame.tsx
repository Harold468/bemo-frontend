import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getGameName, getAvatarId, AVATARS } from '@/lib/storage';

type Cell = 'X' | 'O' | null;

interface TicTacToeGameProps {
  betAmount: number;
  opponentName: string;
  opponentAvatar: string;
  onGameEnd: (result: 'win' | 'loss' | 'draw') => void;
}

export function TicTacToeGame({
  betAmount,
  opponentName,
  opponentAvatar,
  onGameEnd,
}: TicTacToeGameProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameName, setGameName] = useState('Player');
  const [userAvatar, setUserAvatar] = useState('🦁');

  useEffect(() => {
    getGameName().then(setGameName);
    getAvatarId().then((id) => {
      const idx = parseInt(id, 10) - 1;
      setUserAvatar(AVATARS[idx] || '🦁');
    });
  }, []);

  const calculateWinner = (squares: Cell[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const makeOpponentMove = (currentBoard: Cell[]) => {
    const emptyIndices = currentBoard
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null) as number[];

    if (emptyIndices.length > 0) {
      const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const newBoard = [...currentBoard];
      newBoard[randomIndex] = 'O';
      setBoard(newBoard);

      const winner = calculateWinner(newBoard);
      if (winner) {
        setGameOver(true);
        onGameEnd('loss');
      } else if (newBoard.every((cell) => cell !== null)) {
        setGameOver(true);
        onGameEnd('draw');
      } else {
        setIsXNext(true);
      }
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winner = calculateWinner(newBoard);
    if (winner) {
      setGameOver(true);
      onGameEnd(winner === 'X' ? 'win' : 'loss');
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameOver(true);
      onGameEnd('draw');
    } else {
      setIsXNext(false);
      if (isXNext) {
        setTimeout(() => makeOpponentMove(newBoard), 500);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.player}>
          <Text style={styles.avatar}>{userAvatar}</Text>
          <View>
            <Text style={styles.name}>{gameName}</Text>
            <Text style={styles.role}>You (X)</Text>
          </View>
        </View>
        <View style={styles.betBadge}>
          <Text style={styles.betLabel}>Bet Amount</Text>
          <Text style={styles.betAmount}>${betAmount}</Text>
        </View>
        <View style={[styles.player, styles.playerRight]}>
          <View style={styles.playerInfo}>
            <Text style={styles.name}>{opponentName}</Text>
            <Text style={styles.role}>Opponent (O)</Text>
          </View>
          <Text style={styles.avatar}>{opponentAvatar}</Text>
        </View>
      </View>

      <View style={styles.board}>
        <View style={styles.row}>
          {[0, 1, 2].map((i) => (
            <Pressable
              key={i}
              style={[
                styles.cell,
                (gameOver || board[i] !== null || !isXNext) && styles.cellDisabled,
              ]}
              onPress={() => handleClick(i)}
              disabled={gameOver || board[i] !== null || !isXNext}
            >
              {board[i] === 'X' && (
                <Ionicons name="close" size={48} color="#9333ea" />
              )}
              {board[i] === 'O' && (
                <Ionicons name="ellipse-outline" size={40} color="#4f46e5" />
              )}
            </Pressable>
          ))}
        </View>
        <View style={styles.row}>
          {[3, 4, 5].map((i) => (
            <Pressable
              key={i}
              style={[
                styles.cell,
                (gameOver || board[i] !== null || !isXNext) && styles.cellDisabled,
              ]}
              onPress={() => handleClick(i)}
              disabled={gameOver || board[i] !== null || !isXNext}
            >
              {board[i] === 'X' && (
                <Ionicons name="close" size={48} color="#9333ea" />
              )}
              {board[i] === 'O' && (
                <Ionicons name="ellipse-outline" size={40} color="#4f46e5" />
              )}
            </Pressable>
          ))}
        </View>
        <View style={styles.row}>
          {[6, 7, 8].map((i) => (
            <Pressable
              key={i}
              style={[
                styles.cell,
                (gameOver || board[i] !== null || !isXNext) && styles.cellDisabled,
              ]}
              onPress={() => handleClick(i)}
              disabled={gameOver || board[i] !== null || !isXNext}
            >
              {board[i] === 'X' && (
                <Ionicons name="close" size={48} color="#9333ea" />
              )}
              {board[i] === 'O' && (
                <Ionicons name="ellipse-outline" size={40} color="#4f46e5" />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {!gameOver && (
        <Text style={styles.turnText}>
          {isXNext ? 'Your turn' : `${opponentName}'s turn...`}
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerRight: {
    flexDirection: 'row-reverse',
  },
  playerInfo: {
    alignItems: 'flex-end',
  },
  avatar: {
    fontSize: 28,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  role: {
    fontSize: 12,
    color: '#6b7280',
  },
  betBadge: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  betLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  betAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  board: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  cellDisabled: {
    opacity: 0.5,
  },
  turnText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
  },
});
