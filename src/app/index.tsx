import { Redirect } from 'expo-router';

// app opens on missions
export default function Index() {
  return <Redirect href="/missions" />;
}
