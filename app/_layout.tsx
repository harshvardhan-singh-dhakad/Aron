
import '../global.css';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import BottomTab from '../components/bottom-nav';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View className="flex-1 bg-white">
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="listings/[category]" />
            <Stack.Screen name="listing/[id]" />
            <Stack.Screen name="post-ad" />
            <Stack.Screen name="inbox" />
            <Stack.Screen name="search" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
          <BottomTab />
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
