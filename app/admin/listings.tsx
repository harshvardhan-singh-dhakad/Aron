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
import { CheckCircle, XCircle, Clock, Eye, Trash2 } from 'lucide-react-native';

// Mock listings
const mockListings = [
    {
        id: '1',
        title: 'Office Assistant Needed',
        category: 'jobs',
        ownerName: 'Rajesh Kumar',
        status: 'pending',
        createdAt: new Date(),
    },
    {
        id: '2',
        title: 'JCB for Rent',
        category: 'rent',
        ownerName: 'Amit Singh',
        status: 'pending',
        createdAt: new Date(),
    },
    {
        id: '3',
        title: 'Electrician Available',
        category: 'services',
        ownerName: 'Vikram Patel',
        status: 'approved',
        createdAt: new Date(),
    },
];

export default function AdminListings() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const handleApprove = (id: string) => {
        Alert.alert(
            'Approve Listing',
            'Are you sure you want to approve this listing?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Approve', onPress: () => console.log('Approved:', id) },
            ]
        );
    };

    const handleReject = (id: string) => {
        Alert.alert(
            'Reject Listing',
            'Are you sure you want to reject this listing?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reject', style: 'destructive', onPress: () => console.log('Rejected:', id) },
            ]
        );
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Listing',
            'This action cannot be undone. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => console.log('Deleted:', id) },
            ]
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <View style={[styles.badge, { backgroundColor: '#22C55E20' }]}>
                        <CheckCircle size={14} color="#22C55E" />
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
                {mockListings.map((item) => (
                    <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardInfo}>
                                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)} • {item.ownerName}
                                </Text>
                            </View>
                            {getStatusBadge(item.status)}
                        </View>

                        <Text style={[styles.date, { color: colors.textSecondary }]}>
                            Posted: {item.createdAt.toLocaleDateString()}
                        </Text>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.viewBtn, { borderColor: colors.border }]}
                            >
                                <Eye size={18} color={colors.primary} />
                                <Text style={[styles.viewBtnText, { color: colors.primary }]}>View</Text>
                            </TouchableOpacity>

                            {item.status === 'pending' && (
                                <>
                                    <TouchableOpacity
                                        style={[styles.approveBtn, { backgroundColor: colors.accent }]}
                                        onPress={() => handleApprove(item.id)}
                                    >
                                        <CheckCircle size={18} color="#003333" />
                                        <Text style={styles.approveBtnText}>Approve</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.rejectBtn, { backgroundColor: colors.destructive }]}
                                        onPress={() => handleReject(item.id)}
                                    >
                                        <XCircle size={18} color="#FFF" />
                                        <Text style={styles.rejectBtnText}>Reject</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            <TouchableOpacity
                                style={[styles.deleteBtn, { borderColor: colors.destructive }]}
                                onPress={() => handleDelete(item.id)}
                            >
                                <Trash2 size={18} color={colors.destructive} />
                            </TouchableOpacity>
                        </View>
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
        marginBottom: 8,
    },
    cardInfo: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    meta: {
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
    date: {
        fontSize: 12,
        marginBottom: 12,
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
    deleteBtn: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
});
