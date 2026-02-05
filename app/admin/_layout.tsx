import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function AdminLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.primary,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
            <Stack.Screen name="users" options={{ title: 'Manage Users' }} />
            <Stack.Screen name="listings" options={{ title: 'Manage Listings' }} />
            <Stack.Screen name="verifications" options={{ title: 'Verification Requests' }} />
            <Stack.Screen name="applications" options={{ title: 'Applications' }} />
        </Stack>
    );
}
