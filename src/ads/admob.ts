import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

type GoogleAds = typeof import('react-native-google-mobile-ads');

// Expo Go doesn't have the AdMob native code, loading it there crashes the app,
// so it only gets required in a real (development or store) build
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const ads: GoogleAds | null = isExpoGo
  ? null
  : // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react-native-google-mobile-ads');

// TODO: put the real ad unit ids from AdMob here (Apps > your app > Ad units)
const UNITS = {
  banner: { ios: '', android: '' },
  interstitial: { ios: '', android: '' },
  native: { ios: '', android: '' },
};

export type AdKind = keyof typeof UNITS;

const TEST_KEYS = { banner: 'BANNER', interstitial: 'INTERSTITIAL', native: 'NATIVE' } as const;

// test ads while developing or until the real ids are filled in,
// clicking real ads during testing can get the AdMob account banned
export function unitId(kind: AdKind) {
  const real = Platform.OS === 'ios' ? UNITS[kind].ios : UNITS[kind].android;
  if (__DEV__ || !real || !ads) {
    return ads?.TestIds[TEST_KEYS[kind]] ?? '';
  }
  return real;
}

// ask for consent (EU / ATT) first, then start the sdk
export async function startAds() {
  if (!ads) return false;
  try {
    const { canRequestAds } = await ads.AdsConsent.gatherConsent();
    if (!canRequestAds) return false;
    await ads.default().initialize();
    return true;
  } catch {
    return false;
  }
}
