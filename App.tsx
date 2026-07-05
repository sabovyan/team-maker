import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import { getColorByIndex } from './src/constants/colors';
import { theme } from './src/constants/theme';
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
const { actions, borders, effects, overlays, progress: progressTheme, surfaces, text } = theme;

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
  const isBackDisabled = activeStep === 0;
  const isNextDisabled = activeStep === 3 && players.length === 0;

  const stepContent: ReactElement[] = [
    <PlayersStep key="players" />,
    <GroupsStep key="groups" />,
    <TeamsStep key="teams" />,
    <ScoreStep key="score" />,
  ];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.card}>
        <View style={styles.stepBody}>{stepContent[activeStep] ?? null}</View>
      </View>

      <View style={styles.setupFooter}>
        <Pressable
          accessibilityLabel="Previous step"
          style={({ pressed }) => [
            styles.setupNavButton,
            styles.setupNavButtonGhost,
            isBackDisabled ? styles.setupNavButtonGhostDisabled : null,
            pressed && !isBackDisabled ? styles.buttonPressed : null,
          ]}
          disabled={isBackDisabled}
          onPress={() => setActiveStep((current) => Math.max(0, current - 1))}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={isBackDisabled ? actions.disabledSecondaryText : actions.secondaryText}
          />
        </Pressable>

        <View style={styles.stepDots}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[styles.stepDot, activeStep === index ? styles.stepDotActive : null]}
            />
          ))}
        </View>

        <Pressable
          accessibilityLabel={activeStep === 3 ? 'Start game' : 'Next step'}
          style={({ pressed }) => [
            styles.setupNavButton,
            styles.setupNavButtonSolid,
            isNextDisabled ? styles.setupNavButtonSolidDisabled : null,
            pressed && !isNextDisabled ? styles.buttonPressed : null,
          ]}
          disabled={isNextDisabled}
          onPress={() => {
            if (activeStep === 3) {
              setIsModalVisible(true);
            } else {
              setActiveStep((current) => Math.min(3, current + 1));
            }
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={isNextDisabled ? actions.disabledPrimaryText : actions.primaryText}
          />
        </Pressable>
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
  const playerNameInputRef = useRef<TextInput>(null);

  const focusPlayerNameInput = () => {
    requestAnimationFrame(() => {
      playerNameInputRef.current?.focus();
    });
  };

  const handleAddPlayer = () => {
    const normalizedName = playerName.trim();

    if (!normalizedName) {
      focusPlayerNameInput();
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
    focusPlayerNameInput();
  };

  return (
    <View style={styles.stepSection}>
      <Text style={styles.sectionTitle}>Add players</Text>
      <Text style={styles.sectionHint}>
        Tap a player to rename them. Remove anyone with the delete icon.
      </Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={players.length ? [styles.listContent, styles.playerListContent] : styles.listContent}
      >
        {players.length ? (
          players.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))
        ) : (
          <EmptyState text="No players yet. Add a few names to build teams." />
        )}
      </ScrollView>

      <View style={styles.rowGap}>
        <TextInput
          ref={playerNameInputRef}
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Player name"
          placeholderTextColor={text.placeholder}
          style={styles.textInput}
          returnKeyType="done"
          submitBehavior="submit"
          onSubmitEditing={handleAddPlayer}
        />
        <Pressable
          accessibilityLabel="Add player"
          style={({ pressed }) => [styles.addIconButton, pressed ? styles.buttonPressed : null]}
          onPress={handleAddPlayer}
        >
          <Ionicons name="add" size={28} color={actions.primaryText} />
        </Pressable>
      </View>
    </View>
  );
}

