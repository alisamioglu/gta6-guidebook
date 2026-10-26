import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { categoryColor } from '@/constants/pins';
import { Spacing } from '@/constants/theme';
import { Pin } from '@/hooks/use-pins';

type Props = {
  pins: Pin[];
  onSelect: (pin: Pin) => void;
};

export function PinList({ pins, onSelect }: Props) {
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const results = pins.filter(
    (p) => p.title.toLowerCase().includes(query) || p.note.toLowerCase().includes(query),
  );

  if (pins.length === 0) {
    return (
      <View style={styles.list}>
        <Text style={styles.empty}>No pins yet. Long press the map to add one.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search pins"
        placeholderTextColor="#8A8597"
        autoCorrect={false}
        style={styles.search}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {results.map((pin) => (
          <Pressable
            key={pin.id}
            onPress={() => onSelect(pin)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={[styles.dot, { backgroundColor: categoryColor(pin.category) }]} />
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
        {results.length === 0 && <Text style={styles.empty}>No pins match</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: Spacing.two,
    width: 260,
    maxHeight: 380,
    backgroundColor: 'rgba(16, 20, 24, 0.92)',
    borderRadius: Spacing.three,
  },
  search: {
    margin: Spacing.two,
    marginBottom: 0,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#fff',
    fontSize: 14,
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
