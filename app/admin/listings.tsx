import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Image,
    Alert,
    ActivityIndicator,
    RefreshControl,
    Modal,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle, XCircle, MapPin, Clock, X, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PendingListing {
    id: string;
    title: string;
    description: string;
    category: string;
    subCategory: string;
    location: string;
    images: string[];
    ownerId: string;
    ownerName: string;
    ownerPhone: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
}

export default function AdminListings() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [listings, setListings] = useState<PendingListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Image viewer modal
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [currentImages, setCurrentImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fetchListings = async () => {
        try {
            const q = query(
                collection(db, 'listings'),
                where('status', '==', 'pending')
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as PendingListing[];
            setListings(data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleAction = async (listingId: string, action: 'approved' | 'rejected') => {
        setActionLoading(listingId);
        try {
            await updateDoc(doc(db, 'listings', listingId), {
                status: action,
                updatedAt: serverTimestamp(),
            });

            setListings(prev => prev.filter(l => l.id !== listingId));

            Alert.alert(
                'Success',
                `Listing ${action === 'approved' ? 'approved and is now live' : 'rejected'}!`
            );
        } catch (error) {
            console.error('Error updating listing:', error);
            Alert.alert('Error', 'Failed to update listing status');
        } finally {
            setActionLoading(null);
        }
    };

    const openImageViewer = (images: string[], index: number = 0) => {
        setCurrentImages(images);
        setCurrentImageIndex(index);
        setImageModalVisible(true);
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'jobs': return '💼 Jobs';
            case 'services': return '🔧 Services';
            case 'buy-sell': return '🛒 Buy & Sell';
            case 'rent': return '🏠 Rent';
            case 'business': return '🏪 Business';
            default: return category;
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: '#F3F4F6' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading listings...</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView
                style={[styles.container, { backgroundColor: '#F3F4F6' }]}
                contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => {
                        setRefreshing(true);
                        fetchListings();
                    }} />
                }
            >
                {/* Stats */}
                <View style={[styles.statsCard, { backgroundColor: '#F97316' }]}>
                    <Clock size={24} color="#FFF" />
                    <Text style={styles.statsText}>{listings.length} Pending Listing{listings.length !== 1 ? 's' : ''}</Text>
                </View>

                {/* Warning */}
                <View style={[styles.warningCard, { backgroundColor: '#FEF3C7' }]}>
                    <AlertTriangle size={20} color="#92400E" />
                    <Text style={[styles.warningText, { color: '#92400E' }]}>
                        Review all images carefully before approving. Reject any inappropriate content.
                    </Text>
                </View>

                {listings.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <CheckCircle size={64} color={colors.success} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>All caught up!</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            No pending listings to review.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {listings.map((listing) => (
                            <View key={listing.id} style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
                                {/* Category Badge */}
                                <View style={[styles.categoryBadge, { backgroundColor: '#EBF5FF' }]}>
                                    <Text style={[styles.categoryText, { color: colors.primary }]}>
                                        {getCategoryLabel(listing.category)}
                                    </Text>
                                </View>

                                {/* Title */}
                                <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={2}>
                                    {listing.title}
                                </Text>

                                {/* Description */}
                                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={3}>
                                    {listing.description}
                                </Text>

                                {/* Location */}
                                <View style={styles.locationRow}>
                                    <MapPin size={14} color={colors.textSecondary} />
                                    <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                                        {listing.location}
                                    </Text>
                                </View>

                                {/* Images Section */}
                                {listing.images && listing.images.length > 0 && (
                                    <View style={styles.imagesSection}>
                                        <Text style={[styles.imagesLabel, { color: colors.text }]}>
                                            📷 Images ({listing.images.length}) - Tap to review
                                        </Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.imagesRow}>
                                                {listing.images.map((image, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => openImageViewer(listing.images, index)}
                                                    >
                                                        <Image
                                                            source={{ uri: image }}
                                                            style={styles.thumbnail}
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>
                                )}

                                {/* Owner Info */}
                                <View style={[styles.ownerBox, { backgroundColor: '#F9FAFB' }]}>
                                    <Text style={[styles.ownerLabel, { color: colors.textSecondary }]}>Posted by:</Text>
                                    <Text style={[styles.ownerName, { color: colors.text }]}>
                                        {listing.ownerName || 'Unknown'} • {listing.ownerPhone}
                                    </Text>
                                </View>

                                {/* Action Buttons */}
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.rejectBtn]}
                                        onPress={() => handleAction(listing.id, 'rejected')}
                                        disabled={actionLoading === listing.id}
                                    >
                                        {actionLoading === listing.id ? (
                                            <ActivityIndicator size="small" color="#FFF" />
                                        ) : (
                                            <>
                                                <XCircle size={20} color="#FFF" />
                                                <Text style={styles.actionText}>Reject</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.approveBtn]}
                                        onPress={() => handleAction(listing.id, 'approved')}
                                        disabled={actionLoading === listing.id}
                                    >
                                        {actionLoading === listing.id ? (
                                            <ActivityIndicator size="small" color="#FFF" />
                                        ) : (
                                            <>
                                                <CheckCircle size={20} color="#FFF" />
                                                <Text style={styles.actionText}>Approve</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Image Viewer Modal */}
            <Modal
                visible={imageModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setImageModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setImageModalVisible(false)}
                    >
                        <X size={28} color="#FFF" />
                    </TouchableOpacity>

                    <Image
                        source={{ uri: currentImages[currentImageIndex] }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />

                    {/* Image counter */}
                    <Text style={styles.imageCounter}>
                        {currentImageIndex + 1} / {currentImages.length}
                    </Text>

                    {/* Navigation */}
                    {currentImages.length > 1 && (
                        <>
                            {currentImageIndex > 0 && (
                                <TouchableOpacity
                                    style={[styles.navBtn, styles.navLeft]}
                                    onPress={() => setCurrentImageIndex(prev => prev - 1)}
                                >
                                    <ChevronLeft size={32} color="#FFF" />
                                </TouchableOpacity>
                            )}
                            {currentImageIndex < currentImages.length - 1 && (
                                <TouchableOpacity
                                    style={[styles.navBtn, styles.navRight]}
                                    onPress={() => setCurrentImageIndex(prev => prev + 1)}
                                >
                                    <ChevronRight size={32} color="#FFF" />
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            </Modal>
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
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    statsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        marginBottom: 8,
        padding: 16,
        borderRadius: 12,
        gap: 10,
    },
    statsText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    warningCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 8,
        padding: 12,
        borderRadius: 10,
        gap: 10,
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    listContainer: {
        padding: 16,
        gap: 16,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '500',
    },
    listingTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    locationText: {
        fontSize: 13,
    },
    imagesSection: {
        marginBottom: 12,
    },
    imagesLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    imagesRow: {
        flexDirection: 'row',
        gap: 10,
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#E5E7EB',
    },
    ownerBox: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
    },
    ownerLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    ownerName: {
        fontSize: 14,
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    rejectBtn: {
        backgroundColor: '#EF4444',
    },
    approveBtn: {
        backgroundColor: '#22C55E',
    },
    actionText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 8,
    },
    fullImage: {
        width: '90%',
        height: '70%',
    },
    imageCounter: {
        position: 'absolute',
        bottom: 50,
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    navBtn: {
        position: 'absolute',
        top: '45%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 12,
        borderRadius: 50,
    },
    navLeft: {
        left: 16,
    },
    navRight: {
        right: 16,
    },
});
