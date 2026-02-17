
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACTIVITIES = [
    { id: '1', title: 'Active Orders', count: 2, icon: 'cart', color: '#007bff' },
    { id: '2', title: 'Bookings', count: 0, icon: 'calendar', color: '#6f42c1' },
    { id: '3', title: 'Rentals', count: 1, icon: 'key', color: '#fd7e14' },
    { id: '4', title: 'Job Apps', count: 5, icon: 'briefcase', color: '#20c997' },
];

export function MyActivity() {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>My Activity</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
                {ACTIVITIES.map((item) => (
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
