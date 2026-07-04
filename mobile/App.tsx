import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Provider } from 'react-redux';

import { getColorByIndex } from './src/constants/colors';
import store from './src/store';
import { useAppDispatch, useAppSelector } from './src/store/hooks';
import {
  addPlayer,
  removePlayer,
  setEditStatus,
  setPlayerFormSubmit,
  SetDraftValueChange,
} from './src/store/features/players.feature';
import {
  addNumberOfGroups,
  decreaseNumberOfGroupsByOne,
  getPlayersForTeams,
  increaseNumberOfGroupsByOne,
  setMaxScore,
  setTeamEditStatus,
  setTeamFormSubmit,
  SetTeamDraftValueChange,
} from './src/store/features/teams.feature';
import type { Player, Team } from './src/types';
import generateNewId from './src/utils/generateNewId';

type Screen = 'setup' | 'split' | 'game';
type HoldDirection = 'back' | 'forward';
type ButtonVariant = 'solid' | 'ghost';

type SetupScreenProps = {
  onStart: () => void;
};

type ConfirmStartModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

type SplitScreenProps = {
  onComplete: () => void;
};

type GameScreenProps = {
  onGoHome: () => void;
};

type PlayerRowProps = {
  player: Player;
  color: string;
};

type TeamCardProps = {
  team: Team;
  color: string;
  maxScore: number;
};

type ScoreTrackerProps = {
  color: string;
  maxScore: number;
};

type ScoreButtonProps = {
  label: string;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

type PointInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  color: string;
};

type ProgressBarProps = {
  value: number;
  color: string;
};

type EmptyStateProps = {
  text: string;
  compact?: boolean;
};

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
};

const newId = generateNewId();

function shufflePlayers(players: Player[]): Player[] {
  return [...players].sort(() => Math.random() - 0.5);
}

function AppContent() {
  const players = useAppSelector((state) => state.players);
  const [screen, setScreen] = useState<Screen>('setup');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {screen === 'setup' ? (
          <SetupScreen
            onStart={() => {
              if (players.length > 0) {
                setScreen('split');
              }
            }}
          />
        ) : null}
        {screen === 'split' ? <SplitScreen onComplete={() => setScreen('game')} /> : null}
        {screen === 'game' ? <GameScreen onGoHome={() => setScreen('setup')} /> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SetupScreen({ onStart }: SetupScreenProps) {
  const players = useAppSelector((state) => state.players);
  const [activeStep, setActiveStep] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const stepContent: ReactElement[] = [
    <PlayersStep key="players" />,
    <GroupsStep key="groups" />,
    <TeamsStep key="teams" />,
    <ScoreStep key="score" />,
  ];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.heroBlock}>
        <Text style={styles.eyebrow}>Expo Mobile Port</Text>
        <Text style={styles.heroTitle}>Team Maker</Text>
        <Text style={styles.heroSubtitle}>
          Same team-building flow, rebuilt with native components for iOS and Android.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.stepDots}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[styles.stepDot, activeStep === index ? styles.stepDotActive : null]}
            />
          ))}
        </View>

        <View style={styles.stepBody}>{stepContent[activeStep] ?? null}</View>

        <View style={styles.stepActions}>
          <PrimaryButton
            label="Back"
            variant="ghost"
            disabled={activeStep === 0}
            onPress={() => setActiveStep((current) => Math.max(0, current - 1))}
          />
          <PrimaryButton
            label={activeStep === 3 ? 'Start' : 'Next'}
            disabled={activeStep === 3 && players.length === 0}
            onPress={() => {
              if (activeStep === 3) {
                setIsModalVisible(true);
              } else {
                setActiveStep((current) => Math.min(3, current + 1));
              }
            }}
          />
        </View>
      </View>

      <ConfirmStartModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={() => {
          setIsModalVisible(false);
          onStart();
        }}
      />
    </View>
  );
}

