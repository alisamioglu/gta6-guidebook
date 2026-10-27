import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useLanguage, useT } from '@/i18n/language';
import { LANGUAGES } from '@/i18n/strings';

const colors = Colors.dark;

// small pill in the missions header, opens a list of languages
export function LanguagePicker() {
  const { language, setLanguage } = useLanguage();
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={6}
        style={({ pressed }) => [styles.pill, pressed && styles.pressed]}>
        <SymbolView
          name={{ ios: 'globe', android: 'language', web: 'language' }}
          size={14}
          tintColor={colors.pink}
        />
        <Text style={styles.pillText}>{language.toUpperCase()}</Text>
      </Pressable>

      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.card}>
            <Text style={styles.cardTitle}>{t('language')}</Text>
            {LANGUAGES.map((l) => {
              const selected = l.code === language;
              return (
                <Pressable
                  key={l.code}
                  onPress={() => {
                    setLanguage(l.code);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.row,
                    selected && styles.rowSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.code, selected && styles.codeSelected]}>
                    {l.code.toUpperCase()}
                  </Text>
                  <Text style={styles.name}>{l.name}</Text>
                  {selected && (
                    <SymbolView
                      name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                      size={16}
                      weight="bold"
                      tintColor={colors.pink}
                    />
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: colors.backgroundElement,
    borderWidth: 1,
    borderColor: colors.backgroundSelected,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + Spacing.half,
  },
  pillText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.backgroundElement,
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: 600,
    paddingHorizontal: Spacing.two,
    paddingBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  rowSelected: {
    backgroundColor: colors.backgroundSelected,
  },
  code: {
    width: 28,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
  },
  codeSelected: {
    color: colors.pink,
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: 500,
  },
});
