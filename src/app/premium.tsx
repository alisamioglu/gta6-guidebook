import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TabBarBackground, useTabBarHeight } from '@/components/tab-bar-background';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { usePremium } from '@/hooks/use-premium';
import { useT } from '@/i18n/language';
import { StringKey } from '@/i18n/strings';

const colors = Colors.dark;

// shown until the store sends the real price, or in test mode
const FALLBACK_PRICE = '$2.99';

const BENEFITS: { text: StringKey; icon: SymbolViewProps['name'] }[] = [
  { text: 'benefitNoBanner', icon: { ios: 'rectangle.slash', android: 'block', web: 'block' } },
  {
    text: 'benefitNoFullscreen',
    icon: { ios: 'xmark.rectangle', android: 'fullscreen_exit', web: 'fullscreen_exit' },
  },
  { text: 'benefitSupport', icon: { ios: 'heart.fill', android: 'favorite', web: 'favorite' } },
];

export default function PremiumScreen() {
  const t = useT();
  const { isPremium, isTestMode, price, buy, restore, reset } = usePremium();
  const tabBarHeight = useTabBarHeight(false);
  const [message, setMessage] = useState('');
  const [buying, setBuying] = useState(false);

  async function onBuy() {
    setMessage('');
    setBuying(true);
    const result = await buy();
    setBuying(false);
    if (result === 'failed') setMessage(t('purchaseFailed'));
  }

  async function onRestore() {
    setMessage('');
    const found = await restore();
    if (!found) setMessage(t('restoreNone'));
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + Spacing.four }]}>
          <View style={styles.hero}>
            <View style={styles.crown}>
              <SymbolView
                name={{ ios: 'crown.fill', android: 'workspace_premium', web: 'workspace_premium' }}
                size={48}
                tintColor={colors.amber}
              />
            </View>
            <Text style={styles.title}>{isPremium ? t('youArePremium') : t('goPremium')}</Text>
            <Text style={styles.subtitle}>
              {isPremium ? t('thanksPremium') : t('premiumSubtitle')}
            </Text>
          </View>

          <View style={styles.card}>
            {BENEFITS.map((b) => (
              <View key={b.text} style={styles.benefit}>
                <View style={styles.benefitIcon}>
                  <SymbolView name={b.icon} size={16} tintColor={colors.pink} />
                </View>
                <Text style={styles.benefitText}>{t(b.text)}</Text>
                {isPremium && (
                  <SymbolView
                    name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                    size={16}
                    weight="bold"
                    tintColor={colors.teal}
                  />
                )}
              </View>
            ))}
          </View>

          {!isPremium && (
            <>
              <View style={styles.priceCard}>
                <Text style={styles.price}>{price ?? FALLBACK_PRICE}</Text>
                <Text style={styles.priceNote}>{t('oneTime')}</Text>
              </View>

              <Pressable
                onPress={onBuy}
                disabled={buying}
                style={({ pressed }) => [styles.buyButton, (pressed || buying) && styles.pressed]}>
                <Text style={styles.buyText}>{t('buyPremium')}</Text>
              </Pressable>

              <Pressable onPress={onRestore} hitSlop={8} style={styles.restore}>
                <Text style={styles.restoreText}>{t('restore')}</Text>
              </Pressable>
              {!!message && <Text style={styles.message}>{message}</Text>}
            </>
          )}

          {isTestMode && <Text style={styles.testNote}>{t('testMode')}</Text>}
          {isTestMode && isPremium && (
            <Pressable onPress={reset} hitSlop={8} style={styles.restore}>
              <Text style={styles.restoreText}>{t('resetPremium')}</Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
      <TabBarBackground withAd={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    // web has the tab bar on top
    paddingTop: Platform.OS === 'web' ? Spacing.six + Spacing.four : Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  crown: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundElement,
    borderWidth: 1,
    borderColor: colors.amber + '55',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: 700,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 320,
  },
  card: {
    backgroundColor: colors.backgroundElement,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: 500,
  },
  priceCard: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.pink,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
  },
  price: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 700,
  },
  priceNote: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  buyButton: {
    backgroundColor: colors.pink,
    borderRadius: 999,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.7,
  },
  restore: {
    alignSelf: 'center',
    padding: Spacing.two,
  },
  restoreText: {
    color: colors.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  message: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  testNote: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});
