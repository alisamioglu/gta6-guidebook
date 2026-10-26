import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/theme';

export const PIN_SIZE = 32;
export const MISSION_SIZE = 20;
const RING_SIZE = 44;

// the teardrop pin for user notes
export function PinShape({ color }: { color: string }) {
  return (
    <View style={[styles.head, { backgroundColor: color }]}>
      <View style={styles.dot} />
    </View>
  );
}

// round badge with the mission number, so it doesn't look like a note pin
export function MissionBadge({ number, done }: { number: number; done?: boolean }) {
  return (
    <View style={[styles.badge, done && styles.badgeDone]}>
      <Text style={styles.badgeText}>{number}</Text>
    </View>
  );
}

type PinProps = {
  left: number;
  top: number;
  color: string;
  mapScale: SharedValue<number>;
  highlighted?: boolean;
};

export function MapPin({ left, top, color, mapScale, highlighted }: PinProps) {
  // keep the pin the same size while zooming
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 / mapScale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.pinWrap, { left: left - PIN_SIZE / 2, top: top - PIN_SIZE }, style]}>
      {highlighted && <Ring centerX={PIN_SIZE / 2} centerY={13} />}
      <PinShape color={color} />
    </Animated.View>
  );
}

type MissionProps = {
  left: number;
  top: number;
  number: number;
  done: boolean;
  mapScale: SharedValue<number>;
  highlighted?: boolean;
};

export function MissionMarker({ left, top, number, done, mapScale, highlighted }: MissionProps) {
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 / mapScale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.missionWrap,
        { left: left - MISSION_SIZE / 2, top: top - MISSION_SIZE / 2 },
        style,
      ]}>
      {highlighted && <Ring centerX={MISSION_SIZE / 2} centerY={MISSION_SIZE / 2} />}
      <MissionBadge number={number} done={done} />
    </Animated.View>
  );
}

function Ring({ centerX, centerY }: { centerX: number; centerY: number }) {
  const pulse = useSharedValue(0);
  const visible = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
    // fade out after a few seconds
    visible.value = withDelay(3000, withTiming(0, { duration: 400 }));
  }, [pulse, visible]);

  const style = useAnimatedStyle(() => ({
    opacity: (1 - pulse.value * 0.5) * visible.value,
    transform: [{ scale: 0.9 + pulse.value * 0.3 }],
  }));

  return (
    <Animated.View
      style={[
        styles.ring,
        { left: centerX - RING_SIZE / 2, top: centerY - RING_SIZE / 2 },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  pinWrap: {
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
  missionWrap: {
    position: 'absolute',
    width: MISSION_SIZE,
    height: MISSION_SIZE,
  },
  badge: {
    width: MISSION_SIZE,
    height: MISSION_SIZE,
    borderRadius: MISSION_SIZE / 2,
    backgroundColor: Colors.dark.background,
    borderWidth: 1.5,
    borderColor: Colors.dark.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDone: {
    borderColor: Colors.dark.teal,
    opacity: 0.75,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: 700,
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: '#E24B4A',
  },
});
