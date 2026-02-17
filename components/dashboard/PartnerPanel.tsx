
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PARTNER_ACTIONS = [
    { id: 'listings', label: 'My Listings', icon: 'list', count: 12 },
    { id: 'orders', label: 'Orders Received', icon: 'cube', count: 3, badge: true },
    { id: 'bookings', label: 'Bookings', icon: 'calendar-number', count: 0 },
    { id: 'earnings', label: 'Earnings', icon: 'cash', value: '₹5k' },
    { id: 'reviews', label: 'Reviews', icon: 'star', value: '4.8' },
    { id: 'withdraw', label: 'Withdraw', icon: 'wallet', action: true },
];

import { useRouter } from 'expo-router';

export function PartnerPanel({ profile }: { profile: any }) {
    const router = useRouter();

    if (!profile.earnType) return null;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Partner Panel</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(tabs)/post-ad')}>
                    <Text style={styles.addButtonText}>+ Add New</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {PARTNER_ACTIONS.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.card} onPress={() => router.push('/(tabs)/inbox')}>
                        <Ionicons name={item.icon as any} size={24} color="#333" style={{ marginBottom: 10 }} />
                        <Text style={styles.cardLabel}>{item.label}</Text>
                        {item.count !== undefined && <Text style={styles.cardValue}>{item.count}</Text>}
                        {item.value && <Text style={styles.cardValue}>{item.value}</Text>}
                        {item.badge && <View style={styles.badge} />}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 0 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    addButton: { backgroundColor: 'black', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    addButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { width: '31%', backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
    cardLabel: { fontSize: 11, color: '#666', textAlign: 'center', marginTop: 5 },
    cardValue: { fontSize: 16, fontWeight: 'bold', marginTop: 2, color: '#007bff' },
    badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red' },
});
