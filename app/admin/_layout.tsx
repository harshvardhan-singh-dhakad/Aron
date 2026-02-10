import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { userProfile } = useAuth();

    // Check if user is admin (Disabled for development)
    // if (!userProfile?.isAdmin) {
    //     return (
    //         <View style={[styles.container, { backgroundColor: colors.background }]}>
    //             <Text style={[styles.title, { color: colors.destructive }]}>Access Denied</Text>
    //             <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
    //                 You don't have admin privileges.
    //             </Text>
    //         </View>
    //     );
    // }

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Admin Dashboard',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="verifications"
                options={{
                    title: 'User Verifications',
                }}
            />
            <Stack.Screen
                name="listings"
                options={{
                    title: 'Pending Listings',
                }}
            />
            <Stack.Screen
                name="users"
                options={{
                    title: 'Manage Users',
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
});
