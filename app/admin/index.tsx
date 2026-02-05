import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import {
    Users,
    FileText,
    MessageCircle,
    ShieldCheck,
    ChevronRight,
    AlertCircle
} from 'lucide-react-native';

export default function AdminDashboard() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const { userProfile } = useAuth();

    // Check if user is admin
    if (!userProfile?.isAdmin) {
        return (
            <>
                <Stack.Screen options={{ title: 'Admin Panel' }} />
                <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                    <AlertCircle size={64} color={colors.destructive} />
                    <Text style={[styles.warningTitle, { color: colors.text }]}>Access Denied</Text>
                    <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                        You don't have permission to access this page.
                    </Text>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: colors.primary }]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    // Mock stats
    const stats = [
        { label: 'Total Users', value: 1234, icon: Users, color: '#3B82F6' },
        { label: 'Total Listings', value: 567, icon: FileText, color: '#22C55E' },
        { label: 'Applications', value: 89, icon: MessageCircle, color: '#F97316' },
        { label: 'Pending Verifications', value: 12, icon: ShieldCheck, color: '#A855F7' },
    ];

    const menuItems = [
        { label: 'Manage Users', description: 'View and manage all users', route: '/admin/users' },
        { label: 'Manage Listings', description: 'Approve or reject listings', route: '/admin/listings' },
        { label: 'Verification Requests', description: 'Review user documents', route: '/admin/verifications' },
        { label: 'Applications', description: 'View all applications', route: '/admin/applications' },
    ];

    return (
        <>
            <Stack.Screen options={{ title: 'Admin Dashboard' }} />
            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View
                            key={index}
                            style={[styles.statCard, { backgroundColor: colors.card }]}
                        >
                            <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                                <stat.icon size={24} color={stat.color} />
                            </View>
                            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Management</Text>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, { backgroundColor: colors.card }]}
                            onPress={() => router.push(item.route as any)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuItemContent}>
                                <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.label}</Text>
                                <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]}>
                                    {item.description}
                                </Text>
                            </View>
                            <ChevronRight size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    warningTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    warningText: {
        fontSize: 14,
        textAlign: 'center',
    },
    backButton: {
        marginTop: 24,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 12,
    },
    statCard: {
        width: '47%',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
    },
    menuSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    menuItemDescription: {
        fontSize: 13,
    },
});
