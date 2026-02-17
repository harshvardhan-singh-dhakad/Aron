
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCollection } from '../../hooks/useCollection';
import { where } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export function MyActivity() {
    const { user } = useAuth();

    // Memoize query constraints
    const orderConstraints = useMemo(() => [where('buyerId', '==', user?.uid)], [user?.uid]);
    // Assuming we have these collections. If not, they will return empty arrays which is fine.
    const bookingConstraints = useMemo(() => [where('customerId', '==', user?.uid)], [user?.uid]);
    const rentalConstraints = useMemo(() => [where('tenantId', '==', user?.uid)], [user?.uid]);
    const appConstraints = useMemo(() => [where('applicantId', '==', user?.uid)], [user?.uid]);

    const { data: myOrders } = useCollection('orders', ...orderConstraints);
    const { data: myBookings } = useCollection('bookings', ...bookingConstraints);
    const { data: myRentals } = useCollection('rentals', ...rentalConstraints);
    const { data: myApps } = useCollection('job_applications', ...appConstraints);

    const activities = [
        { id: '1', title: 'Active Orders', count: myOrders.length, icon: 'cart', color: '#007bff' },
        { id: '2', title: 'Bookings', count: myBookings.length, icon: 'calendar', color: '#6f42c1' },
        { id: '3', title: 'Rentals', count: myRentals.length, icon: 'key', color: '#fd7e14' },
        { id: '4', title: 'Job Apps', count: myApps.length, icon: 'briefcase', color: '#20c997' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>My Activity</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
                {activities.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.card}>
                        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                            <Ionicons name={item.icon as any} size={24} color={item.color} />
                        </View>
                        <Text style={styles.count}>{item.count}</Text>
                        <Text style={styles.title}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    scroll: { paddingBottom: 10 },
    card: { backgroundColor: 'white', width: 100, padding: 15, borderRadius: 12, marginRight: 15, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    iconContainer: { padding: 10, borderRadius: 25, marginBottom: 10 },
    count: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    title: { fontSize: 12, color: '#666', marginTop: 2 },
});
