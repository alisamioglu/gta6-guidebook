import { DarkTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { InterstitialAdProvider } from '@/components/interstitial-ad';
import { PremiumProvider } from '@/hooks/use-premium';
import { LanguageProvider } from '@/i18n/language';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <LanguageProvider>
        <PremiumProvider>
          <InterstitialAdProvider>
            <ThemeProvider value={DarkTheme}>
              <AnimatedSplashOverlay />
              <AppTabs />
            </ThemeProvider>
          </InterstitialAdProvider>
        </PremiumProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
