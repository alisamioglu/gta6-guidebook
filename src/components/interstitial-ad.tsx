import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Modal, Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { InterstitialAd } from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ads, startAds, unitId } from '@/ads/admob';
import { Colors, Spacing } from '@/constants/theme';
import { usePremium } from '@/hooks/use-premium';
import { useT } from '@/i18n/language';

const colors = Colors.dark;

// shows when a mission opens and when a new map pin is saved.
// 0 = every time, raise it (like 3 * 60 * 1000) if real AdMob ads end up too often for their rules
const AD_EVERY_MS = 0;
const SKIP_AFTER = 5;

const AdContext = createContext<() => void>(() => {});
const ReadyContext = createContext(false);

// real AdMob interstitial in a dev/store build, the fake one in Expo Go and web
export function InterstitialAdProvider({ children }: PropsWithChildren) {
  const t = useT();
  const { isPremium } = usePremium();
  // safe area inside a modal can come back as 0 on ios, so take it from outside
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [seconds, setSeconds] = useState(SKIP_AFTER);
  const lastShown = useRef(0);
  const [ready, setReady] = useState(false);
  const interstitial = useRef<InterstitialAd | null>(null);
  const loaded = useRef(false);

  // consent first, then the sdk, once when the app opens
  useEffect(() => {
    startAds().then(setReady);
  }, []);

  // keep one interstitial loaded so it shows right away when needed
  useEffect(() => {
    if (!ready || !ads) return;
    const ad = ads.InterstitialAd.createForAdRequest(unitId('interstitial'));
    const { AdEventType } = ads;
    let retry: ReturnType<typeof setTimeout>;
    const subs = [
      ad.addAdEventListener(AdEventType.LOADED, () => {
        loaded.current = true;
      }),
      ad.addAdEventListener(AdEventType.OPENED, () => {
        // the close button can end up under the status bar on ios
        if (Platform.OS === 'ios') StatusBar.setHidden(true);
      }),
      ad.addAdEventListener(AdEventType.CLOSED, () => {
        loaded.current = false;
        if (Platform.OS === 'ios') StatusBar.setHidden(false);
        ad.load();
      }),
      ad.addAdEventListener(AdEventType.ERROR, () => {
        loaded.current = false;
        retry = setTimeout(() => ad.load(), 30000);
      }),
    ];
    interstitial.current = ad;
    ad.load();
    return () => {
      subs.forEach((unsubscribe) => unsubscribe());
      clearTimeout(retry);
      interstitial.current = null;
    };
  }, [ready]);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [visible]);

  function maybeShow() {
    if (isPremium || visible || Date.now() - lastShown.current < AD_EVERY_MS) return;

    if (ads) {
      // no ad ready yet (still loading, no fill or no consent) just means no ad this time
      if (!interstitial.current || !loaded.current) return;
      lastShown.current = Date.now();
      interstitial.current.show().catch(() => {});
      return;
    }

    lastShown.current = Date.now();
    setSeconds(SKIP_AFTER);
    setVisible(true);
  }

  // keep the same function for the screens, otherwise their focus effect runs again
  // every time the ad closes and pops a new one
  const latest = useRef(maybeShow);
  useEffect(() => {
    latest.current = maybeShow;
  });
  const [show] = useState(() => () => latest.current());

  function goPremium() {
    setVisible(false);
    router.navigate('/premium');
  }

  return (
    <AdContext value={show}>
      <ReadyContext value={ready}>{children}</ReadyContext>
      <Modal
        visible={visible}
        animationType="fade"
        onRequestClose={() => {
          if (seconds === 0) setVisible(false);
        }}>
        <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
          <View style={[styles.top, { paddingTop: insets.top + Spacing.three }]}>
            <Text style={styles.label}>{t('advertisement')}</Text>
            {seconds > 0 ? (
              <View style={styles.countdownPill}>
                <Text style={styles.countdown}>{t('closeIn', { seconds })}</Text>
              </View>
            ) : (
              <Pressable onPress={() => setVisible(false)} hitSlop={12} style={styles.close}>
                <SymbolView
                  name={{ ios: 'xmark', android: 'close', web: 'close' }}
                  size={16}
                  weight="bold"
                  tintColor="#fff"
                />
              </Pressable>
            )}
          </View>

          <View style={styles.body}>
            <View style={styles.crown}>
              <SymbolView
                name={{ ios: 'crown.fill', android: 'workspace_premium', web: 'workspace_premium' }}
                size={44}
                tintColor={colors.amber}
              />
            </View>
            <Text style={styles.title}>{t('adPremiumTitle')}</Text>
            <Text style={styles.text}>{t('adPremiumText')}</Text>
            <Pressable
              onPress={goPremium}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>{t('goPremium')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </AdContext>
  );
}

// true once consent is done and the AdMob sdk started, banners wait for this
export function useAdsReady() {
  return useContext(ReadyContext);
}

// call it to try showing an ad, like when a mission opens or a new pin is saved
export function useShowAd() {
  return useContext(AdContext);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  countdownPill: {
    height: 36,
    justifyContent: 'center',
    backgroundColor: colors.backgroundSelected,
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
  },
  countdown: {
    color: colors.text,
    fontSize: 13,
    fontWeight: 600,
    fontVariant: ['tabular-nums'],
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.five,
    gap: Spacing.three,
  },
  crown: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: 700,
    textAlign: 'center',
  },
  text: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.three,
    backgroundColor: colors.pink,
    borderRadius: 999,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.7,
  },
});
