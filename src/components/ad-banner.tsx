import { Href, router } from 'expo-router';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Colors, Spacing } from '@/constants/theme';
import { useT } from '@/i18n/language';
import { StringKey } from '@/i18n/strings';

const colors = Colors.dark;
export const AD_HEIGHT = 56;

// fake ads for now, just to hold the spot. real ads (AdMob) go here later
const ADS: {
  title: StringKey;
  text: StringKey;
  icon: SymbolViewProps['name'];
  color: string;
  href: Href;
}[] = [
  {
    title: 'adPremiumTitle',
    text: 'adPremiumText',
    icon: { ios: 'crown.fill', android: 'workspace_premium', web: 'workspace_premium' },
    color: colors.amber,
    href: '/premium',
  },
  {
    title: 'adTipTitle',
    text: 'adTipText',
    icon: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
    color: colors.teal,
    href: '/map',
  },
  {
    title: 'adLanguageTitle',
    text: 'adLanguageText',
    icon: { ios: 'globe', android: 'language', web: 'language' },
    color: colors.pink,
    href: '/missions',
  },
];

export function AdBanner() {
  const t = useT();
  const [index, setIndex] = useState(0);
  const ad = ADS[index];

  // rotate every few seconds
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % ADS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Pressable onPress={() => router.navigate(ad.href)} style={styles.bar}>
      <Animated.View key={index} entering={FadeIn.duration(400)} style={styles.content}>
        <View style={[styles.icon, { backgroundColor: ad.color + '22' }]}>
          <SymbolView name={ad.icon} size={18} tintColor={ad.color} />
        </View>
        <View style={styles.texts}>
          <Text style={styles.title} numberOfLines={1}>
            {t(ad.title)}
          </Text>
          <Text style={styles.text} numberOfLines={1}>
            {t(ad.text)}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{t('ad')}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: AD_HEIGHT,
    backgroundColor: colors.backgroundElement,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.backgroundSelected,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 600,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 4,
    paddingHorizontal: Spacing.one,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
});
