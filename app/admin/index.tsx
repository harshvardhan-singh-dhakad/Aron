import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
    Users,
    List,
    CheckCircle2,
    ShieldAlert,
    TrendingUp,
    ArrowUpRight,
    Clock
} from 'lucide-react-native';
import StatCard from '@/components/admin/StatCard';
import ActivityFeed from '@/components/admin/ActivityFeed';

export default function OverviewDashboard() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back, Admin</Text>
                    <Text style={styles.subtext}>Here is what's happening with ARON today.</Text>
                </View>
                <View style={styles.dateBox}>
                    <Clock size={16} color="#64748B" />
                    <Text style={styles.dateText}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <StatCard
                    label="New Users Today"
                    value="128"
                    icon={Users}
                    color="#3B82F6"
                    trend={{ value: '12%', positive: true }}
                />
                <StatCard
                    label="Pending Approvals"
                    value="42"
                    icon={CheckCircle2}
                    color="#F59E0B"
                />
                <StatCard
                    label="Listings Posted"
                    value="564"
                    icon={List}
                    color="#10B981"
                    trend={{ value: '8%', positive: true }}
                />
                <StatCard
                    label="Reports Received"
                    value="12"
                    icon={ShieldAlert}
                    color="#EF4444"
                    trend={{ value: '14%', positive: false }}
                />
            </View>

            <View style={styles.secondaryGrid}>
                <StatCard
                    label="Active Users (30m)"
                    value="1,240"
                    icon={TrendingUp}
                    color="#8B5CF6"
                />
                <StatCard
                    label="Revenue Today"
                    value="₹42,500"
                    icon={ArrowUpRight}
                    color="#06B6D4"
                    trend={{ value: '25%', positive: true }}
                />
            </View>

            <View style={styles.mainGrid}>
                {/* Charts Section Placeholder */}
                <View style={styles.chartSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Transactional Growth</Text>
                        <View style={styles.legend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
                                <Text style={styles.legendText}>Users</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                                <Text style={styles.legendText}>Listings</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.barChartContainer}>
                        {[40, 70, 45, 90, 65, 80, 55].map((val, i) => (
                            <View key={i} style={styles.barGroup}>
                                <View style={styles.bars}>
                                    <View style={[styles.bar, { height: val, backgroundColor: '#3B82F6' }]} />
                                    <View style={[styles.bar, { height: val * 0.7, backgroundColor: '#10B981' }]} />
                                </View>
                                <Text style={styles.barLabel}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Activity Feed */}
                <View style={styles.feedSection}>
                    <ActivityFeed />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        padding: 24,
        gap: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    subtext: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dateText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    secondaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    mainGrid: {
        flexDirection: 'row',
        gap: 24,
    },
    chartSection: {
        flex: 2,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 24,
    },
    feedSection: {
        flex: 1,
        minWidth: 320,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    legend: {
        flexDirection: 'row',
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    barChartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 200,
        paddingTop: 20,
    },
    barGroup: {
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    bars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4,
    },
    bar: {
        width: 12,
        borderRadius: 4,
    },
    barLabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
    },
});
