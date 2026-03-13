import { useLocalSearchParams, useRouter } from 'expo-router';
import { TicTacToeGame } from '@/components/TicTacToeGame';
import { CoinTossGame } from '@/components/CoinTossGame';
import { CupShuffleGame } from '@/components/CupShuffleGame';
import { useToastContext } from '@/contexts/ToastContext';

export default function GameScreen() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const params = useLocalSearchParams<{
    gameType: string;
    betAmount: string;
    opponentName: string;
    opponentAvatar: string;
  }>();

  const gameType = params.gameType || 'tictactoe';
  const betAmount = parseFloat(params.betAmount || '0');
  const opponentName = params.opponentName || 'Player1';
  const opponentAvatar = params.opponentAvatar || '🦁';

  const handleGameEnd = (
    result: 'win' | 'loss' | 'draw',
    amountWon?: number
  ) => {
    const msg =
      result === 'win'
        ? `You won $${amountWon ?? betAmount}!`
        : result === 'loss'
          ? `You lost $${betAmount}`
          : "It's a draw!";
    const toastType = result === 'win' ? 'success' : result === 'loss' ? 'error' : 'info';
    setTimeout(() => {
      router.back();
      setTimeout(() => showToast(msg, toastType), 100);
    }, 100);
  };

  if (gameType === 'tictactoe') {
    return (
      <TicTacToeGame
        betAmount={betAmount}
        opponentName={opponentName}
        opponentAvatar={opponentAvatar}
        onGameEnd={handleGameEnd}
      />
    );
  }

  if (gameType === 'cointoss') {
    return (
      <CoinTossGame
        betAmount={betAmount}
        onGameEnd={(result, amount) =>
          handleGameEnd(result, result === 'win' ? amount : undefined)
        }
      />
    );
  }

  if (gameType === 'cupshuffle') {
    return (
      <CupShuffleGame
        betAmount={betAmount}
        onGameEnd={(result, amount) =>
          handleGameEnd(result, result === 'win' ? amount : undefined)
        }
      />
    );
  }

  return null;
}
