import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../src/components/Button';
import AnimatedNumberText from '../src/components/AnimatedNumberText';
import ScoreProgressRing from '../src/components/ScoreProgressRing';
import { getColorByIndex } from '../src/constants/colors';
import { theme } from '../src/constants/theme';
import { addTeamScore } from '../src/store/features/teams.feature';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { appStyles } from '../src/styles/app';

const { actions } = theme;

export default function ScoreModalRoute() {
  const { teamId } = useLocalSearchParams<{ teamId?: string }>();
  const dispatch = useAppDispatch();
  const [scoreDraft, setScoreDraft] = useState('');
  const scoreInputRef = useRef<TextInput>(null);
  const teams = useAppSelector((state) => state.teams.teams);
  const maxScore = useAppSelector((state) => state.teams.maxScore);
  const teamIndex = teams.findIndex((item) => item.id === teamId);
  const team = teamIndex >= 0 ? teams[teamIndex] : null;
  const color = teamIndex >= 0 ? getColorByIndex(teamIndex) : theme.teams.colors[0];
  const normalizedMaxScore = typeof maxScore === 'number' && maxScore > 0 ? maxScore : 100;

  const normalizedScoreDraft = scoreDraft.trim();
  const parsedScoreDraft = normalizedScoreDraft === '' ? 0 : Number(normalizedScoreDraft);
  const isApplyDisabled = Number.isNaN(parsedScoreDraft);
  const isPreviewActive = normalizedScoreDraft !== '' && !isApplyDisabled;
  const currentScore = team?.score ?? 0;
  const previewScore = isPreviewActive ? currentScore + parsedScoreDraft : currentScore;

  const submitScore = () => {
    if (!team || isApplyDisabled) {
      return;
    }

    dispatch(addTeamScore({ id: team.id, value: parsedScoreDraft }));
    router.back();
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      scoreInputRef.current?.focus();
    });
  }, []);

  if (!team) {
    return (
      <SafeAreaView style={appStyles.scoreRouteSafeArea}>
        <StatusBar style="dark" />
        <View style={appStyles.modalCard}>
          <Text style={appStyles.modalTitle}>Team not found</Text>
          <Button onPress={() => router.back()}>Close</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={appStyles.scoreRouteSafeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={appStyles.scoreRouteKeyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={appStyles.scoreRouteScroll}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={appStyles.scoreRouteContent}
        >
          <View style={appStyles.scoreRouteHeader}>
            <Text style={[appStyles.scoreModalTeamName, { color }]}>{team.name}</Text>
          </View>

          <ScoreProgressRing
            value={previewScore}
            maxValue={normalizedMaxScore}
            size={180}
            strokeWidth={10}
            color={color}
            trackColor={theme.borders.subtle}
            style={[appStyles.scoreModalCircle, appStyles.scoreModalPreview]}
          >
            <AnimatedNumberText
              style={[appStyles.teamScoreValue, { color }, appStyles.scoreModalPreview]}
              value={previewScore}
            />
          </ScoreProgressRing>

          <View style={appStyles.scoreModalActions}>
            <View style={appStyles.scoreModalInputWrap}>
              <TextInput
                ref={scoreInputRef}
                value={scoreDraft}
                onChangeText={(value) => {
                  const normalizedValue = value.replace(/\s+/g, '');

                  if (/^[+-]?\d*$/.test(normalizedValue)) {
                    setScoreDraft(normalizedValue);
                  }
                }}
                keyboardType="numbers-and-punctuation"
                style={appStyles.scoreModalInput}
                returnKeyType="done"
                submitBehavior="submit"
                selectTextOnFocus
                onSubmitEditing={submitScore}
              />

              <Text style={appStyles.scoreModalHint}>+12 or -12</Text>
            </View>

            <Button
              style={appStyles.scoreModalSubmitButton}
              disabled={isApplyDisabled}
              accessibilityLabel={`Apply score for ${team.name}`}
              onPress={submitScore}
            >
              <Ionicons
                name="arrow-forward"
                size={28}
                color={isApplyDisabled ? actions.disabledPrimaryText : actions.primaryText}
              />
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
