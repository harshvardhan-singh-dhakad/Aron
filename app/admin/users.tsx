import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Alert,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { BadgeCheck, Trash2, Phone } from 'lucide-react-native';

// Mock users
const mockUsers = [
    {
        id: '1',
        name: 'Rahul Sharma',
        phone: '+91 9876543210',
        location: 'Jaipur, RJ',
        verified: true,
        listingsCount: 5,
        createdAt: new Date(),
    },
    {
        id: '2',
        name: 'Priya Singh',
        phone: '+91 9876543211',
        location: 'Lucknow, UP',
        verified: false,
        listingsCount: 2,
        createdAt: new Date(),
    },
    {
        id: '3',
        name: 'Amit Kumar',
        phone: '+91 9876543212',
        location: 'Indore, MP',
        verified: true,
        listingsCount: 8,
        createdAt: new Date(),
    },
];

export default function AdminUsers() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete User',
            'This will delete all user data including their listings. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => console.log('Deleted:', id) },
            ]
        );
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.content}>
                <View style={[styles.header, { backgroundColor: colors.card }]}>
                    <Text style={[styles.headerText, { color: colors.text }]}>
                        {mockUsers.length} Users
                    </Text>
                </View>

                {mockUsers.map((user) => (
                    <View key={user.id} style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                            </View>
                            <View style={styles.cardInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
                                    {user.verified && <BadgeCheck size={16} color={colors.accent} />}
                                </View>
                                <Text style={[styles.phone, { color: colors.textSecondary }]}>{user.phone}</Text>
                                <Text style={[styles.location, { color: colors.textSecondary }]}>{user.location}</Text>
                            </View>
                        </View>

                        <View style={[styles.stats, { borderColor: colors.border }]}>
                            <View style={styles.stat}>
                                <Text style={[styles.statValue, { color: colors.primary }]}>{user.listingsCount}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Listings</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={[styles.statValue, { color: colors.primary }]}>
                                    {user.createdAt.toLocaleDateString()}
                                </Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Joined</Text>
                            </View>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.callBtn, { backgroundColor: colors.accent }]}
                            >
                                <Phone size={18} color="#003333" />
                                <Text style={styles.callBtnText}>Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.deleteBtn, { borderColor: colors.destructive }]}
                                onPress={() => handleDelete(user.id)}
                            >
                                <Trash2 size={18} color={colors.destructive} />
                                <Text style={[styles.deleteBtnText, { color: colors.destructive }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    header: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    headerText: {
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 12,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    phone: {
        fontSize: 13,
        marginTop: 2,
    },
    location: {
        fontSize: 12,
        marginTop: 2,
    },
    stats: {
        flexDirection: 'row',
        borderTopWidth: 1,
        paddingTop: 12,
        marginBottom: 12,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    callBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    callBtnText: {
        color: '#003333',
        fontSize: 14,
        fontWeight: '600',
    },
    deleteBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
    },
    deleteBtnText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
