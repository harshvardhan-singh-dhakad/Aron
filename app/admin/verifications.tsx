import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Image,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle, XCircle, User, Phone, FileText, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VerificationRequest {
    id: string;
    userId: string;
    userName: string;
    userPhone: string;
    documentType: 'pan' | 'aadhar' | 'gst';
    documentImage: string;
    documentNumber: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
}

export default function AdminVerifications() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            const q = query(
                collection(db, 'verifications'),
                where('status', '==', 'pending')
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as VerificationRequest[];
            setRequests(data);
        } catch (error) {
            console.error('Error fetching verifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (requestId: string, userId: string, action: 'approved' | 'rejected') => {
        setActionLoading(requestId);
        try {
            // Update verification status
            await updateDoc(doc(db, 'verifications', requestId), {
                status: action,
                updatedAt: serverTimestamp(),
            });

            // Update user's verification status
            await updateDoc(doc(db, 'users', userId), {
                verificationStatus: action,
                updatedAt: serverTimestamp(),
            });

            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== requestId));

            Alert.alert(
                'Success',
                `User verification ${action === 'approved' ? 'approved' : 'rejected'} successfully!`
            );
        } catch (error) {
            console.error('Error updating verification:', error);
            Alert.alert('Error', 'Failed to update verification status');
        } finally {
            setActionLoading(null);
        }
    };

    const getDocumentLabel = (type: string) => {
        switch (type) {
            case 'pan': return 'PAN Card';
            case 'aadhar': return 'Aadhar Card';
            case 'gst': return 'GST Certificate';
            default: return type;
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: '#F3F4F6' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading requests...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: '#F3F4F6' }]}
            contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => {
                    setRefreshing(true);
                    fetchRequests();
                }} />
            }
        >
            {/* Stats */}
            <View style={[styles.statsCard, { backgroundColor: colors.primary }]}>
                <Clock size={24} color="#FFF" />
                <Text style={styles.statsText}>{requests.length} Pending Verification{requests.length !== 1 ? 's' : ''}</Text>
            </View>

            {requests.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <CheckCircle size={64} color={colors.success} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>All caught up!</Text>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        No pending verification requests.
                    </Text>
                </View>
            ) : (
                <View style={styles.listContainer}>
                    {requests.map((request) => (
                        <View key={request.id} style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
                            {/* User Info */}
                            <View style={styles.userInfo}>
                                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                    <User size={24} color="#FFF" />
                                </View>
                                <View style={styles.userDetails}>
                                    <Text style={[styles.userName, { color: colors.text }]}>
                                        {request.userName || 'Unknown User'}
                                    </Text>
                                    <View style={styles.phoneRow}>
                                        <Phone size={14} color={colors.textSecondary} />
                                        <Text style={[styles.userPhone, { color: colors.textSecondary }]}>
                                            {request.userPhone}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Document Type */}
                            <View style={[styles.docBadge, { backgroundColor: '#EBF5FF' }]}>
                                <FileText size={16} color={colors.primary} />
                                <Text style={[styles.docType, { color: colors.primary }]}>
                                    {getDocumentLabel(request.documentType)}
                                </Text>
                            </View>

                            {/* Document Image */}
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: request.documentImage }}
                                    style={styles.docImage}
                                    resizeMode="cover"
                                />
                            </View>

                            {/* Document Number */}
                            <View style={[styles.numberBox, { backgroundColor: '#F9FAFB' }]}>
                                <Text style={[styles.numberLabel, { color: colors.textSecondary }]}>
                                    Document Number:
                                </Text>
                                <Text style={[styles.numberValue, { color: colors.text }]}>
                                    {request.documentNumber}
                                </Text>
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.rejectBtn]}
                                    onPress={() => handleAction(request.id, request.userId, 'rejected')}
                                    disabled={actionLoading === request.id}
                                >
                                    {actionLoading === request.id ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <>
                                            <XCircle size={20} color="#FFF" />
                                            <Text style={styles.actionText}>Reject</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.approveBtn]}
                                    onPress={() => handleAction(request.id, request.userId, 'approved')}
                                    disabled={actionLoading === request.id}
                                >
                                    {actionLoading === request.id ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <>
                                            <CheckCircle size={20} color="#FFF" />
                                            <Text style={styles.actionText}>Approve</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
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
    statsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        gap: 10,
    },
    statsText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    listContainer: {
        padding: 16,
        gap: 16,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userDetails: {
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },
    userPhone: {
        fontSize: 13,
    },
    docBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        marginBottom: 12,
    },
    docType: {
        fontSize: 13,
        fontWeight: '500',
    },
    imageContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
    },
    docImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#E5E7EB',
    },
    numberBox: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
    },
    numberLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    numberValue: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    rejectBtn: {
        backgroundColor: '#EF4444',
    },
    approveBtn: {
        backgroundColor: '#22C55E',
    },
    actionText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
});
