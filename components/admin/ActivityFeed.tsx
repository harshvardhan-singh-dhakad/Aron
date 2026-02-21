import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { User, PlusCircle, ShieldAlert, BadgeCheck, ArrowUpCircle } from 'lucide-react-native';

interface ActivityItem {
    id: string;
    type: 'user_joined' | 'listing_posted' | 'report_filed' | 'kyc_submitted' | 'withdrawal_requested';
    message: string;
    time: string;
}

const mockActivity: ActivityItem[] = [
    { id: '1', type: 'user_joined', message: 'New user "Rahul Sharma" joined via Mobile', time: '2 min ago' },
    { id: '2', type: 'listing_posted', message: 'User "Anita Singh" posted a new listing: iPhone 13 Pro', time: '15 min ago' },
    { id: '3', type: 'kyc_submitted', message: 'Verification docs submitted by "Vikram Kumar"', time: '24 min ago' },
    { id: '4', type: 'report_filed', message: 'User "Suresh" reported a listing for fraud', time: '41 min ago' },
    { id: '5', type: 'withdrawal_requested', message: 'Withdrawal of ₹1,500 requested by "Pooja"', time: '1 hour ago' },
];

const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
        case 'user_joined': return { icon: User, color: '#3B82F6' };
        case 'listing_posted': return { icon: PlusCircle, color: '#10B981' };
        case 'report_filed': return { icon: ShieldAlert, color: '#EF4444' };
        case 'kyc_submitted': return { icon: BadgeCheck, color: '#8B5CF6' };
        case 'withdrawal_requested': return { icon: ArrowUpCircle, color: '#F59E0B' };
    }
};

export default function ActivityFeed() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Live Activity Feed</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {mockActivity.map((item, index) => {
                    const { icon: Icon, color } = getIcon(item.type);
                    return (
                        <View key={item.id} style={[styles.item, index === mockActivity.length - 1 && styles.lastItem]}>
                            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                                <Icon size={16} color={color} />
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.message}>{item.message}</Text>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 20,
        height: '100%',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 20,
    },
    item: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    lastItem: {
        borderBottomWidth: 0,
        marginBottom: 0,
        paddingBottom: 0,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    message: {
        fontSize: 13,
        color: '#1E293B',
        lineHeight: 18,
        fontWeight: '500',
    },
    time: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 4,
    },
});
