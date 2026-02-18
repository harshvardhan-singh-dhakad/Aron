
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Search, PlusCircle, MessageSquare, User, TrendingUp, Briefcase, Wrench, ShoppingBag } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', icon: Home, route: '/' },
    { name: 'Kiraya', icon: TrendingUp, route: '/listings/rentals' },
    { name: 'Jobs', icon: Briefcase, route: '/listings/jobs' },
    { name: 'Services', icon: Wrench, route: '/listings/services' },
    { name: 'Buy/Sell', icon: ShoppingBag, route: '/listings/buy-sell' },
  ];

  return (
    <SafeAreaView edges={['bottom']} className="bg-white border-t border-gray-200">
      <View className="flex-row justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.route || (tab.route !== '/' && pathname.startsWith(tab.route));
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(tab.route as any)}
              className="items-center justify-center flex-1"
            >
              <tab.icon
                size={24}
                color={isActive ? '#000' : '#9CA3AF'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text className={`text-[10px] mt-1 ${isActive ? 'font-bold text-black' : 'text-gray-400'}`}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