function PlayerRow({ player }: PlayerRowProps) {
  const dispatch = useAppDispatch();

  if (player.isEdit) {
    return (
      <View style={[styles.inlineEditorRow, styles.playerInlineEditorRow]}>
        <TextInput
          value={player.draft}
          onChangeText={(value) => dispatch(SetDraftValueChange({ id: player.id, value }))}
          autoFocus
          placeholder="Player name"
          placeholderTextColor={text.placeholder}
          style={styles.inlineInput}
          onEndEditing={() => dispatch(setPlayerFormSubmit(player.id))}
        />
      </View>
    );
  }

  return (
    <View style={styles.pillRow}>
      <Pressable style={styles.pillLabelWrap} onPress={() => dispatch(setEditStatus(player.id))}>
        <Text style={styles.pillLabel}>{player.name}</Text>
      </Pressable>
      <Pressable
        accessibilityLabel={`Delete ${player.name}`}
        style={styles.pillDelete}
        onPress={() => dispatch(removePlayer(player.id))}
      >
        <Ionicons name="trash-outline" size={16} color={text.input} />
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
                placeholderTextColor={text.placeholder}
                style={styles.inlineInput}
                onEndEditing={() => dispatch(setTeamFormSubmit(team.id))}
              />
            </View>
          ) : (
            <Pressable
              key={team.id}
              style={[
                styles.teamNameChip,
                {
                  backgroundColor: `${getColorByIndex(index)}1a`,
                  borderColor: `${getColorByIndex(index)}33`,
                },
              ]}
              onPress={() => dispatch(setTeamEditStatus(team.id))}
            >
              <Text style={[styles.teamNameChipText, { color: getColorByIndex(index) }]}>
                {team.name}
              </Text>
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
        placeholderTextColor={text.placeholder}
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
        disabled
          ? variant === 'ghost'
            ? styles.buttonGhostDisabled
            : styles.buttonSolidDisabled
          : null,
        pressed && !disabled ? styles.buttonPressed : null,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          variant === 'ghost' ? styles.buttonGhostText : styles.buttonSolidText,
          disabled
            ? variant === 'ghost'
              ? styles.buttonGhostTextDisabled
              : styles.buttonSolidTextDisabled
            : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: surfaces.surface1,
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
    color: actions.primaryBg,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: text.primary,
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroSubtitle: {
    color: text.muted,
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    flex: 1,
    backgroundColor: surfaces.surface2,
    borderRadius: 24,
    padding: 18,
    shadowColor: effects.shadowColor,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  setupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  setupNavButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupNavButtonGhost: {
    backgroundColor: actions.secondaryBg,
  },
  setupNavButtonSolid: {
    backgroundColor: actions.primaryBg,
  },
  setupNavButtonGhostDisabled: {
    backgroundColor: actions.disabledSecondaryBg,
  },
  setupNavButtonSolidDisabled: {
    backgroundColor: actions.disabledPrimaryBg,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: borders.strong,
  },
  stepDotActive: {
    width: 28,
    backgroundColor: actions.primaryBg,
  },
  stepBody: {
    flex: 1,
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
    color: text.primary,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  sectionHint: {
    color: text.secondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  sectionHintCentered: {
    color: text.secondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addIconButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: actions.primaryBg,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: text.input,
    backgroundColor: surfaces.surfaceInput,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 8,
  },
  playerListContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  inlineEditorRow: {
    backgroundColor: surfaces.surfaceInset,
    borderRadius: 16,
    padding: 8,
  },
  playerInlineEditorRow: {
    width: '100%',
  },
  inlineInput: {
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: text.input,
    fontSize: 16,
    backgroundColor: surfaces.surface2,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    maxWidth: '100%',
    backgroundColor: surfaces.surface2,
  },
  pillLabelWrap: {
    flexShrink: 1,
  },
  pillLabel: {
    color: text.input,
    fontSize: 16,
    fontWeight: '700',
  },
  pillDelete: {
    borderWidth: 1,
    borderColor: borders.muted,
    borderRadius: 999,
    backgroundColor: surfaces.surface1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  countText: {
    color: actions.primaryText,
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
    borderColor: borders.subtle,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: surfaces.surface2,
  },
  segmentActive: {
    backgroundColor: actions.primaryBg,
    borderColor: actions.primaryBg,
  },
  segmentLabel: {
    color: text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  segmentLabelActive: {
    color: actions.primaryText,
  },
  teamNameChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  teamNameChipText: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  scoreInput: {
    minWidth: 160,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: text.primary,
    fontSize: 28,
    fontWeight: '700',
    backgroundColor: surfaces.surface2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: overlays.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: surfaces.surface2,
    borderRadius: 24,
    padding: 20,
    gap: 18,
  },
  modalTitle: {
    color: text.primary,
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
    backgroundColor: surfaces.surface2,
    borderRadius: 28,
    padding: 24,
    gap: 20,
    shadowColor: effects.shadowColor,
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
    color: text.primary,
    fontSize: 30,
    fontWeight: '800',
  },
  gameHeaderButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: actions.secondaryBg,
  },
  gameHeaderButtonPressed: {
    opacity: 0.85,
  },
  gameHeaderButtonText: {
    color: actions.secondaryText,
    fontSize: 14,
    fontWeight: '800',
  },
  teamCard: {
    backgroundColor: surfaces.surface2,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: effects.shadowColor,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  teamHeader: {
    borderLeftWidth: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: surfaces.surfaceHeader,
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
    color: text.input,
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
    backgroundColor: actions.primaryBg,
  },
  scoreButtonPressed: {
    opacity: 0.8,
  },
  scoreButtonText: {
    color: actions.primaryText,
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
    borderColor: borders.subtle,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: text.input,
    backgroundColor: surfaces.surface2,
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
    backgroundColor: progressTheme.track,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressLabel: {
    minWidth: 44,
    color: text.secondary,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: borders.subtle,
    padding: 18,
    backgroundColor: surfaces.surfaceInput,
  },
  emptyStateCompact: {
    paddingVertical: 12,
  },
  emptyStateText: {
    color: text.secondary,
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
    backgroundColor: actions.primaryBg,
  },
  buttonGhost: {
    backgroundColor: actions.secondaryBg,
  },
  buttonSolidDisabled: {
    backgroundColor: actions.disabledPrimaryBg,
  },
  buttonGhostDisabled: {
    backgroundColor: actions.disabledSecondaryBg,
  },
  buttonPressed: {
    opacity: actions.pressedOpacity,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  buttonSolidText: {
    color: actions.primaryText,
  },
  buttonSolidTextDisabled: {
    color: actions.disabledPrimaryText,
  },
  buttonGhostText: {
    color: actions.secondaryText,
  },
  buttonGhostTextDisabled: {
    color: actions.disabledSecondaryText,
  },
});
