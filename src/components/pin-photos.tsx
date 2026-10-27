import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useT } from '@/i18n/language';
import { pickPhoto, takePhoto } from '@/utils/photos';

const colors = Colors.dark;
const SIZE = 72;

type Props = {
  photos: string[];
  onAdd: (uri: string) => void;
  onRemove: (uri: string) => void;
  onOpen: (uri: string) => void;
};

export function PinPhotos({ photos, onAdd, onRemove, onOpen }: Props) {
  const t = useT();

  async function add(source: 'camera' | 'library') {
    const uri =
      source === 'camera'
        ? await takePhoto(t('cameraNeeded'), t('cameraNeededText'))
        : await pickPhoto();
    if (uri) onAdd(uri);
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t('photos')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Pressable
          onPress={() => add('camera')}
          style={({ pressed }) => [styles.tile, styles.addTile, pressed && styles.pressed]}>
          <SymbolView
            name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
            size={22}
            tintColor={colors.pink}
          />
          <Text style={styles.addText} numberOfLines={1}>
            {t('camera')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => add('library')}
          style={({ pressed }) => [styles.tile, styles.addTile, pressed && styles.pressed]}>
          <SymbolView
            name={{ ios: 'photo.on.rectangle', android: 'photo_library', web: 'photo_library' }}
            size={22}
            tintColor={colors.teal}
          />
          <Text style={styles.addText} numberOfLines={1}>
            {t('gallery')}
          </Text>
        </Pressable>

        {photos.map((uri) => (
          <Pressable key={uri} onPress={() => onOpen(uri)} style={styles.tile}>
            <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
            <Pressable onPress={() => onRemove(uri)} hitSlop={8} style={styles.remove}>
              <SymbolView
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                size={10}
                weight="bold"
                tintColor="#fff"
              />
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: 600,
  },
  row: {
    gap: Spacing.two,
  },
  tile: {
    width: SIZE,
    height: SIZE,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  addTile: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
    backgroundColor: colors.backgroundElement,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.backgroundSelected,
  },
  addText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: 500,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  remove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
