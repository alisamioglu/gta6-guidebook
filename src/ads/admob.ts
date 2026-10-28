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

// real ad unit ids from AdMob (Apps > your app > Ad units)
const UNITS = {
  banner: {
    ios: 'ca-app-pub-9734141534745644/8157491846',
    android: 'ca-app-pub-9734141534745644/1616134220',
  },
  interstitial: {
    ios: 'ca-app-pub-9734141534745644/7060032590',
    android: 'ca-app-pub-9734141534745644/5650535976',
  },
  native: {
    ios: 'ca-app-pub-9734141534745644/6209985355',
    android: 'ca-app-pub-9734141534745644/8814213376',
  },
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

// ask for consent (EU / ATT) first, then start the sdk.
// if the consent step itself breaks (like no privacy message set up in AdMob yet)
// we still start, outside the EU no consent is needed anyway
export async function startAds() {
  if (!ads) return false;
  try {
    const { canRequestAds } = await ads.AdsConsent.gatherConsent();
    if (!canRequestAds) {
      console.warn('[ads] user did not give consent, no ads');
      return false;
    }
  } catch (e) {
    console.warn('[ads] consent step failed, starting anyway', e);
  }
  try {
    await ads.default().initialize();
    return true;
  } catch (e) {
    console.warn('[ads] AdMob failed to start', e);
    return false;
  }
}
