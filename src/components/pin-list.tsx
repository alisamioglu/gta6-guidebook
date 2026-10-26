import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { Pin } from '@/hooks/use-pins';

type Props = {
  pins: Pin[];
  onSelect: (pin: Pin) => void;
};

export function PinList({ pins, onSelect }: Props) {
  if (pins.length === 0) {
    return (
      <View style={styles.list}>
        <Text style={styles.empty}>No pins yet. Tap the map to add one.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.content}>
      {pins.map((pin) => (
        <Pressable
          key={pin.id}
          onPress={() => onSelect(pin)}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          <View style={[styles.dot, { backgroundColor: pin.color }]} />
          <View style={styles.texts}>
            <Text style={styles.title} numberOfLines={1}>
              {pin.title}
            </Text>
            {!!pin.note && (
              <Text style={styles.note} numberOfLines={1}>
                {pin.note}
              </Text>
            )}
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: Spacing.two,
    width: 260,
    maxHeight: 340,
    backgroundColor: 'rgba(16, 20, 24, 0.92)',
    borderRadius: Spacing.three,
  },
  content: {
    padding: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  pressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  texts: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 500,
  },
  note: {
    color: '#B0B4BA',
    fontSize: 12,
  },
  empty: {
    color: '#B0B4BA',
    fontSize: 13,
    padding: Spacing.three,
  },
});
