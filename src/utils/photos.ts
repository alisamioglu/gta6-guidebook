import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

// picker files live in cache and can get wiped, so copy them to the app's own folder
function keepPhoto(uri: string) {
  if (Platform.OS === 'web') return uri;
  const dir = new Directory(Paths.document, 'photos');
  if (!dir.exists) dir.create();
  const name = `${Date.now()}-${Math.round(Math.random() * 1000)}.jpg`;
  const file = new File(dir, name);
  new File(uri).copySync(file);
  return file.uri;
}

export function deletePhoto(uri: string) {
  if (Platform.OS === 'web') return;
  const file = new File(uri);
  if (file.exists) file.delete();
}

// texts come in already translated
export async function takePhoto(deniedTitle: string, deniedText: string) {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(deniedTitle, deniedText);
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
  if (result.canceled) return null;
  return keepPhoto(result.assets[0].uri);
}

export async function pickPhoto() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });
  if (result.canceled) return null;
  return keepPhoto(result.assets[0].uri);
}
