import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MissionCard } from '@/components/mission-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { missions } from '@/data/missions';
import { useMissionProgress } from '@/hooks/use-mission-progress';

const colors = Colors.dark;

export default function MissionsScreen() {
  const [search, setSearch] = useState('');
  const { completed, notes, toggleDone, setNote } = useMissionProgress();

  const query = search.trim().toLowerCase();
  // keep the original numbers when filtering
  const results = missions
    .map((mission, i) => ({ mission, number: i + 1 }))
    .filter(({ mission }) => mission.title.toLowerCase().includes(query));

  const doneCount = missions.filter((m) => completed.includes(m.id)).length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View>
            <ThemedText style={styles.kicker}>GTA 6 guide</ThemedText>
            <ThemedText type="subtitle">Missions</ThemedText>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <ThemedText style={styles.progressText}>
                {doneCount} / {missions.length} completed
              </ThemedText>
              <ThemedText style={styles.progressPercent}>
                {Math.round((doneCount / missions.length) * 100)}%
              </ThemedText>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${(doneCount / missions.length) * 100}%` }]}
              />
            </View>
          </View>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search missions"
            placeholderTextColor={colors.textSecondary}
            clearButtonMode="while-editing"
            autoCorrect={false}
            style={styles.search}
          />

          {results.map(({ mission, number }) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              number={number}
              done={completed.includes(mission.id)}
              note={notes[mission.id] ?? ''}
              onToggleDone={() => toggleDone(mission.id)}
              onChangeNote={(note) => setNote(mission.id, note)}
            />
          ))}

          {results.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              No missions found for &quot;{search.trim()}&quot;
            </ThemedText>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    // web has the tab bar on top
    paddingTop: Platform.OS === 'web' ? Spacing.six + Spacing.four : Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  kicker: {
    fontSize: 13,
    color: colors.pink,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: 700,
  },
  progressCard: {
    backgroundColor: colors.backgroundElement,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 15,
    fontWeight: 600,
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.pink,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.backgroundSelected,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.pink,
  },
  search: {
    backgroundColor: colors.backgroundElement,
    color: colors.text,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
});
