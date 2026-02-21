import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme, Platform } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace('/login');
            return;
        }

        // Final check: if userProfile exists but isn't an admin, and we are on an admin route
        if (userProfile !== null && userProfile.isAdmin === false) {
            console.log('AdminLayout: ACCESS DENIED - User is explicitly not an admin', {
                uid: user.uid,
                profileIsAdmin: userProfile.isAdmin
            });
            router.replace('/');
        }
    }, [loading, user, userProfile]);

    // Spinner while auth is loading
    if (loading || (user && !userProfile)) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // Not admin — show nothing while redirect fires
    if (!user || !userProfile?.isAdmin) {
        return null;
    }

    // Desktop Layout
    if (Platform.OS === 'web') {
        return (
            <View style={styles.adminWrapper}>
                <AdminSidebar />
                <View style={styles.mainContent}>
                    <AdminHeader />
                    <View style={styles.childSlot}>
                        <Slot />
                    </View>
                </View>
            </View>
        );
    }

    // Fallback for native (rarely used for admin, but just in case)
    return (
        <View style={{ flex: 1 }}>
            <Slot />
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    adminWrapper: {
        flexDirection: 'row',
        height: '100vh',
        backgroundColor: '#F8FAFC', // Slate 50
        overflow: 'hidden',
    } as any,
    mainContent: {
        flex: 1,
        flexDirection: 'column',
    },
    childSlot: {
        flex: 1,
        overflow: 'auto',
    } as any,
});
