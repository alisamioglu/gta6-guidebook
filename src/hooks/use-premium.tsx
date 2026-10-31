import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

type Purchases = typeof import('react-native-purchases').default;

// RevenueCat public sdk keys, not secret, they ship inside the app
const API_KEYS = {
  android: 'goog_KkmTggLshBxVAiRCqWynphuwCIz',
  ios: 'appl_NnULqqyNRkvtdZnJopCDYwYtuPL',
};
const ENTITLEMENT = 'premium';

const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// no native store code in Expo Go or on web,
// those keep the old test mode where buying just flips the switch
const purchases: Purchases | null =
  isExpoGo || Platform.OS === 'web'
    ? null
    : // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('react-native-purchases').default;

const TEST_KEY = 'premium';

export type BuyResult = 'bought' | 'cancelled' | 'failed';

const PremiumContext = createContext<{
  isPremium: boolean;
  isTestMode: boolean;
  price: string | null;
  buy: () => Promise<BuyResult>;
  restore: () => Promise<boolean>;
  reset: () => void;
}>({
  isPremium: false,
  isTestMode: true,
  price: null,
  buy: async () => 'failed',
  restore: async () => false,
  reset: () => {},
});

function hasPremium(info: CustomerInfo) {
  return info.entitlements.active[ENTITLEMENT] !== undefined;
}

export function PremiumProvider({ children }: PropsWithChildren) {
  const [isPremium, setIsPremium] = useState(false);
  const [pkg, setPkg] = useState<PurchasesPackage | null>(null);

  useEffect(() => {
    if (!purchases) {
      AsyncStorage.getItem(TEST_KEY).then((saved) => {
        if (saved === 'true') setIsPremium(true);
      });
      return;
    }

    purchases.configure({ apiKey });
    const onUpdate = (info: CustomerInfo) => setIsPremium(hasPremium(info));
    purchases.addCustomerInfoUpdateListener(onUpdate);
    purchases.getCustomerInfo().then(onUpdate).catch(() => {});
    // the product shown on the premium screen, price comes from the store
    purchases
      .getOfferings()
      .then((offerings) => setPkg(offerings.current?.availablePackages[0] ?? null))
      .catch((e) => console.warn('[premium] no offering yet', e));

    return () => {
      purchases.removeCustomerInfoUpdateListener(onUpdate);
    };
  }, []);

  function saveTest(value: boolean) {
    setIsPremium(value);
    AsyncStorage.setItem(TEST_KEY, String(value));
  }

  async function buy(): Promise<BuyResult> {
    if (!purchases) {
      saveTest(true);
      return 'bought';
    }
    if (!pkg) return 'failed';
    try {
      const { customerInfo } = await purchases.purchasePackage(pkg);
      setIsPremium(hasPremium(customerInfo));
      return hasPremium(customerInfo) ? 'bought' : 'failed';
    } catch (e) {
      if ((e as { userCancelled?: boolean }).userCancelled) return 'cancelled';
      console.warn('[premium] purchase failed', e);
      return 'failed';
    }
  }

  async function restore() {
    if (!purchases) return (await AsyncStorage.getItem(TEST_KEY)) === 'true';
    try {
      const info = await purchases.restorePurchases();
      setIsPremium(hasPremium(info));
      return hasPremium(info);
    } catch (e) {
      console.warn('[premium] restore failed', e);
      return false;
    }
  }

  return (
    <PremiumContext
      value={{
        isPremium,
        isTestMode: !purchases,
        price: pkg?.product.priceString ?? null,
        buy,
        restore,
        // only the test mode can be reset, a real purchase belongs to the store account
        reset: () => {
          if (!purchases) saveTest(false);
        },
      }}>
      {children}
    </PremiumContext>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
