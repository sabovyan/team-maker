import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics } from 'react-native-safe-area-context';

import { getColorByIndex } from './src/constants/colors';
import AnimatedNumberText from './src/components/AnimatedNumberText';
import SideDrawer from './src/components/SideDrawer';
import ScoreProgressRing from './src/components/ScoreProgressRing';
import SegmentOption from './src/components/SegmentOption';
import TeamMembersDrawerContent from './src/components/TeamMembersDrawerContent';
import { theme } from './src/constants/theme';
import Button from './src/components/Button';
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
  getPlayersForTeams,
  setMaxScore,
  setTeamEditStatus,
  setTeamFormSubmit,
  SetTeamDraftValueChange,
} from './src/store/features/teams.feature';
import type { Player, Team } from './src/types';
import generateNewId from './src/utils/generateNewId';
import { appStyles } from './src/styles/app';

type Screen = 'setup' | 'split' | 'game';

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
  maxScore: number | '';
};

type ProgressBarProps = {
  value: number;
  color: string;
};

type EmptyStateProps = {
  text: string;
  compact?: boolean;
};

const newId = generateNewId();
const { actions, text } = theme;

function shufflePlayers(players: Player[]): Player[] {
  return [...players].sort(() => Math.random() - 0.5);
}

export function AppContent() {
  const players = useAppSelector((state) => state.players);
  const [screen, setScreen] = useState<Screen>('setup');

  return (
    <SafeAreaView style={appStyles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={appStyles.keyboardAvoidingView}
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
    <View style={appStyles.screenContainer}>
      <View style={appStyles.card}>
        <View style={appStyles.stepBody}>{stepContent[activeStep] ?? null}</View>
      </View>

      <View style={appStyles.setupFooter}>
        <Button
          accessibilityLabel="Previous step"
          type="secondary"
          style={appStyles.setupNavButton}
          disabled={isBackDisabled}
          onPress={() => setActiveStep((current) => Math.max(0, current - 1))}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={isBackDisabled ? actions.disabledSecondaryText : actions.secondaryText}
          />
        </Button>

        <View style={appStyles.stepDots}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[appStyles.stepDot, activeStep === index ? appStyles.stepDotActive : null]}
            />
          ))}
        </View>

        <Button
          accessibilityLabel={activeStep === 3 ? 'Start game' : 'Next step'}
          style={appStyles.setupNavButton}
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
        </Button>
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
    <View style={appStyles.stepSection}>
      <Text style={appStyles.sectionTitle}>Add players</Text>
      <Text style={appStyles.sectionHint}>
        Tap a player to rename them. Remove anyone with the delete icon.
      </Text>

      <ScrollView
        style={appStyles.list}
        contentContainerStyle={players.length ? [appStyles.listContent, appStyles.playerListContent] : appStyles.listContent}
      >
        {players.length ? (
          players.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))
        ) : (
          <EmptyState text="No players yet. Add a few names to build teams." />
        )}
      </ScrollView>

      <View style={appStyles.rowGap}>
        <TextInput
          ref={playerNameInputRef}
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Player name"
          placeholderTextColor={text.placeholder}
          style={appStyles.textInput}
          returnKeyType="done"
          submitBehavior="submit"
          onSubmitEditing={handleAddPlayer}
        />
        <Button
          accessibilityLabel="Add player"
          style={appStyles.addIconButton}
          onPress={handleAddPlayer}
        >
          <Ionicons name="add" size={28} color={actions.primaryText} />
        </Button>
      </View>
    </View>
  );
}

function PlayerRow({ player }: PlayerRowProps) {
  const dispatch = useAppDispatch();

  if (player.isEdit) {
    return (
      <View style={[appStyles.inlineEditorRow, appStyles.playerInlineEditorRow]}>
        <TextInput
          value={player.draft}
          onChangeText={(value) => dispatch(SetDraftValueChange({ id: player.id, value }))}
          autoFocus
          placeholder="Player name"
          placeholderTextColor={text.placeholder}
          style={appStyles.inlineInput}
          onEndEditing={() => dispatch(setPlayerFormSubmit(player.id))}
        />
      </View>
    );
  }

  return (
    <View style={appStyles.pillRow}>
      <Pressable style={appStyles.pillLabelWrap} onPress={() => dispatch(setEditStatus(player.id))}>
        <Text style={appStyles.pillLabel}>{player.name}</Text>
      </Pressable>
      <Button
        accessibilityLabel={`Delete ${player.name}`}
        type="secondary"
        style={appStyles.pillDelete}
        onPress={() => dispatch(removePlayer(player.id))}
      >
        <Ionicons name="trash-outline" size={16} color={text.input} />
      </Button>
    </View>
  );
}

