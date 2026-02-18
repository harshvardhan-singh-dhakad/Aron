import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Inbox, User } from 'lucide-react-native';

export default function Header() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text className="text-2xl font-bold text-blue-600">Aron</Text>
      </TouchableOpacity>

      <View className="flex-1" />

      <View className="flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.push('/inbox')} className="p-2">
          <Inbox size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')} className="p-2">
          <User size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
