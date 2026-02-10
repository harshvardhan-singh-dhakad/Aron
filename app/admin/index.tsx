import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Users, FileCheck, ClipboardList, Shield } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminDashboard() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const menuItems = [
        {
            id: 'verifications',
            title: 'User Verifications',
            description: 'Review and approve user verification requests',
            icon: FileCheck,
            color: '#3B82F6',
            route: '/admin/verifications',
        },
        {
            id: 'listings',
            title: 'Pending Listings',
            description: 'Review and approve new listings',
            icon: ClipboardList,
            color: '#F97316',
            route: '/admin/listings',
        },
        {
            id: 'users',
            title: 'Manage Users',
            description: 'View all users and manage their status',
            icon: Users,
            color: '#22C55E',
            route: '/admin/users',
        },
    ];

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: '#F3F4F6' }]}
            contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
        >
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <Shield size={48} color="#FFF" />
                <Text style={styles.headerTitle}>Admin Panel</Text>
                <Text style={styles.headerSubtitle}>Manage your Aron platform</Text>
            </View>

            {/* Menu Cards */}
            <View style={styles.menuContainer}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.menuCard, { backgroundColor: '#FFFFFF' }]}
                        onPress={() => router.push(item.route as any)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                            <item.icon size={28} color={item.color} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                            <Text style={[styles.menuDescription, { color: colors.textSecondary }]}>
                                {item.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 32,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 12,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    menuContainer: {
        padding: 16,
        gap: 12,
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContent: {
        flex: 1,
        marginLeft: 16,
    },
    menuTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    menuDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
});
