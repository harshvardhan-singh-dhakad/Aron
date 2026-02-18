import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Briefcase, Wrench, User, TrendingUp, Store } from 'lucide-react-native';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/listings/rent', label: 'Kiraya', icon: TrendingUp },
  { href: '/listings/services', label: 'Services', icon: Wrench },
  { href: '/listings/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/listings/buy-sell', label: 'Buy/Sell', icon: Store },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="w-64 flex-col border-r border-gray-200 bg-white hidden md:flex h-full">
      <View className="flex h-16 items-center border-b border-gray-200 px-6 justify-center">
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text className="text-2xl font-bold text-blue-600">
            Aron
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 p-4">
        {navItems.map(item => {
          const isActive =
            (item.href === '/' && pathname === item.href) ||
            (item.href !== '/' && pathname.startsWith(item.href));

          const isServicesActive = item.href.includes('services') && isActive;
          const isKirayaActive = item.href.includes('rent') && isActive;
          const isJobsActive = item.href.includes('jobs') && isActive;
          const isProfileActive = item.href.includes('profile') && isActive;
          const isBuySellActive = item.href.includes('buy-sell') && isActive;

          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => router.push(item.href as any)}
              className={`flex-row items-center gap-3 rounded-lg px-4 py-3 mb-1 transition-all ${isActive ? 'bg-blue-50' : ''
                } ${isServicesActive ? 'bg-green-50' : ''} ${isKirayaActive ? 'bg-blue-50' : ''} ${isJobsActive ? 'bg-purple-50' : ''} ${isProfileActive ? 'bg-orange-50' : ''} ${isBuySellActive ? 'bg-teal-50' : ''}`}
            >
              <item.icon size={20} color={isActive ? '#2563EB' : '#4B5563'} />
              <Text className={`${isActive ? 'font-bold text-blue-600' : 'font-medium text-gray-600'}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