function PlayersStep() {
  const players = useAppSelector((state) => state.players);
  const dispatch = useAppDispatch();
  const [playerName, setPlayerName] = useState('');

  const handleAddPlayer = () => {
    const normalizedName = playerName.trim();

    if (!normalizedName) {
      return;
    }

    dispatch(
      addPlayer({
        name: normalizedName,
        id: newId(),
        isEdit: false,
        draft: '',
      })
    );
    setPlayerName('');
  };

  return (
    <View style={styles.stepSection}>
      <Text style={styles.sectionTitle}>Add players</Text>
      <Text style={styles.sectionHint}>
        Tap a player to rename them. Remove anyone with the small delete action.
      </Text>

      <View style={styles.rowGap}>
        <TextInput
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Player name"
          placeholderTextColor="#82939a"
          style={styles.textInput}
          returnKeyType="done"
          onSubmitEditing={handleAddPlayer}
        />
        <PrimaryButton label="Add" onPress={handleAddPlayer} />
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {players.length ? (
          players.map((player, index) => (
            <PlayerRow key={player.id} player={player} color={getColorByIndex(index)} />
          ))
        ) : (
          <EmptyState text="No players yet. Add a few names to build teams." />
        )}
      </ScrollView>
    </View>
  );
}

function PlayerRow({ player, color }: PlayerRowProps) {
  const dispatch = useAppDispatch();

  if (player.isEdit) {
    return (
      <View style={styles.inlineEditorRow}>
        <TextInput
          value={player.draft}
          onChangeText={(value) => dispatch(SetDraftValueChange({ id: player.id, value }))}
          autoFocus
          placeholder="Player name"
          placeholderTextColor="#82939a"
          style={styles.inlineInput}
          onEndEditing={() => dispatch(setPlayerFormSubmit(player.id))}
        />
      </View>
    );
  }

  return (
    <View style={[styles.pillRow, { backgroundColor: color }]}>
      <Pressable style={styles.pillLabelWrap} onPress={() => dispatch(setEditStatus(player.id))}>
        <Text style={styles.pillLabel}>{player.name}</Text>
      </Pressable>
      <Pressable style={styles.pillDelete} onPress={() => dispatch(removePlayer(player.id))}>
        <Text style={styles.pillDeleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}

function GroupsStep() {
  const { numberOfGroups } = useAppSelector((state) => state.teams);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.stepSection}>
      <Text style={styles.sectionTitle}>Number of teams</Text>
      <Text style={styles.sectionHint}>Choose between 2 and 6 teams.</Text>

      <View style={styles.countCard}>
        <Text style={styles.countText}>{numberOfGroups}</Text>
      </View>

      <View style={styles.counterActions}>
        <PrimaryButton
          label="-"
          variant="ghost"
          onPress={() => dispatch(decreaseNumberOfGroupsByOne())}
          disabled={numberOfGroups <= 2}
        />
        <PrimaryButton
          label="+"
          variant="ghost"
          onPress={() => dispatch(increaseNumberOfGroupsByOne())}
          disabled={numberOfGroups >= 6}
        />
      </View>

      <View style={styles.segmentRow}>
        {[2, 3, 4, 5, 6].map((value) => (
          <Pressable
            key={value}
            style={[styles.segment, numberOfGroups === value ? styles.segmentActive : null]}
            onPress={() => dispatch(addNumberOfGroups(value))}
          >
            <Text
              style={[
                styles.segmentLabel,
                numberOfGroups === value ? styles.segmentLabelActive : null,
              ]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function TeamsStep() {
  const { teams } = useAppSelector((state) => state.teams);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.stepSection}>
      <Text style={styles.sectionTitle}>Rename teams</Text>
      <Text style={styles.sectionHint}>Tap a team name to edit it before the game starts.</Text>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {teams.map((team, index) =>
          team.isEdit ? (
            <View key={team.id} style={styles.inlineEditorRow}>
              <TextInput
                value={team.draft}
                onChangeText={(value) =>
                  dispatch(SetTeamDraftValueChange({ id: team.id, value }))
                }
                autoFocus
                placeholder="Team name"
                placeholderTextColor="#82939a"
                style={styles.inlineInput}
                onEndEditing={() => dispatch(setTeamFormSubmit(team.id))}
              />
            </View>
          ) : (
            <Pressable
              key={team.id}
              style={[styles.teamNameChip, { backgroundColor: getColorByIndex(index) }]}
              onPress={() => dispatch(setTeamEditStatus(team.id))}
            >
              <Text style={styles.teamNameChipText}>{team.name}</Text>
            </Pressable>
          )
        )}
      </ScrollView>
    </View>
  );
}

function ScoreStep() {
  const maxScore = useAppSelector((state) => state.teams.maxScore);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.stepSectionCentered}>
      <Text style={styles.sectionTitle}>Set max score</Text>
      <Text style={styles.sectionHintCentered}>
        This target is used for the progress bars during the game.
      </Text>

      <TextInput
        value={String(maxScore)}
        onChangeText={(value) => {
          const normalizedValue = value.replace(/[^0-9]/g, '');

          dispatch(setMaxScore(normalizedValue === '' ? '' : Number(normalizedValue)));
        }}
        keyboardType="number-pad"
        placeholder="100"
        placeholderTextColor="#82939a"
        style={styles.scoreInput}
      />
    </View>
  );
}

function ConfirmStartModal({ visible, onClose, onConfirm }: ConfirmStartModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Are you ready to start the game?</Text>
          <View style={styles.modalActions}>
            <PrimaryButton label="Cancel" variant="ghost" onPress={onClose} />
            <PrimaryButton label="Let's go" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SplitScreen({ onComplete }: SplitScreenProps) {
  const players = useAppSelector((state) => state.players);
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!players.length) {
      onComplete();
      return undefined;
    }

    const startedAt = Date.now();
    const totalDuration = 4000;
    const cyclingTimer = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % players.length);
    }, 120);

    const progressTimer = setInterval(() => {
      const nextProgress = Math.min(
        100,
        Math.round(((Date.now() - startedAt) / totalDuration) * 100)
      );

      setProgress(nextProgress);
    }, 40);

    const completionTimer = setTimeout(() => {
      dispatch(getPlayersForTeams(shufflePlayers(players)));
      onComplete();
    }, totalDuration);

    return () => {
      clearInterval(cyclingTimer);
      clearInterval(progressTimer);
      clearTimeout(completionTimer);
    };
  }, [dispatch, onComplete, players]);

  const activePlayer = players[currentIndex];
  const activeColor = getColorByIndex(currentIndex);

  return (
    <View style={styles.splitContainer}>
      <View style={styles.splitCard}>
        <ProgressBar value={progress} color={activeColor} />
        <Text style={[styles.splitName, { color: activeColor }]}>
          {activePlayer ? activePlayer.name : 'Preparing teams'}
        </Text>
      </View>
    </View>
  );
}

