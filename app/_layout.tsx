import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <AuthProvider>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.card,
                    },
                    headerTintColor: colors.primary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="listing/[id]"
                    options={{
                        title: 'Listing Details',
                        headerBackTitle: 'Back',
                    }}
                />
                <Stack.Screen
                    name="listings/[categoryId]"
                    options={{
                        title: 'Category',
                        headerBackTitle: 'Back',
                    }}
                />
                <Stack.Screen
                    name="complete-profile"
                    options={{
                        title: 'Complete Profile',
                        headerBackVisible: false,
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}
