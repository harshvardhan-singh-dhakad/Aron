import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Alert,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { BadgeCheck, Clock, XCircle, Trash2, Eye } from 'lucide-react-native';

// Mock verification requests
const mockVerifications = [
    {
        id: '1',
        userName: 'Rahul Sharma',
        userPhone: '+91 9876543210',
        documentType: 'aadhar',
        status: 'pending',
        createdAt: new Date(),
    },
    {
        id: '2',
        userName: 'Priya Singh',
        userPhone: '+91 9876543211',
        documentType: 'pan',
        status: 'pending',
        createdAt: new Date(),
    },
    {
        id: '3',
        userName: 'Amit Kumar',
        userPhone: '+91 9876543212',
        documentType: 'aadhar',
        status: 'approved',
        createdAt: new Date(),
    },
];

export default function AdminVerifications() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const handleApprove = (id: string) => {
        Alert.alert(
            'Approve Verification',
            'Are you sure you want to approve this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Approve', onPress: () => console.log('Approved:', id) },
            ]
        );
    };

    const handleReject = (id: string) => {
        Alert.alert(
            'Reject Verification',
            'Are you sure you want to reject this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reject', style: 'destructive', onPress: () => console.log('Rejected:', id) },
            ]
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <View style={[styles.badge, { backgroundColor: '#22C55E20' }]}>
                        <BadgeCheck size={14} color="#22C55E" />
                        <Text style={[styles.badgeText, { color: '#22C55E' }]}>Approved</Text>
                    </View>
                );
            case 'rejected':
                return (
                    <View style={[styles.badge, { backgroundColor: `${colors.destructive}20` }]}>
                        <XCircle size={14} color={colors.destructive} />
                        <Text style={[styles.badgeText, { color: colors.destructive }]}>Rejected</Text>
                    </View>
                );
            default:
                return (
                    <View style={[styles.badge, { backgroundColor: `${colors.primary}20` }]}>
                        <Clock size={14} color={colors.primary} />
                        <Text style={[styles.badgeText, { color: colors.primary }]}>Pending</Text>
                    </View>
                );
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.content}>
                {mockVerifications.map((item) => (
                    <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={[styles.userName, { color: colors.text }]}>{item.userName}</Text>
                                <Text style={[styles.userPhone, { color: colors.textSecondary }]}>{item.userPhone}</Text>
                            </View>
                            {getStatusBadge(item.status)}
                        </View>

                        <View style={styles.cardBody}>
                            <Text style={[styles.docType, { color: colors.textSecondary }]}>
                                Document: {item.documentType.toUpperCase()}
                            </Text>
                            <Text style={[styles.date, { color: colors.textSecondary }]}>
                                Submitted: {item.createdAt.toLocaleDateString()}
                            </Text>
                        </View>

                        {item.status === 'pending' && (
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.viewBtn, { borderColor: colors.border }]}
                                    onPress={() => Alert.alert('View Document', 'Document viewer would open here')}
                                >
                                    <Eye size={18} color={colors.primary} />
                                    <Text style={[styles.viewBtnText, { color: colors.primary }]}>View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.approveBtn, { backgroundColor: colors.accent }]}
                                    onPress={() => handleApprove(item.id)}
                                >
                                    <BadgeCheck size={18} color="#003333" />
                                    <Text style={styles.approveBtnText}>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.rejectBtn, { backgroundColor: colors.destructive }]}
                                    onPress={() => handleReject(item.id)}
                                >
                                    <XCircle size={18} color="#FFF" />
                                    <Text style={styles.rejectBtnText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    userPhone: {
        fontSize: 13,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cardBody: {
        marginBottom: 12,
    },
    docType: {
        fontSize: 13,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    viewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        gap: 4,
    },
    viewBtnText: {
        fontSize: 13,
        fontWeight: '600',
    },
    approveBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 4,
    },
    approveBtnText: {
        color: '#003333',
        fontSize: 13,
        fontWeight: '600',
    },
    rejectBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 4,
    },
    rejectBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
});
