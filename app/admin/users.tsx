import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UsersModule() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Management</Text>
            <Text style={styles.subtext}>Powerful user investigation and moderation tools coming soon.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
    title: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
    subtext: { fontSize: 14, color: '#64748B' },
});
