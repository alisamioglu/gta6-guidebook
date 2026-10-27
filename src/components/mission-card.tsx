import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { Difficulty, Mission } from '@/data/missions';
import { useMissionText, useT } from '@/i18n/language';

const colors = Colors.dark;

const difficultyColors: Record<Difficulty, string> = {
  easy: colors.teal,
  medium: colors.amber,
  hard: colors.pink,
};

function formatMoney(value: number) {
  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

type Props = {
  mission: Mission;
  number: number;
  done: boolean;
  note: string;
  onToggleDone: () => void;
  onChangeNote: (note: string) => void;
};

export function MissionCard({ mission, number, done, note, onToggleDone, onChangeNote }: Props) {
  const [open, setOpen] = useState(false);
  const t = useT();
  const text = useMissionText()(mission);
  const difficultyColor = difficultyColors[mission.difficulty];

  function showOnMap() {
    router.navigate({ pathname: '/map', params: { mission: mission.id, t: String(Date.now()) } });
  }

  return (
    <View style={[styles.card, done && styles.cardDone]}>
      <View style={styles.header}>
        <Pressable
          onPress={onToggleDone}
          hitSlop={8}
          style={[styles.checkbox, done && styles.checkboxDone]}>
          {done && (
            <SymbolView
              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
              size={16}
              weight="bold"
              tintColor={colors.background}
            />
          )}
        </Pressable>

        <Pressable
          onPress={() => setOpen(!open)}
          style={({ pressed }) => [styles.headerText, pressed && styles.pressed]}>
          <View style={styles.flex}>
            <ThemedText style={[styles.title, done && styles.titleDone]}>
              {number}. {text.title}
            </ThemedText>
            <View style={styles.tags}>
              <View style={[styles.tag, { borderColor: difficultyColor }]}>
                <ThemedText style={[styles.tagText, { color: difficultyColor }]}>
                  {t(mission.difficulty)}
                </ThemedText>
              </View>
              <ThemedText style={styles.reward}>{formatMoney(mission.reward)}</ThemedText>
            </View>
          </View>
          <SymbolView
            name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
            size={18}
            tintColor={colors.textSecondary}
            style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
          />
        </Pressable>
      </View>

      {open && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.body}>
          {text.steps.map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>{i + 1}</ThemedText>
              </View>
              <ThemedText type="small" style={styles.flex}>
                {step}
              </ThemedText>
            </View>
          ))}

          <Pressable
            onPress={showOnMap}
            style={({ pressed }) => [styles.mapButton, pressed && styles.pressed]}>
            <SymbolView
              name={{ ios: 'map', android: 'map', web: 'map' }}
              size={16}
              tintColor={colors.teal}
            />
            <ThemedText style={styles.mapButtonText}>{t('showOnMap')}</ThemedText>
          </Pressable>

          <TextInput
            value={note}
            onChangeText={onChangeNote}
            placeholder={t('missionTip')}
            placeholderTextColor={colors.textSecondary}
            multiline
            style={styles.note}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.backgroundElement,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  cardDone: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.pink,
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
  titleDone: {
    textDecorationLine: 'line-through',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
  },
  tagText: {
    fontSize: 11,
    lineHeight: 18,
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  reward: {
    fontSize: 13,
    color: colors.teal,
    fontWeight: 600,
  },
  body: {
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.backgroundSelected,
    gap: Spacing.three,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.pink,
    fontWeight: 700,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: colors.teal,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  mapButtonText: {
    fontSize: 14,
    color: colors.teal,
    fontWeight: 600,
  },
  note: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    minHeight: 60,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  pressed: {
    opacity: 0.7,
  },
});
