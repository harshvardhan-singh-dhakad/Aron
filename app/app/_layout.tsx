import { Stack } from 'expo-router';
import { View } from 'react-native';
import BottomTab from '../components/BottomTab';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../styles/globals.css';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-white">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="listings/[category]" />
          <Stack.Screen name="listing/[id]" />
          <Stack.Screen name="post-ad" />
          <Stack.Screen name="inbox" />
        </Stack>
        <BottomTab />
      </View>
    </SafeAreaProvider>
  );
}
