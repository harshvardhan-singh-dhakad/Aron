import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WithdrawalsModule() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Withdrawals</Text>
            <Text style={styles.subtext}>Process and approve user payout requests.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
    title: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
    subtext: { fontSize: 14, color: '#64748B' },
});
