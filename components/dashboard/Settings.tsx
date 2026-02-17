
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const SETTINGS_ITEMS = [
    {
        section: 'Profile Settings', items: [
            { id: 'edit', label: 'Edit Profile', icon: 'person-outline' },
            { id: 'city', label: 'Change City', icon: 'location-outline' },
        ]
    },
    {
        section: 'App Settings', items: [
            { id: 'notif', label: 'Notifications', icon: 'notifications-outline' },
            { id: 'lang', label: 'Language', icon: 'globe-outline', value: 'English' },
            { id: 'theme', label: 'Dark Mode', icon: 'moon-outline', toggle: true },
        ]
    },
    {
        section: 'Support', items: [
            { id: 'help', label: 'Help Center', icon: 'help-circle-outline' },
            { id: 'terms', label: 'Legal & Terms', icon: 'document-text-outline' },
        ]
    },
];

export function SettingsSection() {
    const { user } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <View style={styles.container}>
            {SETTINGS_ITEMS.map((sec, i) => (
                <View key={i} style={styles.section}>
                    <Text style={styles.sectionHeader}>{sec.section}</Text>
                    {sec.items.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.row}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name={item.icon as any} size={20} color="#666" style={{ marginRight: 15 }} />
                                <Text style={styles.rowLabel}>{item.label}</Text>
                            </View>
                            {item.value && <Text style={styles.rowValue}>{item.value}</Text>}
                            {!item.value && <Ionicons name="chevron-forward" size={16} color="#ccc" />}
                        </TouchableOpacity>
                    ))}
                </View>
            ))}

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0 • Made in India</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 0 },
    section: { marginBottom: 25 },
    sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#999', marginBottom: 10, textTransform: 'uppercase' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    rowLabel: { fontSize: 16, color: '#333' },
    rowValue: { fontSize: 14, color: '#666' },
    logoutButton: { marginTop: 10, padding: 15, borderRadius: 10, backgroundColor: '#ffebee', alignItems: 'center' },
    logoutText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 16 },
    versionText: { textAlign: 'center', marginTop: 20, color: '#ccc', fontSize: 12 },
});
