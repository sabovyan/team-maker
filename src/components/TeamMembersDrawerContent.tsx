import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getColorByIndex } from '../constants/colors';
import { theme } from '../constants/theme';
import { useAppSelector } from '../store/hooks';
import { appStyles } from '../styles/app';
import Button from './Button';

const { text } = theme;

type TeamMembersDrawerContentProps = {
  onClose: () => void;
};

export default function TeamMembersDrawerContent({ onClose }: TeamMembersDrawerContentProps) {
  const teams = useAppSelector((state) => state.teams.teams);

  return (
    <SafeAreaView style={appStyles.teamMembersDrawerSafeArea}>
      <ScrollView
        style={appStyles.teamMembersDrawerScroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={appStyles.teamMembersRouteContent}
      >
        <View style={appStyles.teamMembersHeader}>
          <View style={appStyles.teamMembersHeaderCopy}>
            <Text style={appStyles.scoreRouteTitle}>Team members</Text>
            <Text style={appStyles.teamMembersIntro}>See who ended up on each team.</Text>
          </View>

          <Button
            type="secondary"
            style={appStyles.teamMembersCloseButton}
            accessibilityLabel="Close team members"
            onPress={onClose}
          >
            <Ionicons name="close" size={22} color={text.secondary} />
          </Button>
        </View>

        <View style={appStyles.teamMembersList}>
          {teams.map((team, index) => (
            <View key={team.id} style={appStyles.teamMembersSection}>
              <Text style={[appStyles.teamMembersTeamName, { color: getColorByIndex(index) }]}>
                {team.name}
              </Text>

              {team.players.length > 0 ? (
                <View style={appStyles.teamMembersNames}>
                  {team.players.map((player) => (
                    <View key={player.id} style={appStyles.teamMemberRow}>
                      <Text style={appStyles.teamMemberName}>{player.name}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={appStyles.teamMembersEmptyState}>
                  <Text style={appStyles.emptyStateText}>No team members assigned yet.</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
