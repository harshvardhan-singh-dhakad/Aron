
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function DashboardHeader({ profile }: { profile: any }) {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <Image
                    source={{ uri: profile.photoURL || 'https://via.placeholder.com/100' }}
                    style={styles.profileImage}
                />
                <View style={styles.infoContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.name}>{profile.name || 'User'}</Text>
                        {profile.verified && <Ionicons name="checkmark-circle" size={16} color="#007bff" style={{ marginLeft: 5 }} />}
                    </View>
                    <Text style={styles.location}>{profile.city || profile.location || 'Location not set'}</Text>
                    <View style={styles.scoreContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.scoreText}> {profile.aronScore || 'New'} • ARON Score</Text>
                    </View>
                </View>
            </View>

            <View style={styles.walletCard}>
                <View>
                    <Text style={styles.walletLabel}>Wallet Balance</Text>
                    <Text style={styles.walletAmount}>₹{profile.walletBalance || '0.00'}</Text>
                </View>
                <TouchableOpacity style={styles.addMoneyButton}>
                    <Text style={styles.addMoneyText}>+ Add Money</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 10, backgroundColor: '#f8f9fa' },
    topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    profileImage: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: 'white' },
    infoContainer: { marginLeft: 15, flex: 1 },
    name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    location: { fontSize: 14, color: '#666', marginTop: 2 },
    scoreContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5, backgroundColor: '#e9ecef', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    scoreText: { fontSize: 12, fontWeight: 'bold', color: '#495057' },
    walletCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    walletLabel: { fontSize: 12, color: '#666', textTransform: 'uppercase' },
    walletAmount: { fontSize: 24, fontWeight: 'bold', color: '#28a745', marginTop: 2 },
    addMoneyButton: { backgroundColor: '#e8f5e9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    addMoneyText: { color: '#28a745', fontWeight: 'bold', fontSize: 12 },
});
