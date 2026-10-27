import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

type Props = {
  uri: string;
  onClose: () => void;
};

// full screen photo, close with the X, a tap, or swiping down
export function PhotoViewer({ uri, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [dragY] = useState(() => new Animated.Value(0));

  const [pan] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8,
      onPanResponderMove: (_, g) => dragY.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1) onClose();
        else Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
      },
    }),
  );

  const opacity = dragY.interpolate({ inputRange: [0, 300], outputRange: [1, 0.3], extrapolate: 'clamp' });

  return (
    <Animated.View style={[styles.wrap, { opacity }]} {...pan.panHandlers}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View style={[styles.flex, { transform: [{ translateY: dragY }] }]}>
          <Image source={{ uri }} style={styles.flex} contentFit="contain" />
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={onClose}
        hitSlop={12}
        style={[styles.close, { top: insets.top + Spacing.two }]}>
        <SymbolView
          name={{ ios: 'xmark', android: 'close', web: 'close' }}
          size={16}
          weight="bold"
          tintColor="#fff"
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  flex: {
    flex: 1,
  },
  close: {
    position: 'absolute',
    right: Spacing.three,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
