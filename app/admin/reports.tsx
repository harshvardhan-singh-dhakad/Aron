import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReportsModule() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reports & Safety</Text>
            <Text style={styles.subtext}>Manage user complaints and safety tickets.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
    title: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
    subtext: { fontSize: 14, color: '#64748B' },
});
