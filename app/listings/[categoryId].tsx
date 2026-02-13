import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SubCategories, ListingCategory } from '@/types';
import { MapPin, BadgeCheck, ChevronRight } from 'lucide-react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Listing {
    id: string;
    title: string;
    subCategory: string;
    price?: number;
    salary?: number;
    salaryType?: string;
    pricePerUnit?: number;
    priceUnit?: string;
    ratePerHour?: number;
    location: string;
    images: string[];
    ownerName: string;
    ownerVerified?: boolean;
    status: string;
}

const categoryTitles: Record<ListingCategory, string> = {
    jobs: 'Jobs',
    services: 'Services',
    'buy-sell': 'Buy & Sell',
    rent: 'Rent',
    business: 'Business',
};

export default function CategoryListingsScreen() {
    const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const category = categoryId as ListingCategory;
    const subCategories = SubCategories[category] || [];

    const fetchListings = async () => {
        try {
            const q = query(
                collection(db, 'listings'),
                where('category', '==', category),
                where('status', '==', 'approved') // Only show approved listings
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Listing[];
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
    }, [category]);

    const formatPrice = (listing: Listing) => {
        if (category === 'jobs' && listing.salary) {
            const type = listing.salaryType === 'monthly' ? '/month' : listing.salaryType === 'daily' ? '/day' : '/hr';
            return `₹${listing.salary.toLocaleString('en-IN')}${type}`;
        }
        if (category === 'rent' && listing.pricePerUnit) {
            return `₹${listing.pricePerUnit.toLocaleString('en-IN')}/${listing.priceUnit || 'day'}`;
        }
        if (category === 'services' && listing.ratePerHour) {
            return `₹${listing.ratePerHour.toLocaleString('en-IN')}/hr`;
        }
        if (listing.price) {
            return `₹${listing.price.toLocaleString('en-IN')}`;
        }
        return 'Contact for price';
    };

    if (loading) {
        return (
            <>
                <Stack.Screen options={{ title: categoryTitles[category] || 'Listings' }} />
                <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: categoryTitles[category] || 'Listings' }} />

            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => {
                        setRefreshing(true);
                        fetchListings();
                    }} />
                }
            >
                {/* Sub-categories */}
                <View style={styles.subCategoriesSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Sub-Categories</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.subCategoriesRow}>
                            {subCategories.map((sub) => (
                                <TouchableOpacity
                                    key={sub}
                                    style={[styles.subCategoryChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                                >
                                    <Text style={[styles.subCategoryText, { color: colors.text }]}>{sub}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Listings */}
                <View style={styles.listingsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {listings.length} Listing{listings.length !== 1 ? 's' : ''}
                    </Text>

                    {listings.length > 0 ? (
                        listings.map((listing) => (
                            <TouchableOpacity
                                key={listing.id}
                                style={[styles.listingCard, { backgroundColor: colors.card }]}
                                onPress={() => router.push(`/listing/${listing.id}`)}
                                activeOpacity={0.7}
                            >
                                {listing.images && listing.images.length > 0 ? (
                                    <Image
                                        source={{ uri: listing.images[0] }}
                                        style={styles.listingImage}
                                    />
                                ) : (
                                    <View style={[styles.listingImage, { backgroundColor: colors.muted }]} />
                                )}
                                <View style={styles.listingContent}>
                                    <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={1}>
                                        {listing.title}
                                    </Text>
                                    <Text style={[styles.listingSubCategory, { color: colors.textSecondary }]}>
                                        {listing.subCategory}
                                    </Text>
                                    <Text style={[styles.listingPrice, { color: colors.primary }]}>
                                        {formatPrice(listing)}
                                    </Text>
                                    <View style={styles.listingFooter}>
                                        <View style={styles.locationRow}>
                                            <MapPin size={12} color={colors.textSecondary} />
                                            <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                                                {listing.location}
                                            </Text>
                                        </View>
                                        <BadgeCheck size={16} color={colors.accent} />
                                    </View>
                                </View>
                                <ChevronRight size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                No listings found in this category
                            </Text>
                        </View>
                    )}
                </View>

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
    },
    subCategoriesSection: {
        padding: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    subCategoriesRow: {
        flexDirection: 'row',
        gap: 8,
    },
    subCategoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    subCategoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
    listingsSection: {
        padding: 16,
    },
    listingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    listingImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    listingContent: {
        flex: 1,
        marginLeft: 12,
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    listingSubCategory: {
        fontSize: 12,
        marginBottom: 4,
    },
    listingPrice: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    listingFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 12,
        marginLeft: 4,
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
});
