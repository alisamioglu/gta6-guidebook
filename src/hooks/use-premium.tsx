import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

const KEY = 'premium';

// TODO: swap the fake buy/restore for the real store purchase (RevenueCat or expo-iap)
const PremiumContext = createContext<{
  isPremium: boolean;
  buy: () => void;
  restore: () => Promise<boolean>;
  reset: () => void;
}>({ isPremium: false, buy: () => {}, restore: async () => false, reset: () => {} });

export function PremiumProvider({ children }: PropsWithChildren) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (saved === 'true') setIsPremium(true);
    });
  }, []);

  function save(value: boolean) {
    setIsPremium(value);
    AsyncStorage.setItem(KEY, String(value));
  }

  async function restore() {
    const saved = await AsyncStorage.getItem(KEY);
    return saved === 'true';
  }

  return (
    <PremiumContext
      value={{ isPremium, buy: () => save(true), restore, reset: () => save(false) }}>
      {children}
    </PremiumContext>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
