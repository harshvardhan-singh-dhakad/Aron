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
import { CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react-native';

// Mock applications
const mockApplications = [
    {
        id: '1',
        listingTitle: 'Office Assistant Needed',
        listingCategory: 'jobs',
        applicantName: 'Rahul Sharma',
        ownerName: 'Rajesh Kumar',
        status: 'pending',
        createdAt: new Date(),
    },
    {
        id: '2',
        listingTitle: 'JCB for Rent',
        listingCategory: 'rent',
        applicantName: 'Priya Singh',
        ownerName: 'Amit Singh',
        status: 'accepted',
        createdAt: new Date(),
    },
    {
        id: '3',
        listingTitle: 'Electrician Available',
        listingCategory: 'services',
        applicantName: 'Vikram Patel',
        ownerName: 'Suresh Kumar',
        status: 'rejected',
        createdAt: new Date(),
    },
];

export default function AdminApplications() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Application',
            'This action cannot be undone. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => console.log('Deleted:', id) },
            ]
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'accepted':
                return (
                    <View style={[styles.badge, { backgroundColor: '#22C55E20' }]}>
                        <CheckCircle size={14} color="#22C55E" />
                        <Text style={[styles.badgeText, { color: '#22C55E' }]}>Accepted</Text>
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
                <View style={[styles.header, { backgroundColor: colors.card }]}>
                    <Text style={[styles.headerText, { color: colors.text }]}>
                        {mockApplications.length} Applications
                    </Text>
                </View>

                {mockApplications.map((app) => (
                    <View key={app.id} style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardInfo}>
                                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                                    {app.listingTitle}
                                </Text>
                                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                                    {app.listingCategory.charAt(0).toUpperCase() + app.listingCategory.slice(1)}
                                </Text>
                            </View>
                            {getStatusBadge(app.status)}
                        </View>

                        <View style={[styles.details, { borderColor: colors.border }]}>
                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Applicant:</Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>{app.applicantName}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Owner:</Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>{app.ownerName}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date:</Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>
                                    {app.createdAt.toLocaleDateString()}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.deleteBtn, { borderColor: colors.destructive }]}
                            onPress={() => handleDelete(app.id)}
                        >
                            <Trash2 size={18} color={colors.destructive} />
                            <Text style={[styles.deleteBtnText, { color: colors.destructive }]}>Delete</Text>
                        </TouchableOpacity>
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
    header: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    headerText: {
        fontSize: 14,
        fontWeight: '600',
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
    details: {
        borderTopWidth: 1,
        paddingTop: 12,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 13,
        width: 80,
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '500',
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
    },
    deleteBtnText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
