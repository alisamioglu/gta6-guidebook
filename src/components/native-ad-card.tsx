import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ads, unitId } from '@/ads/admob';
import { useAdsReady } from '@/components/interstitial-ad';
import { Colors, Spacing } from '@/constants/theme';
import { usePremium } from '@/hooks/use-premium';
import { useT } from '@/i18n/language';

const colors = Colors.dark;

// ad card that sits between the missions, real AdMob native ad in a build,
// our own premium card in Expo Go, on web or when AdMob has nothing
export function NativeAdCard() {
  const { isPremium } = usePremium();
  if (isPremium) return null;
  return ads ? <RealNativeAd /> : <HouseNativeAd />;
}

function RealNativeAd() {
  const ready = useAdsReady();
  const google = ads!;
  const { status, nativeAd } = google.useNativeAd({
    adUnitId: unitId('native'),
    autoLoad: ready,
    requestOptions: { aspectRatio: google.NativeMediaAspectRatio.LANDSCAPE },
  });

  if (status === 'no-fill' || status === 'error') return <HouseNativeAd />;
  // nothing while it loads, better than the house card jumping into a real one
  if (!nativeAd) return null;

  const { NativeAdView, NativeAsset, NativeAssetType, NativeMediaView } = google;

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.card}>
      <View style={styles.top}>
        <AdBadge />
        {!!nativeAd.advertiser && (
          <NativeAsset assetType={NativeAssetType.ADVERTISER}>
            <Text style={styles.advertiser} numberOfLines={1}>
              {nativeAd.advertiser}
            </Text>
          </NativeAsset>
        )}
      </View>

      <NativeMediaView style={styles.media} resizeMode="cover" />

      <View style={styles.row}>
        {nativeAd.icon && (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
          </NativeAsset>
        )}
        <View style={styles.texts}>
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text style={styles.headline} numberOfLines={1}>
              {nativeAd.headline}
            </Text>
          </NativeAsset>
          {!!nativeAd.body && (
            <NativeAsset assetType={NativeAssetType.BODY}>
              <Text style={styles.body} numberOfLines={2}>
                {nativeAd.body}
              </Text>
            </NativeAsset>
          )}
        </View>
      </View>

      <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
        <Text style={styles.cta}>{nativeAd.callToAction}</Text>
      </NativeAsset>
    </NativeAdView>
  );
}

function HouseNativeAd() {
  const t = useT();
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <AdBadge />
      </View>
      <View style={styles.row}>
        <View style={[styles.icon, styles.houseIcon]}>
          <SymbolView
            name={{ ios: 'crown.fill', android: 'workspace_premium', web: 'workspace_premium' }}
            size={22}
            tintColor={colors.amber}
          />
        </View>
        <View style={styles.texts}>
          <Text style={styles.headline} numberOfLines={1}>
            {t('adPremiumTitle')}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {t('adPremiumText')}
          </Text>
        </View>
      </View>
      <Pressable onPress={() => router.navigate('/premium')}>
        {({ pressed }) => (
          <Text style={[styles.cta, pressed && styles.pressed]}>{t('goPremium')}</Text>
        )}
      </Pressable>
    </View>
  );
}

// ads have to be clearly marked as ads
function AdBadge() {
  const t = useT();
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{t('ad')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundElement,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: colors.backgroundSelected,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    // room for the AdChoices icon google puts in the top right
    paddingRight: Spacing.five,
  },
  badge: {
    backgroundColor: colors.amber,
    borderRadius: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  badgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 0.5,
  },
  advertiser: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
  },
  media: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  houseIcon: {
    backgroundColor: colors.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: Spacing.half,
  },
  headline: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 700,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  cta: {
    backgroundColor: colors.pink,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    textAlign: 'center',
    borderRadius: 999,
    paddingVertical: Spacing.two + Spacing.one,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.7,
  },
});