function GroupsStep() {
  const { numberOfGroups } = useAppSelector((state) => state.teams);
  const dispatch = useAppDispatch();

  return (
    <View style={appStyles.stepSection}>
      <Text style={appStyles.sectionTitle}>Number of teams</Text>
      <View style={appStyles.groupsChooserWrap}>
        <View style={appStyles.segmentRow}>
          {[2, 3, 4, 5, 6].map((value) => (
            <SegmentOption
              key={value}
              label={String(value)}
              selected={numberOfGroups === value}
              onPress={() => dispatch(addNumberOfGroups(value))}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function TeamsStep() {
  const { teams } = useAppSelector((state) => state.teams);
  const dispatch = useAppDispatch();

  return (
    <View style={appStyles.stepSection}>
      <Text style={appStyles.sectionTitle}>Rename teams</Text>
      <Text style={appStyles.sectionHint}>Tap a team name to edit it before the game starts.</Text>

      <ScrollView style={appStyles.list} contentContainerStyle={appStyles.listContent}>
        {teams.map((team, index) =>
          team.isEdit ? (
            <View key={team.id} style={appStyles.inlineEditorRow}>
              <TextInput
                value={team.draft}
                onChangeText={(value) =>
                  dispatch(SetTeamDraftValueChange({ id: team.id, value }))
                }
                autoFocus
                placeholder="Team name"
                placeholderTextColor={text.placeholder}
                style={appStyles.inlineInput}
                onEndEditing={() => dispatch(setTeamFormSubmit(team.id))}
              />
            </View>
          ) : (
            <Pressable
              key={team.id}
              style={[
                appStyles.teamNameChip,
                {
                  backgroundColor: `${getColorByIndex(index)}1a`,
                  borderColor: `${getColorByIndex(index)}33`,
                },
              ]}
              onPress={() => dispatch(setTeamEditStatus(team.id))}
            >
              <Text style={[appStyles.teamNameChipText, { color: getColorByIndex(index) }]}>
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
    <View style={appStyles.stepSectionCentered}>
      <Text style={appStyles.sectionTitle}>Set max score</Text>
      <Text style={appStyles.sectionHintCentered}>
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
        style={appStyles.scoreInput}
      />
    </View>
  );
}

function ConfirmStartModal({ visible, onClose, onConfirm }: ConfirmStartModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={appStyles.modalBackdrop}>
        <View style={appStyles.modalCard}>
          <Text style={appStyles.modalTitle}>Are you ready to start the game?</Text>
          <View style={appStyles.modalActions}>
            <Button type="secondary" grow onPress={onClose}>
              Cancel
            </Button>
            <Button grow onPress={onConfirm}>
              Let's go
            </Button>
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
    <View style={appStyles.splitContainer}>
      <View style={appStyles.splitCard}>
        <ProgressBar value={progress} color={activeColor} />
        <Text style={[appStyles.splitName, { color: activeColor }]}>
          {activePlayer ? activePlayer.name : 'Preparing teams'}
        </Text>
      </View>
    </View>
  );
}

function GameScreen({ onGoHome }: GameScreenProps) {
  const teams = useAppSelector((state) => state.teams.teams);
  const maxScore = useAppSelector((state) => state.teams.maxScore);
  const normalizedMaxScore = typeof maxScore === 'number' && maxScore > 0 ? maxScore : 100;
  const [isTeamMembersOpen, setIsTeamMembersOpen] = useState(false);

  return (
    <SideDrawer
      open={isTeamMembersOpen}
      onClose={() => setIsTeamMembersOpen(false)}
      drawerStyle={appStyles.teamMembersDrawerPanel}
      overlayStyle={appStyles.teamMembersDrawerOverlay}
      style={appStyles.gameDrawer}
      drawerContent={<TeamMembersDrawerContent onClose={() => setIsTeamMembersOpen(false)} />}
    >
      <ScrollView style={appStyles.gameScroll} contentContainerStyle={appStyles.gameContent}>
        <View style={appStyles.gameHeader}>
          <Button type="secondary" style={appStyles.gameHeaderButton} textStyle={appStyles.gameHeaderButtonText} onPress={onGoHome}>
            Home
          </Button>

          <Button
            type="secondary"
            style={appStyles.gameHeaderIconButton}
            accessibilityLabel="Show team members"
            onPress={() => setIsTeamMembersOpen(true)}
          >
            <Ionicons name="information-outline" size={22} color={text.secondary} />
          </Button>
        </View>

        <View style={appStyles.gameBoardCards}>
          {teams.map((team, index) => (
            <TeamCard
              key={team.id}
              team={team}
              color={getColorByIndex(index)}
              maxScore={normalizedMaxScore}
            />
          ))}
        </View>
      </ScrollView>
    </SideDrawer>
  );
}

function TeamCard({ team, color, maxScore }: TeamCardProps) {
  return (
    <View style={appStyles.teamCard}>
      <View style={appStyles.teamCardBody}>
        <View style={appStyles.teamCardHeader}>
          <Text style={[appStyles.teamTitle, { color }]}>{team.name}</Text>

          <Button
            type="secondary"
            style={appStyles.teamCardAddButton}
            accessibilityLabel={`Add score for ${team.name}`}
            onPress={() => {
              router.navigate({
                pathname: '/score-modal',
                params: { teamId: team.id },
              });
            }}
          >
            <Ionicons name="add" size={30} color={text.secondary} />
          </Button>
        </View>

        <ScoreProgressRing
          value={team.score}
          maxValue={maxScore}
          size={154}
          strokeWidth={8}
          color={color}
          trackColor={theme.borders.subtle}
          style={appStyles.teamScoreCircle}
        >
          <AnimatedNumberText style={[appStyles.teamScoreValue, { color }]} value={team.score} />
        </ScoreProgressRing>
      </View>
    </View>
  );
}

function ProgressBar({ value, color }: ProgressBarProps) {
  const width: `${number}%` = `${Math.max(0, Math.min(100, value))}%`;

  return (
    <View style={appStyles.progressWrap}>
      <View style={appStyles.progressTrack}>
        <View style={[appStyles.progressFill, { width, backgroundColor: color }]} />
      </View>
      <Text style={appStyles.progressLabel}>{Math.round(value)}%</Text>
    </View>
  );
}

function EmptyState({ text, compact = false }: EmptyStateProps) {
  return (
    <View style={[appStyles.emptyState, compact ? appStyles.emptyStateCompact : null]}>
      <Text style={appStyles.emptyStateText}>{text}</Text>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={appStyles.gestureRoot}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
