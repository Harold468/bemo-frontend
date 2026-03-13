import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToastContext } from '@/contexts/ToastContext';

interface Participant {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface GameBettingModalProps {
  visible: boolean;
  onClose: () => void;
  gameType: 'tictactoe' | 'cointoss' | 'cupshuffle';
  onStartGame: (betAmount: number, participant?: Participant) => void;
}

const allParticipants: Participant[] = [
  { id: 1, name: 'Player1', avatar: '🦁', status: 'online' },
  { id: 2, name: 'Player2', avatar: '🐯', status: 'online' },
  { id: 3, name: 'Player3', avatar: '🐻', status: 'online' },
  { id: 4, name: 'Player4', avatar: '🦊', status: 'offline' },
  { id: 5, name: 'Player5', avatar: '🐼', status: 'online' },
  { id: 6, name: 'Player6', avatar: '🐨', status: 'offline' },
  { id: 7, name: 'Player7', avatar: '🦅', status: 'online' },
  { id: 8, name: 'Player8', avatar: '🐺', status: 'online' },
];

export function GameBettingModal({
  visible,
  onClose,
  gameType,
  onStartGame,
}: GameBettingModalProps) {
  const { showToast } = useToastContext();
  const [betAmount, setBetAmount] = useState('');
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isMultiplayer = gameType === 'tictactoe';

  const gameNames = {
    tictactoe: 'Tic Tac Toe',
    cointoss: 'Coin Toss',
    cupshuffle: 'Cup Shuffle',
  };

  const filteredParticipants = allParticipants.filter(
    (p) =>
      p.status === 'online' &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartGame = () => {
    const amount = parseFloat(betAmount);

    if (!amount || amount < 1 || amount > 1000) {
      showToast('Please enter a bet amount between $1 and $1000', 'error');
      return;
    }

    if (isMultiplayer && !selectedParticipant) {
      showToast('Please select a participant to play with', 'error');
      return;
    }

    onStartGame(amount, selectedParticipant || undefined);
    setBetAmount('');
    setSelectedParticipant(null);
    setSearchQuery('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{gameNames[gameType]}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color="#374151" />
            </Pressable>
          </View>

          <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.section}>
              <Text style={styles.label}>Bet Amount</Text>
              <View style={styles.inputRow}>
                <Text style={styles.dollar}>$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount (1-1000)"
                  placeholderTextColor="#9ca3af"
                  value={betAmount}
                  onChangeText={setBetAmount}
                  keyboardType="number-pad"
                />
              </View>
              <Text style={styles.hint}>Minimum: $1 | Maximum: $1000</Text>
            </View>

            {isMultiplayer && (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>Select Opponent</Text>
                  <View style={styles.searchRow}>
                    <Ionicons
                      name="search"
                      size={20}
                      color="#6b7280"
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={[styles.input, styles.searchInput]}
                      placeholder="Search participants..."
                      placeholderTextColor="#9ca3af"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                </View>

                <ScrollView style={styles.participantList} nestedScrollEnabled>
                  {filteredParticipants.map((participant) => (
                    <Pressable
                      key={participant.id}
                      style={[
                        styles.participantItem,
                        selectedParticipant?.id === participant.id &&
                          styles.participantSelected,
                      ]}
                      onPress={() => setSelectedParticipant(participant)}
                    >
                      <Text style={styles.participantAvatar}>
                        {participant.avatar}
                      </Text>
                      <Text style={styles.participantName}>
                        {participant.name}
                      </Text>
                      <View style={styles.onlineBadge}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.onlineText}>Online</Text>
                      </View>
                    </Pressable>
                  ))}
                  {filteredParticipants.length === 0 && (
                    <Text style={styles.emptyText}>
                      No online participants found
                    </Text>
                  )}
                </ScrollView>

                {selectedParticipant && (
                  <View style={styles.selectedPreview}>
                    <Text style={styles.selectedAvatar}>
                      {selectedParticipant.avatar}
                    </Text>
                    <View>
                      <Text style={styles.selectedLabel}>
                        Playing against:
                      </Text>
                      <Text style={styles.selectedName}>
                        {selectedParticipant.name}
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {gameType === 'tictactoe' &&
                  '🎮 Multiplayer game - Winner takes all!'}
                {gameType === 'cointoss' &&
                  '🪙 Win 2x your bet if you guess correctly!'}
                {gameType === 'cupshuffle' &&
                  '🏆 Win 3x your bet if you find the coin!'}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.startButton} onPress={handleStartGame}>
              <Text style={styles.startText}>Start Game</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  body: {
    padding: 16,
    maxHeight: 400,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dollar: {
    position: 'absolute',
    left: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    paddingLeft: 36,
    fontSize: 16,
    color: '#111827',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 40,
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  participantList: {
    maxHeight: 200,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  participantSelected: {
    backgroundColor: '#f3e8ff',
    borderLeftWidth: 4,
    borderLeftColor: '#9333ea',
  },
  participantAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  participantName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  onlineText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
    color: '#6b7280',
    fontSize: 14,
  },
  selectedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    marginBottom: 16,
  },
  selectedAvatar: {
    fontSize: 24,
  },
  selectedLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  infoBox: {
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  startButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
