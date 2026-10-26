import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { categoryColor, PIN_CATEGORIES } from '@/constants/pins';
import { Spacing } from '@/constants/theme';
import { Pin } from '@/hooks/use-pins';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  pin: Pin;
  isNew: boolean;
  onSave: (pin: Pin) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export function PinSheet({ pin, isNew, onSave, onDelete, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState(pin.title);
  const [note, setNote] = useState(pin.note);
  const [category, setCategory] = useState(pin.category);
  const color = categoryColor(category);

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement },
  ];

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <ThemedView style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={[styles.handle, { backgroundColor: theme.backgroundSelected }]} />

          <View style={styles.header}>
            <View style={[styles.badge, { backgroundColor: color }]} />
            <ThemedText type="default" style={styles.flex}>
              {isNew ? 'New pin' : 'Edit pin'}
            </ThemedText>
            <Pressable onPress={onClose} hitSlop={10}>
              <ThemedText type="small" themeColor="textSecondary">
                Close
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.categories}>
            {PIN_CATEGORIES.map((c) => {
              const selected = c.id === category;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCategory(c.id)}
                  style={[
                    styles.category,
                    { borderColor: c.color },
                    selected && { backgroundColor: c.color },
                  ]}>
                  {!selected && <View style={[styles.categoryDot, { backgroundColor: c.color }]} />}
                  <ThemedText type="small" style={selected && styles.categorySelected}>
                    {c.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={theme.textSecondary}
            style={inputStyle}
          />
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Write a note..."
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[inputStyle, styles.note]}
          />

          <View style={styles.buttons}>
            {!isNew && (
              <Pressable
                onPress={() => onDelete(pin.id)}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: theme.backgroundElement },
                  pressed && styles.pressed,
                ]}>
                <ThemedText type="smallBold" style={styles.deleteText}>
                  Delete
                </ThemedText>
              </Pressable>
            )}
            <Pressable
              onPress={() => onSave({ ...pin, title: title.trim() || 'Untitled', note, category })}
              style={({ pressed }) => [
                styles.button,
                styles.flex,
                { backgroundColor: color },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={styles.saveText}>
                Save pin
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    padding: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  badge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categorySelected: {
    color: '#fff',
  },
  input: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  note: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  button: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  deleteText: {
    color: '#E24B4A',
  },
  saveText: {
    color: '#fff',
  },
});
