import { Tabs } from 'expo-router';
import { useColorScheme, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import {
    Home,
    TrendingUp,
    Briefcase,
    Wrench,
    ShoppingBag,
    Plus,
    Bell,
    User
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function TabLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: colors.tabBarActive,
                    tabBarInactiveTintColor: colors.tabBarInactive,
                    tabBarStyle: {
                        backgroundColor: colors.tabBar,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                        height: 60 + insets.bottom,
                        paddingBottom: 6 + insets.bottom,
                        paddingTop: 6,
                    },
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '500',
                    },
                    headerStyle: {
                        backgroundColor: colors.card,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: colors.primary,
                        fontSize: 22,
                    },
                    headerRight: () => (
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.headerIcon}
                                onPress={() => router.push('/(tabs)/inbox')}
                            >
                                <Bell size={24} color={colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.headerIcon}
                                onPress={() => router.push('/(tabs)/profile')}
                            >
                                <User size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                        headerTitle: 'Aron',
                    }}
                />
                <Tabs.Screen
                    name="kiraya"
                    options={{
                        title: 'Kiraya',
                        tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
                        headerTitle: 'Kiraya',
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            router.push('/listings/rent');
                        },
                    }}
                />
                <Tabs.Screen
                    name="jobs"
                    options={{
                        title: 'Jobs',
                        tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
                        headerTitle: 'Jobs',
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            router.push('/listings/jobs');
                        },
                    }}
                />
                <Tabs.Screen
                    name="services"
                    options={{
                        title: 'Services',
                        tabBarIcon: ({ color, size }) => <Wrench size={size} color={color} />,
                        headerTitle: 'Services',
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            router.push('/listings/services');
                        },
                    }}
                />
                <Tabs.Screen
                    name="buy-sell"
                    options={{
                        title: 'Buy/Sell',
                        tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
                        headerTitle: 'Buy & Sell',
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            router.push('/listings/buy-sell');
                        },
                    }}
                />
                {/* Hidden tabs */}
                <Tabs.Screen
                    name="post-ad"
                    options={{ href: null, headerTitle: 'Post Ad' }}
                />
                <Tabs.Screen
                    name="business"
                    options={{ href: null }}
                />
                <Tabs.Screen
                    name="search"
                    options={{ href: null, headerTitle: 'Search' }}
                />
                <Tabs.Screen
                    name="inbox"
                    options={{ href: null, headerTitle: 'Notifications' }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{ href: null, headerTitle: 'Profile' }}
                />
            </Tabs>

            {/* Floating Post Button - Right Side */}
            <TouchableOpacity
                style={[
                    styles.floatingButton,
                    {
                        backgroundColor: colors.accent,
                        bottom: 80 + insets.bottom,
                    }
                ]}
                onPress={() => router.push('/(tabs)/post-ad')}
            >
                <Plus size={28} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
    },
    headerIcon: {
        padding: 8,
        marginLeft: 4,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 100,
    },
});
