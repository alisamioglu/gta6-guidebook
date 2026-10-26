import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  GestureDetector,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MapPin, PIN_SIZE } from '@/components/map-pin';
import { PinList } from '@/components/pin-list';
import { PIN_COLORS, PinSheet } from '@/components/pin-sheet';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { Pin, usePins } from '@/hooks/use-pins';

const MAP_RATIO = 1080 / 1290;
const MAX_SCALE = 6;
const FOCUS_SCALE = 3;

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

export default function MapScreen() {
  const { pins, savePin, deletePin } = usePins();
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [editing, setEditing] = useState<Pin | null>(null);
  const [showList, setShowList] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const area = useSharedValue({ width: 0, height: 0, mapWidth: 0, mapHeight: 0 });
  const pinchStart = useSharedValue({ scale: 1, x: 0, y: 0, focalX: 0, focalY: 0 });
  const lastPan = useSharedValue({ x: 0, y: 0 });
  const pinching = useSharedValue(false);

  function onLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    // fit the whole map on screen
    let mapWidth = width;
    let mapHeight = width / MAP_RATIO;
    if (mapHeight > height) {
      mapHeight = height;
      mapWidth = height * MAP_RATIO;
    }
    area.value = { width, height, mapWidth, mapHeight };
    setMapSize({ width: mapWidth, height: mapHeight });
  }

  // don't let the map slide off screen
  function setOffset(s: number, x: number, y: number) {
    'worklet';
    const a = area.value;
    const maxX = Math.max(0, (a.mapWidth * s - a.width) / 2);
    const maxY = Math.max(0, (a.mapHeight * s - a.height) / 2);
    offsetX.value = clamp(x, -maxX, maxX);
    offsetY.value = clamp(y, -maxY, maxY);
  }

  const pinch = usePinchGesture({
    onActivate: (e) => {
      pinching.value = true;
      pinchStart.value = {
        scale: scale.value,
        x: offsetX.value,
        y: offsetY.value,
        focalX: e.focalX - area.value.width / 2,
        focalY: e.focalY - area.value.height / 2,
      };
    },
    onUpdate: (e) => {
      const start = pinchStart.value;
      const s = clamp(start.scale * e.scale, 1, MAX_SCALE);
      const k = s / start.scale;
      // zoom towards the fingers
      scale.value = s;
      setOffset(s, start.focalX - (start.focalX - start.x) * k, start.focalY - (start.focalY - start.y) * k);
    },
    onDeactivate: () => {
      pinching.value = false;
    },
  });

  const pan = usePanGesture({
    onActivate: () => {
      lastPan.value = { x: 0, y: 0 };
    },
    onUpdate: (e) => {
      const dx = e.translationX - lastPan.value.x;
      const dy = e.translationY - lastPan.value.y;
      lastPan.value = { x: e.translationX, y: e.translationY };
      if (!pinching.value) setOffset(scale.value, offsetX.value + dx, offsetY.value + dy);
    },
  });

  const tap = useTapGesture({
    runOnJS: true,
    onDeactivate: (e) => {
      if (!e.canceled) onTap(e.x, e.y);
    },
  });

  const gesture = useSimultaneousGestures(pinch, pan, tap);

  function onTap(x: number, y: number) {
    if (showList) {
      setShowList(false);
      return;
    }

    const a = area.value;
    const s = scale.value;
    const toScreenX = (px: number) => (px - a.mapWidth / 2) * s + a.width / 2 + offsetX.value;
    const toScreenY = (py: number) => (py - a.mapHeight / 2) * s + a.height / 2 + offsetY.value;

    // tapped an existing pin?
    const hit = pins.find((p) => {
      const dx = toScreenX(p.x * a.mapWidth) - x;
      const dy = toScreenY(p.y * a.mapHeight) - PIN_SIZE / 2 - y;
      return Math.hypot(dx, dy) < PIN_SIZE * 0.75;
    });
    if (hit) {
      setEditing(hit);
      return;
    }

    const mapX = (x - a.width / 2 - offsetX.value) / s + a.mapWidth / 2;
    const mapY = (y - a.height / 2 - offsetY.value) / s + a.mapHeight / 2;
    if (mapX < 0 || mapY < 0 || mapX > a.mapWidth || mapY > a.mapHeight) return;

    setEditing({
      id: Date.now().toString(),
      x: mapX / a.mapWidth,
      y: mapY / a.mapHeight,
      title: '',
      note: '',
      color: PIN_COLORS[0],
    });
  }

  // zoom in and center the map on the pin
  function goToPin(pin: Pin) {
    const a = area.value;
    const s = Math.max(scale.value, FOCUS_SCALE);
    const maxX = Math.max(0, (a.mapWidth * s - a.width) / 2);
    const maxY = Math.max(0, (a.mapHeight * s - a.height) / 2);
    const x = -(pin.x * a.mapWidth - a.mapWidth / 2) * s;
    const y = -(pin.y * a.mapHeight - a.mapHeight / 2) * s;

    scale.value = withTiming(s, { duration: 500 });
    offsetX.value = withTiming(clamp(x, -maxX, maxX), { duration: 500 });
    offsetY.value = withTiming(clamp(y, -maxY, maxY), { duration: 500 });
    setShowList(false);

    // ring around it for a few seconds so it's easy to spot
    setHighlightedId(pin.id);
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightedId(null), 3500);
  }

  function resetZoom() {
    scale.value = withTiming(1);
    offsetX.value = withTiming(0);
    offsetY.value = withTiming(0);
  }

  const mapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scale.value },
    ],
  }));

  const isNew = !!editing && !pins.some((p) => p.id === editing.id);
  const shownPins = isNew ? [...pins, editing] : pins;

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.area} onLayout={onLayout}>
          <Animated.View style={[mapSize, mapStyle]}>
            <Image source={require('@/assets/images/map.webp')} style={StyleSheet.absoluteFill} />
            {shownPins.map((p) => (
              <MapPin
                key={p.id}
                left={p.x * mapSize.width}
                top={p.y * mapSize.height}
                color={p.color}
                mapScale={scale}
                highlighted={p.id === highlightedId}
              />
            ))}
          </Animated.View>
        </View>
      </GestureDetector>

      <SafeAreaView style={styles.overlay} edges={['top']} pointerEvents="box-none">
        <View style={styles.topBar} pointerEvents="box-none">
          <View>
            <Pressable
              onPress={() => setShowList(!showList)}
              style={({ pressed }) => [styles.card, styles.pinsButton, pressed && styles.pressed]}>
              <View>
                <Text style={styles.title}>Map</Text>
                <Text style={styles.subtitle}>
                  {pins.length} {pins.length === 1 ? 'pin' : 'pins'}
                </Text>
              </View>
              <SymbolView
                name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
                size={16}
                tintColor="#fff"
                style={{ transform: [{ rotate: showList ? '180deg' : '0deg' }] }}
              />
            </Pressable>
            {showList && <PinList pins={pins} onSelect={goToPin} />}
          </View>
          <Pressable
            onPress={resetZoom}
            style={({ pressed }) => [styles.card, styles.resetButton, pressed && styles.pressed]}>
            <Text style={styles.resetText}>Reset zoom</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <View style={styles.hint} pointerEvents="none">
        <Text style={styles.hintText}>Tap the map to drop a pin</Text>
      </View>

      {editing && (
        <PinSheet
          key={editing.id}
          pin={editing}
          isNew={isNew}
          onClose={() => setEditing(null)}
          onSave={(pin) => {
            savePin(pin);
            setEditing(null);
          }}
          onDelete={(id) => {
            deletePin(id);
            setEditing(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#384951',
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.three,
    // web has the tab bar on top
    paddingTop: Platform.OS === 'web' ? Spacing.six + Spacing.three : Spacing.two,
  },
  card: {
    backgroundColor: 'rgba(16, 20, 24, 0.85)',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pinsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    alignSelf: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 600,
  },
  subtitle: {
    color: '#B0B4BA',
    fontSize: 13,
  },
  resetButton: {
    marginTop: Spacing.one,
  },
  resetText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
  },
  pressed: {
    opacity: 0.7,
  },
  hint: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: BottomTabInset + Spacing.three,
    backgroundColor: 'rgba(16, 20, 24, 0.85)',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  hintText: {
    color: '#fff',
    fontSize: 13,
  },
});
