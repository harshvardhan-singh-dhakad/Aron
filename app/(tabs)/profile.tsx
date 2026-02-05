import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Alert,
    Image,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import {
    User,
    MapPin,
    Phone,
    BadgeCheck,
    Clock,
    XCircle,
    AlertCircle,
    LogOut,
    FileText,
    ChevronRight,
    Upload
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { user, userProfile, signOut } = useAuth();
    const router = useRouter();

    const [uploading, setUploading] = useState(false);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                            router.replace('/(auth)/login');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout');
                        }
                    }
                },
            ]
        );
    };

    const handleUploadDocuments = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (!result.canceled) {
            setUploading(true);
            // In real app, upload to Firebase Storage and create verification request
            setTimeout(() => {
                setUploading(false);
                Alert.alert(
                    'Documents Submitted',
                    'Your documents have been submitted for verification. This usually takes 24-48 hours.'
                );
            }, 2000);
        }
    };

    const getVerificationBadge = () => {
        switch (userProfile?.verificationStatus) {
            case 'approved':
                return (
                    <View style={[styles.badge, { backgroundColor: '#22C55E20' }]}>
                        <BadgeCheck size={16} color="#22C55E" />
                        <Text style={[styles.badgeText, { color: '#22C55E' }]}>Verified</Text>
                    </View>
                );
            case 'pending':
                return (
                    <View style={[styles.badge, { backgroundColor: `${colors.primary}20` }]}>
                        <Clock size={16} color={colors.primary} />
                        <Text style={[styles.badgeText, { color: colors.primary }]}>Pending</Text>
                    </View>
                );
            case 'rejected':
                return (
                    <View style={[styles.badge, { backgroundColor: `${colors.destructive}20` }]}>
                        <XCircle size={16} color={colors.destructive} />
                        <Text style={[styles.badgeText, { color: colors.destructive }]}>Rejected</Text>
                    </View>
                );
            default:
                return (
                    <View style={[styles.badge, { backgroundColor: `${colors.textSecondary}20` }]}>
                        <AlertCircle size={16} color={colors.textSecondary} />
                        <Text style={[styles.badgeText, { color: colors.textSecondary }]}>Not Verified</Text>
                    </View>
                );
        }
    };

    if (!user) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                <User size={64} color={colors.primary} />
                <Text style={[styles.warningTitle, { color: colors.text }]}>Login Required</Text>
                <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                    Please login to view your profile
                </Text>
                <TouchableOpacity
                    style={[styles.loginButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: colors.primary }]}>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: colors.card }]}>
                        <Text style={[styles.avatarText, { color: colors.primary }]}>
                            {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                    {getVerificationBadge()}
                </View>
                <Text style={styles.userName}>{userProfile?.name || 'User'}</Text>
                <View style={styles.locationRow}>
                    <MapPin size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.userLocation}>{userProfile?.location || 'Location not set'}</Text>
                </View>
            </View>

            {/* Profile Info Cards */}
            <View style={styles.section}>
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <Phone size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone Number</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {userProfile?.phoneNumber || user?.phoneNumber || 'Not available'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Document Verification Section */}
            {userProfile?.verificationStatus !== 'approved' && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Document Verification</Text>
                    <View style={[styles.verificationCard, { backgroundColor: colors.card }]}>
                        <FileText size={32} color={colors.primary} />
                        <View style={styles.verificationContent}>
                            <Text style={[styles.verificationTitle, { color: colors.text }]}>
                                Upload ID Documents
                            </Text>
                            <Text style={[styles.verificationText, { color: colors.textSecondary }]}>
                                Upload Aadhar or PAN card to get verified and unlock all features
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.uploadButton, { backgroundColor: colors.primary }]}
                        onPress={handleUploadDocuments}
                        disabled={uploading}
                    >
                        <Upload size={20} color="#FFF" />
                        <Text style={styles.uploadButtonText}>
                            {uploading ? 'Uploading...' : 'Upload Documents'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* My Listings */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>My Listings</Text>
                <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: colors.card }]}
                    onPress={() => {/* Navigate to my listings */ }}
                >
                    <View style={styles.menuLeft}>
                        <FileText size={20} color={colors.primary} />
                        <Text style={[styles.menuText, { color: colors.text }]}>View My Listings</Text>
                    </View>
                    <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Logout */}
            <View style={styles.section}>
                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: colors.card }]}
                    onPress={handleLogout}
                >
                    <LogOut size={20} color={colors.destructive} />
                    <Text style={[styles.logoutText, { color: colors.destructive }]}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 32 }} />
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
    loginButton: {
        marginTop: 24,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileHeader: {
        padding: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    userLocation: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoContent: {
        marginLeft: 12,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    verificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    verificationContent: {
        flex: 1,
        marginLeft: 12,
    },
    verificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    verificationText: {
        fontSize: 13,
        lineHeight: 18,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 12,
        gap: 8,
    },
    uploadButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
