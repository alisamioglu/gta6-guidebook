import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const PIN_SIZE = 32;
const RING_SIZE = 44;

type Props = {
  left: number;
  top: number;
  color: string;
  mapScale: SharedValue<number>;
  highlighted?: boolean;
};

export function MapPin({ left, top, color, mapScale, highlighted }: Props) {
  // keep the pin the same size while zooming
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 / mapScale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, { left: left - PIN_SIZE / 2, top: top - PIN_SIZE }, style]}>
      {highlighted && <Ring />}
      <View style={[styles.head, { backgroundColor: color }]}>
        <View style={styles.dot} />
      </View>
    </Animated.View>
  );
}

function Ring() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [pulse]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - pulse.value * 0.5,
    transform: [{ scale: 0.9 + pulse.value * 0.3 }],
  }));

  return <Animated.View style={[styles.ring, style]} />;
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: PIN_SIZE,
    height: PIN_SIZE,
    alignItems: 'center',
    transformOrigin: 'bottom',
  },
  head: {
    width: 22,
    height: 22,
    marginTop: 2,
    borderRadius: 11,
    borderBottomRightRadius: 0,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  // centered on the pin head
  ring: {
    position: 'absolute',
    left: PIN_SIZE / 2 - RING_SIZE / 2,
    top: 13 - RING_SIZE / 2,
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: '#E24B4A',
  },
});
