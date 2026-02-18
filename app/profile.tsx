
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileView } from '../components/ProfileView';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (user) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <ProfileView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-center items-center">
      <View className="items-center mb-10 w-full">
        <View className="w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-6 shadow-sm overflow-hidden border border-gray-100">
          <Image
            source={require('../assets/images/splash-icon.png')}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">Guest User</Text>
        <Text className="text-gray-500 text-center mb-8 px-4">
          Log in to manage your profile, view your applications, and post ads.
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/login')}
          className="w-full bg-blue-600 py-4 rounded-xl items-center shadow-lg active:scale-95 transition-transform"
        >
          <Text className="text-white font-bold text-lg">Login / Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}