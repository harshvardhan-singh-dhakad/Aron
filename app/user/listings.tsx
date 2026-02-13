import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    ActivityIndicator,
    Alert,
    Image,
    Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { getUserListings, deleteListing } from '@/lib/services/listings';
import { Listing } from '@/types';
import { Edit, Trash2, MapPin, Clock, AlertCircle } from 'lucide-react-native';

export default function UserListingsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const { user } = useAuth();

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchListings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getUserListings(user.uid);
            setListings(data);
        } catch (error) {
            console.error('Error fetching user listings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [user]);

    const handleEdit = (listingId: string) => {
        // Navigate to post-ad screen with edit mode
        router.push({ pathname: '/(tabs)/post-ad', params: { editId: listingId } });
    };

    const handleDelete = (listingId: string) => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this listing?')) {
                performDelete(listingId);
            }
        } else {
            Alert.alert(
                'Delete Listing',
                'Are you sure you want to delete this listing? This action cannot be undone.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => performDelete(listingId) },
                ]
            );
        }
    };

    const performDelete = async (listingId: string) => {
        setDeletingId(listingId);
        try {
            const success = await deleteListing(listingId);
            if (success) {
                setListings(prev => prev.filter(l => l.id !== listingId));
                if (Platform.OS !== 'web') Alert.alert('Success', 'Listing deleted successfully');
            } else {
                alert('Failed to delete listing');
            }
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert('Error deleting listing');
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return colors.success;
            case 'pending': return colors.warning;
            case 'rejected': return colors.destructive;
            default: return colors.textSecondary;
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: 'My Listings' }} />
            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={{ padding: 16 }}
            >
                {listings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <AlertCircle size={48} color={colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            You haven't posted any listings yet.
                        </Text>
                        <TouchableOpacity
                            style={[styles.postButton, { backgroundColor: colors.primary }]}
                            onPress={() => router.push('/(tabs)/post-ad')}
                        >
                            <Text style={styles.postButtonText}>Post Ad Now</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    listings.map((listing) => (
                        <View
                            key={listing.id}
                            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                        >
                            {/* Header: Status & Date */}
                            <View style={styles.cardHeader}>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(listing.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(listing.status) }]}>
                                        {listing.status.toUpperCase()}
                                    </Text>
                                </View>
                                <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                                    {listing.createdAt instanceof Date ? listing.createdAt.toLocaleDateString() : 'Recently'}
                                </Text>
                            </View>

                            {/* Content Row */}
                            <View style={styles.contentRow}>
                                {listing.images && listing.images.length > 0 ? (
                                    <Image source={{ uri: listing.images[0] }} style={styles.image} />
                                ) : (
                                    <View style={[styles.image, { backgroundColor: colors.muted }]} />
                                )}
                                <View style={styles.infoCol}>
                                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                                        {listing.title}
                                    </Text>
                                    <View style={styles.metaRow}>
                                        <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                                            {listing.subCategory}
                                        </Text>
                                    </View>
                                    <View style={styles.locationRow}>
                                        <MapPin size={12} color={colors.textSecondary} />
                                        <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                                            {listing.location}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Actions */}
                            <View style={[styles.actionsRow, { borderTopColor: colors.border }]}>
                                <TouchableOpacity
                                    style={[styles.actionButton, { borderColor: colors.border }]}
                                    onPress={() => handleEdit(listing.id)}
                                >
                                    <Edit size={16} color={colors.text} />
                                    <Text style={[styles.actionText, { color: colors.text }]}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, { borderColor: colors.destructive }]}
                                    onPress={() => handleDelete(listing.id)}
                                    disabled={deletingId === listing.id}
                                >
                                    {deletingId === listing.id ? (
                                        <ActivityIndicator size="small" color={colors.destructive} />
                                    ) : (
                                        <>
                                            <Trash2 size={16} color={colors.destructive} />
                                            <Text style={[styles.actionText, { color: colors.destructive }]}>Delete</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    postButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    postButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        paddingBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 12,
    },
    contentRow: {
        flexDirection: 'row',
        padding: 12,
        paddingTop: 0,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    infoCol: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    categoryText: {
        fontSize: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 12,
        marginLeft: 4,
    },
    actionsRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        padding: 8,
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
