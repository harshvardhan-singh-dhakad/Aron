import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Inbox as InboxIcon, Send, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react-native';

// Mock applications data
const mockReceivedApplications = [
    {
        id: '1',
        listingTitle: 'Office Assistant Needed',
        applicantName: 'Rahul Sharma',
        applicantPhone: '+91 9876543210',
        status: 'pending',
        createdAt: new Date(),
    },
    {
        id: '2',
        listingTitle: 'JCB for Rent',
        applicantName: 'Priya Singh',
        applicantPhone: '+91 9876543211',
        status: 'accepted',
        createdAt: new Date(),
    },
];

const mockSentApplications = [
    {
        id: '3',
        listingTitle: 'Electrician Available',
        ownerName: 'Amit Kumar',
        status: 'pending',
        createdAt: new Date(),
    },
    {
        id: '4',
        listingTitle: 'Delivery Driver Needed',
        ownerName: 'Vikram Patel',
        status: 'rejected',
        createdAt: new Date(),
    },
];

type TabType = 'received' | 'sent';

export default function InboxScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { user } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabType>('received');

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted':
                return <CheckCircle size={20} color="#22C55E" />;
            case 'rejected':
                return <XCircle size={20} color={colors.destructive} />;
            default:
                return <Clock size={20} color={colors.textSecondary} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return '#22C55E';
            case 'rejected':
                return colors.destructive;
            default:
                return colors.textSecondary;
        }
    };

    if (!user) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                <InboxIcon size={64} color={colors.primary} />
                <Text style={[styles.warningTitle, { color: colors.text }]}>Login Required</Text>
                <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                    Please login to view your inbox
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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Tab Bar */}
            <View style={[styles.tabBar, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'received' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
                    ]}
                    onPress={() => setActiveTab('received')}
                >
                    <InboxIcon
                        size={20}
                        color={activeTab === 'received' ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'received' ? colors.primary : colors.textSecondary }
                    ]}>
                        Received
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'sent' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
                    ]}
                    onPress={() => setActiveTab('sent')}
                >
                    <Send
                        size={20}
                        color={activeTab === 'sent' ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'sent' ? colors.primary : colors.textSecondary }
                    ]}>
                        Sent
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'received' ? (
                    mockReceivedApplications.length > 0 ? (
                        mockReceivedApplications.map((app) => (
                            <View key={app.id} style={[styles.applicationCard, { backgroundColor: colors.card }]}>
                                <View style={styles.cardHeader}>
                                    <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={1}>
                                        {app.listingTitle}
                                    </Text>
                                    <View style={styles.statusBadge}>
                                        {getStatusIcon(app.status)}
                                        <Text style={[styles.statusText, { color: getStatusColor(app.status) }]}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.applicantName, { color: colors.text }]}>
                                    From: {app.applicantName}
                                </Text>
                                <Text style={[styles.applicantPhone, { color: colors.textSecondary }]}>
                                    {app.applicantPhone}
                                </Text>

                                {app.status === 'pending' && (
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity style={[styles.acceptBtn, { backgroundColor: colors.accent }]}>
                                            <CheckCircle size={16} color="#003333" />
                                            <Text style={styles.acceptBtnText}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.rejectBtn, { backgroundColor: colors.destructive }]}>
                                            <XCircle size={16} color="#FFF" />
                                            <Text style={styles.rejectBtnText}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <InboxIcon size={48} color={colors.muted} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                No applications received yet
                            </Text>
                        </View>
                    )
                ) : (
                    mockSentApplications.length > 0 ? (
                        mockSentApplications.map((app) => (
                            <View key={app.id} style={[styles.applicationCard, { backgroundColor: colors.card }]}>
                                <View style={styles.cardHeader}>
                                    <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={1}>
                                        {app.listingTitle}
                                    </Text>
                                    <View style={styles.statusBadge}>
                                        {getStatusIcon(app.status)}
                                        <Text style={[styles.statusText, { color: getStatusColor(app.status) }]}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.applicantName, { color: colors.text }]}>
                                    To: {app.ownerName}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Send size={48} color={colors.muted} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                No applications sent yet
                            </Text>
                        </View>
                    )
                )}
            </ScrollView>
        </View>
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
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    applicationCard: {
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
    listingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    applicantName: {
        fontSize: 14,
        marginBottom: 4,
    },
    applicantPhone: {
        fontSize: 13,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    acceptBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 6,
    },
    acceptBtnText: {
        color: '#003333',
        fontWeight: '600',
    },
    rejectBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 6,
    },
    rejectBtnText: {
        color: '#FFF',
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
    },
});
