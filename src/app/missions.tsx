import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { missions } from '@/data/missions';
import { useTheme } from '@/hooks/use-theme';

export default function MissionsScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  // keep the original numbers when filtering
  const results = missions
    .map((mission, i) => ({ ...mission, number: i + 1 }))
    .filter((mission) => mission.title.toLowerCase().includes(query));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="subtitle">Missions</ThemedText>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search missions"
            placeholderTextColor={theme.textSecondary}
            clearButtonMode="while-editing"
            autoCorrect={false}
            style={[styles.search, { color: theme.text, backgroundColor: theme.backgroundElement }]}
          />

          {results.map((mission) => (
            <Collapsible key={mission.title} title={`${mission.number}. ${mission.title}`}>
              <ThemedText type="small">{mission.solution}</ThemedText>
            </Collapsible>
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
    paddingHorizontal: Spacing.four,
    // web has the tab bar on top
    paddingTop: Platform.OS === 'web' ? Spacing.six + Spacing.four : Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  search: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
});