function GameScreen({ onGoHome }: GameScreenProps) {
  const { teams, maxScore } = useAppSelector((state) => state.teams);

  return (
    <ScrollView style={styles.gameScroll} contentContainerStyle={styles.gameContent}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>Match Board</Text>
        <Pressable
          style={({ pressed }) => [
            styles.gameHeaderButton,
            pressed ? styles.gameHeaderButtonPressed : null,
          ]}
          onPress={onGoHome}
        >
          <Text style={styles.gameHeaderButtonText}>Home</Text>
        </Pressable>
      </View>
      {teams.map((team, index) => (
        <TeamCard
          key={team.id}
          team={team}
          color={getColorByIndex(index)}
          maxScore={Number(maxScore) || 100}
        />
      ))}
    </ScrollView>
  );
}

function TeamCard({ team, color, maxScore }: TeamCardProps) {
  return (
    <View style={styles.teamCard}>
      <View style={[styles.teamHeader, { borderLeftColor: color }]}>
        <Text style={[styles.teamTitle, { color }]}>{team.name}</Text>
      </View>

      <View style={styles.teamPlayers}>
        {team.players.length ? (
          team.players.map((player) => (
            <View key={player.id} style={styles.teamMateRow}>
              <View style={[styles.avatar, { backgroundColor: `${color}20` }]}>
                <Text style={[styles.avatarText, { color }]}>P</Text>
              </View>
              <Text style={styles.teamMateName}>{player.name}</Text>
            </View>
          ))
        ) : (
          <EmptyState text="No players assigned to this team yet." compact />
        )}
      </View>

      <ScoreTracker color={color} maxScore={maxScore} />
    </View>
  );
}

