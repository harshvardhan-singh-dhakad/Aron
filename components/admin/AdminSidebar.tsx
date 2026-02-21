import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
    BarChart3,
    Users,
    List,
    ShieldAlert,
    CheckCircle2,
    Wallet,
    ArrowUpRight,
    Bell,
    Layers,
    Image as ImageIcon,
    History,
    Settings,
    LayoutDashboard
} from 'lucide-react-native';

const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'listings', label: 'Listings', icon: List, href: '/admin/listings' },
    { id: 'reports', label: 'Reports & Safety', icon: ShieldAlert, href: '/admin/reports' },
    { id: 'verifications', label: 'Verifications (KYC)', icon: CheckCircle2, href: '/admin/verifications' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, href: '/admin/wallet' },
    { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpRight, href: '/admin/withdrawals' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/admin/notifications' },
    { id: 'content', label: 'Content & Categories', icon: Layers, href: '/admin/content' },
    { id: 'banners', label: 'Banners', icon: ImageIcon, href: '/admin/banners' },
    { id: 'logs', label: 'Admin Logs', icon: History, href: '/admin/logs' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <View style={styles.sidebar}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>ARON</Text>
                <Text style={styles.logoSubtext}>OPS CONTROL</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.navScroll}>
                {adminNavItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.navItem, isActive && styles.navItemActive]}
                            onPress={() => router.push(item.href as any)}
                        >
                            <item.icon
                                size={20}
                                color={isActive ? '#0066FF' : '#94A3B8'}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>v1.0.4-prod</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        width: 260,
        backgroundColor: '#0F172A', // Slate 900
        height: '100%',
        borderRightWidth: 1,
        borderRightColor: '#1E293B',
    },
    logoContainer: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
        marginBottom: 12,
    },
    logoText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#F8FAFC',
        letterSpacing: 1,
    },
    logoSubtext: {
        fontSize: 10,
        fontWeight: '700',
        color: '#3B82F6',
        letterSpacing: 2,
        marginTop: 2,
    },
    navScroll: {
        flex: 1,
        paddingHorizontal: 12,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 4,
        gap: 12,
    },
    navItemActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    navLabel: {
        color: '#94A3B8', // Slate 400
        fontSize: 14,
        fontWeight: '500',
    },
    navLabelActive: {
        color: '#F8FAFC',
        fontWeight: '700',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#1E293B',
    },
    footerText: {
        color: '#475569',
        fontSize: 10,
        textAlign: 'center',
    },
});
