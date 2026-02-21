import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WalletModule() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transactions & Wallet</Text>
            <Text style={styles.subtext}>Monitor platform transactions and user balances.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#F8FAFC' },
    title: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
    subtext: { fontSize: 14, color: '#64748B' },
});
