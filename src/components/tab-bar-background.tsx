import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, Colors } from '@/constants/theme';

// on ios the bottom inset already includes the tab bar, web has the tabs on top
export function useTabBarHeight() {
  const insets = useSafeAreaInsets();
  if (Platform.OS === 'web') return 0;
  if (Platform.OS === 'ios') return insets.bottom;
  return insets.bottom + BottomTabInset;
}

// solid strip behind the bottom tabs so taps don't go through to the screen
export function TabBarBackground() {
  const height = useTabBarHeight();
  if (height === 0) return null;
  return <View style={[styles.bar, { height }]} />;
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.dark.background,
  },
});
