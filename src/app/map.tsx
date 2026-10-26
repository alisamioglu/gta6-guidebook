import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  GestureDetector,
  useExclusiveGestures,
  useLongPressGesture,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  MapPin,
  MISSION_SIZE,
  MissionBadge,
  MissionMarker,
  PIN_SIZE,
  PinShape,
} from '@/components/map-pin';
import { PinList } from '@/components/pin-list';
import { PinSheet } from '@/components/pin-sheet';
import { categoryColor, PIN_CATEGORIES, PinCategory } from '@/constants/pins';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { missions } from '@/data/missions';
import { useMissionProgress } from '@/hooks/use-mission-progress';
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
  const { completed } = useMissionProgress();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mission?: string; t?: string }>();
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [editing, setEditing] = useState<Pin | null>(null);
  const [showList, setShowList] = useState(false);
  const [filter, setFilter] = useState<PinCategory | 'all'>('all');
  const [layers, setLayers] = useState({ missions: true, notes: true });
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const area = useSharedValue({ width: 0, height: 0, mapWidth: 0, mapHeight: 0 });
  const pinchStart = useSharedValue({ scale: 1, x: 0, y: 0, focalX: 0, focalY: 0 });
  const lastPan = useSharedValue({ x: 0, y: 0 });
  const pinching = useSharedValue(false);

  const categoryPins = filter === 'all' ? pins : pins.filter((p) => p.category === filter);
  const visiblePins = layers.notes ? categoryPins : [];
  const showMissions = layers.missions && (filter === 'all' || filter === 'mission');
  const missionIndex = missions.findIndex((m) => m.id === params.mission);
  const mission = missions[missionIndex];

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
  function clampOffset(s: number, x: number, y: number) {
    'worklet';
    const a = area.value;
    const maxX = Math.max(0, (a.mapWidth * s - a.width) / 2);
    const maxY = Math.max(0, (a.mapHeight * s - a.height) / 2);
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  }

  function animateTo(s: number, x: number, y: number) {
    'worklet';
    const offset = clampOffset(s, x, y);
    scale.value = withTiming(s, { duration: 400 });
    offsetX.value = withTiming(offset.x, { duration: 400 });
    offsetY.value = withTiming(offset.y, { duration: 400 });
  }

  // zoom in and center the map on a point (0-1)
  function focusOn(x: number, y: number) {
    const a = area.value;
    const s = Math.max(scale.value, FOCUS_SCALE);
    animateTo(s, -(x * a.mapWidth - a.mapWidth / 2) * s, -(y * a.mapHeight - a.mapHeight / 2) * s);
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
      const offset = clampOffset(
        s,
        start.focalX - (start.focalX - start.x) * k,
        start.focalY - (start.focalY - start.y) * k,
      );
      scale.value = s;
      offsetX.value = offset.x;
      offsetY.value = offset.y;
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
      if (pinching.value) return;
      const offset = clampOffset(scale.value, offsetX.value + dx, offsetY.value + dy);
      offsetX.value = offset.x;
      offsetY.value = offset.y;
    },
  });

  // double tap zooms in, at max zoom it goes back out
  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    onDeactivate: (e) => {
      if (e.canceled) return;
      const s0 = scale.value;
      if (s0 >= MAX_SCALE - 0.01) {
        animateTo(1, 0, 0);
        return;
      }
      const s = Math.min(s0 * 2, MAX_SCALE);
      const k = s / s0;
      const fx = e.x - area.value.width / 2;
      const fy = e.y - area.value.height / 2;
      animateTo(s, fx - (fx - offsetX.value) * k, fy - (fy - offsetY.value) * k);
    },
  });

  const tap = useTapGesture({
    runOnJS: true,
    onDeactivate: (e) => {
      if (!e.canceled) onTap(e.x, e.y);
    },
  });

  // long press drops a pin, so tapping around while looking doesn't
  const longPress = useLongPressGesture({
    runOnJS: true,
    minDuration: 450,
    onActivate: (e) => dropPin(e.x, e.y),
  });

  const taps = useExclusiveGestures(longPress, doubleTap, tap);
  const gesture = useSimultaneousGestures(pinch, pan, taps);

  function onTap(x: number, y: number) {
    if (showList) {
      setShowList(false);
      return;
    }

    const a = area.value;
    const s = scale.value;
    const toScreenX = (px: number) => (px - a.mapWidth / 2) * s + a.width / 2 + offsetX.value;
    const toScreenY = (py: number) => (py - a.mapHeight / 2) * s + a.height / 2 + offsetY.value;

    // notes come first, they matter more than the mission markers
    const hit = visiblePins.find((p) => {
      const dx = toScreenX(p.x * a.mapWidth) - x;
      const dy = toScreenY(p.y * a.mapHeight) - PIN_SIZE / 2 - y;
      return Math.hypot(dx, dy) < PIN_SIZE * 0.75;
    });
    if (hit) {
      setEditing(hit);
      return;
    }

    const missionHit = showMissions
      ? missions.find((m) => {
          const dx = toScreenX(m.location.x * a.mapWidth) - x;
          const dy = toScreenY(m.location.y * a.mapHeight) - y;
          return Math.hypot(dx, dy) < MISSION_SIZE * 0.8;
        })
      : undefined;
    if (missionHit) {
      router.setParams({ mission: missionHit.id, t: String(Date.now()) });
    }
  }

  function dropPin(x: number, y: number) {
    setShowList(false);
    const a = area.value;
    const s = scale.value;
    const mapX = (x - a.width / 2 - offsetX.value) / s + a.mapWidth / 2;
    const mapY = (y - a.height / 2 - offsetY.value) / s + a.mapHeight / 2;
    if (mapX < 0 || mapY < 0 || mapX > a.mapWidth || mapY > a.mapHeight) return;

    setEditing({
      id: Date.now().toString(),
      x: mapX / a.mapWidth,
      y: mapY / a.mapHeight,
      title: '',
      note: '',
      category: filter === 'all' ? 'mission' : filter,
    });
  }

  function goToPin(pin: Pin) {
    focusOn(pin.x, pin.y);
    // make sure notes are visible, otherwise there's nothing to see
    if (!layers.notes) setLayers({ ...layers, notes: true });
    setShowList(false);

    // ring around it for a few seconds so it's easy to spot
    setHighlightedId(pin.id);
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightedId(null), 3500);
  }

  function resetZoom() {
    animateTo(1, 0, 0);
  }

  const mapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scale.value },
    ],
  }));

  // coming from "show on map" on a mission
  useEffect(() => {
    if (mission && mapSize.width > 0) focusOn(mission.location.x, mission.location.y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.t, mapSize.width]);

  const isNew = !!editing && !pins.some((p) => p.id === editing.id);
  const shownPins = isNew ? [...visiblePins, editing] : visiblePins;
  const countText =
    filter === 'all'
      ? `${pins.length} ${pins.length === 1 ? 'pin' : 'pins'}`
      : `${visiblePins.length} of ${pins.length} pins`;

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.area} onLayout={onLayout}>
          <Animated.View style={[mapSize, mapStyle]}>
            {/* keep the full size image so zooming in stays sharp */}
            <Image
              source={require('@/assets/images/map.webp')}
              style={StyleSheet.absoluteFill}
              allowDownscaling={false}
            />
            {showMissions &&
              missions.map((m, i) => {
                const selected = m.id === mission?.id;
                return (
                  <MissionMarker
                    // new key restarts the ring each time
                    key={selected ? `${m.id}-${params.t}` : m.id}
                    left={m.location.x * mapSize.width}
                    top={m.location.y * mapSize.height}
                    number={i + 1}
                    done={completed.includes(m.id)}
                    mapScale={scale}
                    highlighted={selected}
                  />
                );
              })}
            {shownPins.map((p) => (
              <MapPin
                key={p.id}
                left={p.x * mapSize.width}
                top={p.y * mapSize.height}
                color={categoryColor(p.category)}
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
                <Text style={styles.subtitle}>{countText}</Text>
              </View>
              <SymbolView
                name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
                size={16}
                tintColor="#fff"
                style={{ transform: [{ rotate: showList ? '180deg' : '0deg' }] }}
              />
            </Pressable>
            {showList && <PinList pins={categoryPins} onSelect={goToPin} />}
          </View>
          <View style={styles.rightColumn} pointerEvents="box-none">
            <Pressable
              onPress={resetZoom}
              style={({ pressed }) => [styles.card, styles.resetButton, pressed && styles.pressed]}>
              <Text style={styles.resetText}>Reset zoom</Text>
            </Pressable>

            <View style={[styles.card, styles.legend]}>
              {(
                [
                  {
                    key: 'notes',
                    label: 'Your notes',
                    icon: <PinShape color={categoryColor('collectible')} />,
                  },
                  { key: 'missions', label: 'Missions', icon: <MissionBadge number={1} /> },
                ] as const
              ).map((layer) => {
                const on = layers[layer.key];
                return (
                  <Pressable
                    key={layer.key}
                    onPress={() => setLayers({ ...layers, [layer.key]: !on })}
                    style={({ pressed }) => [styles.legendRow, pressed && styles.pressed]}>
                    <View style={[styles.check, on && styles.checkOn]}>
                      {on && (
                        <SymbolView
                          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                          size={12}
                          weight="bold"
                          tintColor={Colors.dark.background}
                        />
                      )}
                    </View>
                    <View style={[styles.legendIcon, !on && styles.legendOff]}>{layer.icon}</View>
                    <Text style={[styles.legendText, !on && styles.legendOff]}>{layer.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View
        style={[styles.bottom, { bottom: insets.bottom + BottomTabInset + Spacing.four }]}
        pointerEvents="box-none">
        {mission && showMissions ? (
          <View style={styles.missionPill}>
            <View style={styles.missionDot} />
            <Text style={styles.missionText} numberOfLines={1}>
              {missionIndex + 1}. {mission.title}
            </Text>
            <Pressable onPress={() => router.setParams({ mission: '', t: '' })} hitSlop={10}>
              <Text style={styles.missionClose}>Close</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.hint} pointerEvents="none">
            <SymbolView
              name={{ ios: 'hand.tap', android: 'touch_app', web: 'touch_app' }}
              size={14}
              tintColor={Colors.dark.pink}
            />
            <Text style={styles.hintText}>Press and hold to drop a pin</Text>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}>
          {[{ id: 'all' as const, label: 'All', color: '#fff' }, ...PIN_CATEGORIES].map((c) => {
            const selected = filter === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setFilter(c.id)}
                style={[styles.filter, selected && { backgroundColor: c.color }]}>
                {c.id !== 'all' && !selected && (
                  <View style={[styles.filterDot, { backgroundColor: c.color }]} />
                )}
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
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
    backgroundColor: 'rgba(14, 11, 20, 0.88)',
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
    fontWeight: 700,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  resetButton: {
    marginTop: Spacing.one,
  },
  legend: {
    gap: Spacing.one,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  legendIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 0.75 }],
  },
  legendOff: {
    opacity: 0.4,
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.dark.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: Colors.dark.pink,
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 500,
  },
  resetText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
  },
  pressed: {
    opacity: 0.7,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: Spacing.two,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
    backgroundColor: 'rgba(14, 11, 20, 0.7)',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + Spacing.half,
  },
  hintText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: 500,
  },
  missionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    maxWidth: '90%',
    backgroundColor: 'rgba(14, 11, 20, 0.92)',
    borderColor: Colors.dark.pink,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  missionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.pink,
  },
  missionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    flexShrink: 1,
  },
  missionClose: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
  },
  filters: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'rgba(14, 11, 20, 0.88)',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
  },
  filterTextSelected: {
    color: '#0E0B14',
    fontWeight: 700,
  },
});
