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

import { PhotoViewer } from '@/components/photo-viewer';
import { PinPhotos } from '@/components/pin-photos';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { categoryColor, PIN_CATEGORIES } from '@/constants/pins';
import { Spacing } from '@/constants/theme';
import { Pin } from '@/hooks/use-pins';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n/language';
import { deletePhoto } from '@/utils/photos';

type Props = {
  pin: Pin;
  isNew: boolean;
  onSave: (pin: Pin) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export function PinSheet({ pin, isNew, onSave, onDelete, onClose }: Props) {
  const theme = useTheme();
  const t = useT();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState(pin.title);
  const [note, setNote] = useState(pin.note);
  const [category, setCategory] = useState(pin.category);
  const [photos, setPhotos] = useState(pin.photos ?? []);
  const [viewing, setViewing] = useState<string | null>(null);
  const color = categoryColor(category);
  const savedPhotos = pin.photos ?? [];

  // clean up files so they don't pile up on the phone
  function close() {
    photos.filter((p) => !savedPhotos.includes(p)).forEach(deletePhoto);
    onClose();
  }

  function save() {
    savedPhotos.filter((p) => !photos.includes(p)).forEach(deletePhoto);
    onSave({ ...pin, title: title.trim() || t('untitled'), note, category, photos });
  }

  function remove() {
    [...new Set([...savedPhotos, ...photos])].forEach(deletePhoto);
    onDelete(pin.id);
  }

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement },
  ];

  return (
    <Modal
      transparent
      animationType="slide"
      onRequestClose={() => (viewing ? setViewing(null) : close())}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={close} />

        <ThemedView style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={[styles.handle, { backgroundColor: theme.backgroundSelected }]} />

          <View style={styles.header}>
            <View style={[styles.badge, { backgroundColor: color }]} />
            <ThemedText type="default" style={styles.flex}>
              {isNew ? t('newPin') : t('editPin')}
            </ThemedText>
            <Pressable onPress={close} hitSlop={10}>
              <ThemedText type="small" themeColor="textSecondary">
                {t('close')}
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
                    {t(c.label)}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={t('title')}
            placeholderTextColor={theme.textSecondary}
            style={inputStyle}
          />
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t('writeNote')}
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[inputStyle, styles.note]}
          />

          <PinPhotos
            photos={photos}
            onOpen={setViewing}
            onAdd={(uri) => setPhotos([...photos, uri])}
            onRemove={(uri) => {
              // only delete right away if it was never saved, otherwise wait for save
              if (!savedPhotos.includes(uri)) deletePhoto(uri);
              setPhotos(photos.filter((p) => p !== uri));
            }}
          />

          <View style={styles.buttons}>
            {!isNew && (
              <Pressable
                onPress={remove}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: theme.backgroundElement },
                  pressed && styles.pressed,
                ]}>
                <ThemedText type="smallBold" style={styles.deleteText}>
                  {t('delete')}
                </ThemedText>
              </Pressable>
            )}
            <Pressable
              onPress={save}
              style={({ pressed }) => [
                styles.button,
                styles.flex,
                { backgroundColor: color },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={styles.saveText}>
                {t('savePin')}
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>

      {/* over the whole sheet, not a second modal, so it always closes */}
      {viewing && <PhotoViewer uri={viewing} onClose={() => setViewing(null)} />}
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
    minHeight: 80,
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