function ScoreTracker({ color, maxScore }: ScoreTrackerProps) {
  const [score, setScore] = useState(0);
  const [reward, setReward] = useState(1);
  const [penalty, setPenalty] = useState(1);
  const [holdDirection, setHoldDirection] = useState<HoldDirection | null>(null);
  const holdStartedAtRef = useRef(0);
  const repeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const progress = useMemo(() => {
    if (!maxScore) {
      return 0;
    }

    return Math.max(0, Math.min(100, (score * 100) / maxScore));
  }, [maxScore, score]);

  const stopHold = () => {
    setHoldDirection(null);

    if (repeatTimerRef.current) {
      clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  };

  const applyScoreChange = (direction: HoldDirection) => {
    setScore((current) => (direction === 'back' ? current - penalty : current + reward));
  };

  useEffect(() => {
    if (!holdDirection) {
      return undefined;
    }

    const run = () => {
      const elapsed = Date.now() - holdStartedAtRef.current;
      let delay = 300;

      if (elapsed > 5000) {
        delay = 50;
      } else if (elapsed > 1000) {
        delay = 100;
      }

      applyScoreChange(holdDirection);
      repeatTimerRef.current = setTimeout(run, delay);
    };

    repeatTimerRef.current = setTimeout(run, 500);

    return () => {
      if (repeatTimerRef.current) {
        clearTimeout(repeatTimerRef.current);
        repeatTimerRef.current = null;
      }
    };
  }, [holdDirection, penalty, reward]);

  return (
    <View style={styles.scoreCard}>
      <Text style={[styles.scoreTitle, { color }]}>Score</Text>

      <View style={styles.scoreRow}>
        <ScoreButton
          label="-"
          onPress={() => applyScoreChange('back')}
          onPressIn={() => {
            holdStartedAtRef.current = Date.now();
            setHoldDirection('back');
          }}
          onPressOut={stopHold}
        />
        <Text style={[styles.scoreValue, { color }]}>{score}</Text>
        <ScoreButton
          label="+"
          onPress={() => applyScoreChange('forward')}
          onPressIn={() => {
            holdStartedAtRef.current = Date.now();
            setHoldDirection('forward');
          }}
          onPressOut={stopHold}
        />
      </View>

      <ProgressBar value={progress} color={color} />

      <View style={styles.scoreControllers}>
        <PointInput
          label="Reward"
          value={String(reward)}
          color={color}
          onChangeText={(value) => {
            const normalizedValue = value.replace(/[^0-9]/g, '');
            const nextValue = Number(normalizedValue || 0);

            if (nextValue >= 1) {
              setReward(nextValue);
            }
          }}
        />
        <PointInput
          label="Penalty"
          value={String(penalty)}
          color={color}
          onChangeText={(value) => {
            const normalizedValue = value.replace(/[^0-9]/g, '');
            const nextValue = Number(normalizedValue || 0);

            if (nextValue >= 1) {
              setPenalty(nextValue);
            }
          }}
        />
      </View>

      <PrimaryButton
        label="Reset"
        onPress={() => {
          setScore(0);
          setReward(1);
          setPenalty(1);
        }}
      />
    </View>
  );
}

function ScoreButton({ label, onPress, onPressIn, onPressOut }: ScoreButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.scoreButton, pressed ? styles.scoreButtonPressed : null]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Text style={styles.scoreButtonText}>{label}</Text>
    </Pressable>
  );
}

function PointInput({ label, value, onChangeText, color }: PointInputProps) {
  return (
    <View style={styles.pointInputWrap}>
      <Text style={[styles.pointLabel, { color }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        style={styles.pointInput}
      />
    </View>
  );
}

function ProgressBar({ value, color }: ProgressBarProps) {
  const width: `${number}%` = `${Math.max(0, Math.min(100, value))}%`;

  return (
    <View style={styles.progressWrap}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width, backgroundColor: color }]} />
      </View>
      <Text style={styles.progressLabel}>{Math.round(value)}%</Text>
    </View>
  );
}

function EmptyState({ text, compact = false }: EmptyStateProps) {
  return (
    <View style={[styles.emptyState, compact ? styles.emptyStateCompact : null]}>
      <Text style={styles.emptyStateText}>{text}</Text>
    </View>
  );
}

