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
import { Spacing } from '@/constants/theme';
import { Pin } from '@/hooks/use-pins';
import { useTheme } from '@/hooks/use-theme';

export const PIN_COLORS = ['#D4537E', '#1D9E75', '#EF9F27', '#7F77DD'];

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
  const [color, setColor] = useState(pin.color);

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

          <View style={styles.colors}>
            {PIN_COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.color,
                  { backgroundColor: c },
                  c === color && { borderColor: theme.text },
                ]}
              />
            ))}
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
              onPress={() => onSave({ ...pin, title: title.trim() || 'Untitled', note, color })}
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
  colors: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  color: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'transparent',
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
