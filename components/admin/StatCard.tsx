import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    trend?: {
        value: string;
        positive: boolean;
    };
}

export default function StatCard({ label, value, icon: Icon, color, trend }: StatCardProps) {
    return (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Icon size={24} color={color} />
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.valueRow}>
                    <Text style={styles.value}>{value}</Text>
                    {trend && (
                        <Text style={[styles.trend, { color: trend.positive ? '#10B981' : '#EF4444' }]}>
                            {trend.positive ? '↑' : '↓'} {trend.value}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
        minWidth: 240,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 4,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    value: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
    },
    trend: {
        fontSize: 12,
        fontWeight: '700',
    },
});