function PrimaryButton({ label, onPress, variant = 'solid', disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'ghost' ? styles.buttonGhost : styles.buttonSolid,
        disabled ? styles.buttonDisabled : null,
        pressed && !disabled ? styles.buttonPressed : null,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          variant === 'ghost' ? styles.buttonGhostText : styles.buttonSolidText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f8fb',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 20,
  },
  heroBlock: {
    gap: 8,
  },
  eyebrow: {
    color: '#fb8b24',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#0f4c5c',
    fontSize: 34,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#4f6770',
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#0f4c5c',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 18,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#d7e0e4',
  },
  stepDotActive: {
    width: 28,
    backgroundColor: '#fb8b24',
  },
  stepBody: {
    flex: 1,
  },
  stepActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 18,
  },
  stepSection: {
    flex: 1,
    gap: 12,
  },
  stepSectionCentered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  sectionTitle: {
    color: '#0f4c5c',
    fontSize: 24,
    fontWeight: '800',
  },
  sectionHint: {
    color: '#698089',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHintCentered: {
    color: '#698089',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  rowGap: {
    gap: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d6e1e6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#16323f',
    backgroundColor: '#fbfdfe',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 8,
  },
  inlineEditorRow: {
    backgroundColor: '#f5f8fa',
    borderRadius: 16,
    padding: 8,
  },
  inlineInput: {
    borderWidth: 1,
    borderColor: '#d6e1e6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#16323f',
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pillLabelWrap: {
    flex: 1,
  },
  pillLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  pillDelete: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 12,
  },
  pillDeleteText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  countCard: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: '#0f4c5c',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  countText: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: '800',
  },
  counterActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 8,
  },
  segment: {
    borderWidth: 1,
    borderColor: '#d6e1e6',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  segmentActive: {
    backgroundColor: '#fb8b24',
    borderColor: '#fb8b24',
  },
  segmentLabel: {
    color: '#0f4c5c',
    fontSize: 14,
    fontWeight: '700',
  },
  segmentLabelActive: {
    color: '#ffffff',
  },
  teamNameChip: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  teamNameChipText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  scoreInput: {
    minWidth: 160,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#d6e1e6',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: '#0f4c5c',
    fontSize: 28,
    fontWeight: '700',
    backgroundColor: '#ffffff',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 27, 36, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    gap: 18,
  },
  modalTitle: {
    color: '#0f4c5c',
    fontSize: 22,
    fontWeight: '800',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  splitContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splitCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    gap: 20,
    shadowColor: '#0f4c5c',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  splitName: {
    textAlign: 'center',
    fontSize: 38,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  gameScroll: {
    flex: 1,
  },
  gameContent: {
    padding: 20,
    gap: 16,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  gameTitle: {
    color: '#0f4c5c',
    fontSize: 30,
    fontWeight: '800',
  },
  gameHeaderButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edf3f5',
  },
  gameHeaderButtonPressed: {
    opacity: 0.85,
  },
  gameHeaderButtonText: {
    color: '#0f4c5c',
    fontSize: 14,
    fontWeight: '800',
  },
  teamCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#0f4c5c',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  teamHeader: {
    borderLeftWidth: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f7f9fa',
  },
  teamTitle: {
    fontSize: 24,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  teamPlayers: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  teamMateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  teamMateName: {
    color: '#183744',
    fontSize: 16,
    fontWeight: '600',
  },
  scoreCard: {
    padding: 16,
    gap: 16,
  },
  scoreTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  scoreButton: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f4c5c',
  },
  scoreButtonPressed: {
    opacity: 0.8,
  },
  scoreButtonText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  scoreValue: {
    minWidth: 96,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '800',
  },
  scoreControllers: {
    flexDirection: 'row',
    gap: 12,
  },
  pointInputWrap: {
    flex: 1,
    gap: 8,
  },
  pointLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  pointInput: {
    borderWidth: 1,
    borderColor: '#d6e1e6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#16323f',
    backgroundColor: '#ffffff',
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 18,
    borderRadius: 999,
    backgroundColor: '#e6edf0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressLabel: {
    minWidth: 44,
    color: '#60757d',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#d6e1e6',
    padding: 18,
    backgroundColor: '#fbfdfe',
  },
  emptyStateCompact: {
    paddingVertical: 12,
  },
  emptyStateText: {
    color: '#698089',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonSolid: {
    backgroundColor: '#fb8b24',
  },
  buttonGhost: {
    backgroundColor: '#edf3f5',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  buttonSolidText: {
    color: '#ffffff',
  },
  buttonGhostText: {
    color: '#0f4c5c',
  },
});
