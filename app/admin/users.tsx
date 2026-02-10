import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { collection, getDocs, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Phone, Shield, ShieldOff, Clock, CheckCircle, XCircle, Users } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UserData {
    id: string;
    name: string;
    phoneNumber: string;
    location: string;
    verificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
    isAdmin: boolean;
    profileCompleted: boolean;
    createdAt: any;
}

export default function AdminUsers() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, 'users'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as UserData[];
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleAdmin = async (userId: string, currentStatus: boolean) => {
        Alert.alert(
            currentStatus ? 'Remove Admin' : 'Make Admin',
            currentStatus
                ? 'Remove admin privileges from this user?'
                : 'Give admin privileges to this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setActionLoading(userId);
                        try {
                            await updateDoc(doc(db, 'users', userId), {
                                isAdmin: !currentStatus,
                                updatedAt: serverTimestamp(),
                            });
                            setUsers(prev => prev.map(u =>
                                u.id === userId ? { ...u, isAdmin: !currentStatus } : u
                            ));
                            Alert.alert('Success', currentStatus ? 'Admin removed' : 'Admin added');
                        } catch (error) {
                            console.error('Error updating admin status:', error);
                            Alert.alert('Error', 'Failed to update admin status');
                        } finally {
                            setActionLoading(null);
                        }
                    },
                },
            ]
        );
    };

    const getVerificationBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return { icon: CheckCircle, color: '#22C55E', label: 'Verified' };
            case 'pending':
                return { icon: Clock, color: '#F59E0B', label: 'Pending' };
            case 'rejected':
                return { icon: XCircle, color: '#EF4444', label: 'Rejected' };
            default:
                return { icon: Clock, color: '#9CA3AF', label: 'Not Verified' };
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: '#F3F4F6' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading users...</Text>
            </View>
        );
    }

    const verifiedCount = users.filter(u => u.verificationStatus === 'approved').length;
    const adminCount = users.filter(u => u.isAdmin).length;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: '#F3F4F6' }]}
            contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => {
                    setRefreshing(true);
                    fetchUsers();
                }} />
            }
        >
            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: '#3B82F6' }]}>
                    <Users size={20} color="#FFF" />
                    <Text style={styles.statNumber}>{users.length}</Text>
                    <Text style={styles.statLabel}>Total Users</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#22C55E' }]}>
                    <CheckCircle size={20} color="#FFF" />
                    <Text style={styles.statNumber}>{verifiedCount}</Text>
                    <Text style={styles.statLabel}>Verified</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#F97316' }]}>
                    <Shield size={20} color="#FFF" />
                    <Text style={styles.statNumber}>{adminCount}</Text>
                    <Text style={styles.statLabel}>Admins</Text>
                </View>
            </View>

            {/* Users List */}
            <View style={styles.listContainer}>
                {users.map((user) => {
                    const verification = getVerificationBadge(user.verificationStatus);
                    const VerificationIcon = verification.icon;

                    return (
                        <View key={user.id} style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
                            <View style={styles.userRow}>
                                {/* Avatar */}
                                <View style={[styles.avatar, { backgroundColor: user.isAdmin ? '#F97316' : colors.primary }]}>
                                    {user.isAdmin ? (
                                        <Shield size={22} color="#FFF" />
                                    ) : (
                                        <User size={22} color="#FFF" />
                                    )}
                                </View>

                                {/* User Info */}
                                <View style={styles.userInfo}>
                                    <Text style={[styles.userName, { color: colors.text }]}>
                                        {user.name || 'Unknown User'}
                                        {user.isAdmin && <Text style={styles.adminTag}> (Admin)</Text>}
                                    </Text>

                                    <View style={styles.phoneRow}>
                                        <Phone size={12} color={colors.textSecondary} />
                                        <Text style={[styles.userPhone, { color: colors.textSecondary }]}>
                                            {user.phoneNumber}
                                        </Text>
                                    </View>

                                    {/* Verification Status */}
                                    <View style={[styles.verificationBadge, { backgroundColor: `${verification.color}15` }]}>
                                        <VerificationIcon size={14} color={verification.color} />
                                        <Text style={[styles.verificationText, { color: verification.color }]}>
                                            {verification.label}
                                        </Text>
                                    </View>
                                </View>

                                {/* Admin Toggle */}
                                <TouchableOpacity
                                    style={[
                                        styles.adminBtn,
                                        { backgroundColor: user.isAdmin ? '#FEE2E2' : '#DCFCE7' }
                                    ]}
                                    onPress={() => toggleAdmin(user.id, user.isAdmin)}
                                    disabled={actionLoading === user.id}
                                >
                                    {actionLoading === user.id ? (
                                        <ActivityIndicator size="small" color={colors.primary} />
                                    ) : user.isAdmin ? (
                                        <ShieldOff size={18} color="#EF4444" />
                                    ) : (
                                        <Shield size={18} color="#22C55E" />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Location */}
                            {user.location && (
                                <Text style={[styles.location, { color: colors.textSecondary }]}>
                                    📍 {user.location}
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    statsRow: {
        flexDirection: 'row',
        padding: 16,
        gap: 10,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },
    statNumber: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 4,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 11,
        marginTop: 2,
    },
    listContainer: {
        paddingHorizontal: 16,
        gap: 10,
    },
    card: {
        borderRadius: 14,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 15,
        fontWeight: '600',
    },
    adminTag: {
        color: '#F97316',
        fontWeight: '500',
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    userPhone: {
        fontSize: 12,
    },
    verificationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    verificationText: {
        fontSize: 11,
        fontWeight: '500',
    },
    adminBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    location: {
        fontSize: 12,
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
});
