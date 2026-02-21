import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, Bell, User, Menu } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminHeader() {
    const { userProfile } = useAuth();

    return (
        <View style={styles.header}>
            <View style={styles.left}>
                <TouchableOpacity style={styles.menuButton}>
                    <Menu size={20} color="#64748B" />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Search size={18} color="#94A3B8" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search users, listings, or tickets..."
                        placeholderTextColor="#94A3B8"
                    />
                </View>
            </View>

            <View style={styles.right}>
                <TouchableOpacity style={styles.iconButton}>
                    <Bell size={20} color="#64748B" />
                    <View style={styles.badge} />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.profileButton}>
                    <View style={styles.avatar}>
                        <User size={20} color="#FFF" />
                    </View>
                    <View style={styles.profileText}>
                        <Text style={styles.adminName}>{userProfile?.name || 'Admin User'}</Text>
                        <Text style={styles.adminRole}>Super Admin</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 64,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    menuButton: {
        padding: 8,
        borderRadius: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        paddingHorizontal: 12,
        width: '60%',
        maxWidth: 500,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
        outlineStyle: 'none',
    } as any,
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        padding: 8,
        borderRadius: 8,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        backgroundColor: '#EF4444',
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#E2E8F0',
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        display: 'flex',
    },
    adminName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    adminRole: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
    },
});
