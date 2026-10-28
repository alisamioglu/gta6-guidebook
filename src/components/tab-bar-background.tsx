import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AD_HEIGHT, AdBanner } from '@/components/ad-banner';
import { Colors } from '@/constants/theme';
import { usePremium } from '@/hooks/use-premium';

// height of the tab bar itself. on ios the screen goes under it and the bottom inset covers it,
// on android the screen already stops above it, web has tabs on top
function useTabsOnly() {
  const insets = useSafeAreaInsets();
  if (Platform.OS === 'ios') return insets.bottom;
  return 0;
}

// everything covered at the bottom: tab bar plus the ad bar (gone for premium)
export function useTabBarHeight(withAd = true) {
  const tabs = useTabsOnly();
  const { isPremium } = usePremium();
  return tabs + (withAd && !isPremium ? AD_HEIGHT : 0);
}

// solid strip behind the bottom tabs so taps don't go through, with the ad bar on top
export function TabBarBackground({ withAd = true }: { withAd?: boolean }) {
  const tabs = useTabsOnly();
  const { isPremium } = usePremium();
  const showAd = withAd && !isPremium;

  return (
    <>
      {tabs > 0 && <View style={[styles.bar, { height: tabs }]} />}
      {showAd && (
        <View style={[styles.ad, { bottom: tabs }]}>
          <AdBanner />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.dark.background,
  },
  ad: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
