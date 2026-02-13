import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Image,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Briefcase, Wrench, ShoppingBag, Truck, Store, Search, MapPin, BadgeCheck, Zap } from 'lucide-react-native';
import { ListingCategory, Listing } from '@/types';
import { getAllListings } from '@/lib/services/listings';

const { width } = Dimensions.get('window');
const categoryWidth = (width - 48) / 3; // 3 columns? Or stick to 2? User didn't specify. Stick to 2 or 3. 2 is better for touch.
// User wanted effective.
// Current code had 2 columns.
// I'll stick to 2 columns for categories but make them smaller? Or Grid.

const BANNER_WIDTH = width - 32;

// Category data
const categories: { id: ListingCategory; label: string; icon: any; color: string }[] = [
    { id: 'jobs', label: 'Jobs', icon: Briefcase, color: '#3B82F6' },
    { id: 'services', label: 'Services', icon: Wrench, color: '#8B5CF6' },
    { id: 'rent', label: 'Kiraya', icon: Truck, color: '#F59E0B' },
    { id: 'buy-sell', label: 'Buy/Sell', icon: ShoppingBag, color: '#EC4899' },
    { id: 'business', label: 'Business', icon: Store, color: '#10B981' },
];

export default function HomeScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadListings = async () => {
        try {
            const data = await getAllListings();
            // Just show latest 20
            setListings(data.slice(0, 20)); // Already sorted by date in service (client-side)
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadListings();
    }, []);

    const handleCategoryPress = (categoryId: ListingCategory) => {
        router.push(`/listings/${categoryId}`);
    };

    const formatPrice = (listing: Listing) => {
        if (listing.category === 'jobs' && listing.salary) {
            const type = listing.salaryType === 'monthly' ? '/mo' : listing.salaryType === 'daily' ? '/day' : '/hr';
            return `₹${listing.salary.toLocaleString('en-IN')}${type}`;
        }
        if (listing.category === 'rent' && listing.pricePerUnit) {
            return `₹${listing.pricePerUnit.toLocaleString('en-IN')}/${listing.priceUnit || 'day'}`;
        }
        if (listing.category === 'services' && listing.ratePerHour) {
            return `₹${listing.ratePerHour.toLocaleString('en-IN')}/hr`;
        }
        if (listing.price) {
            return `₹${listing.price.toLocaleString('en-IN')}`;
        }
        return 'Contact';
    };

    const banners = [
        { id: '1', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', title: 'Super Deals' },
        { id: '2', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800', title: 'Find Jobs' },
        { id: '3', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', title: 'Top Property' }, // Property image
    ];

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadListings(); }} />}
        >
            {/* Search Bar */}
            <TouchableOpacity
                style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push('/(tabs)/search')}
            >
                <Search size={20} color={colors.textSecondary} />
                <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
                    Search jobs, properties, or services...
                </Text>
            </TouchableOpacity>

            {/* Scrolling Banners (Flipkart Style) */}
            <View style={styles.bannerWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    snapToInterval={width - 32} // Card width + margin
                    decelerationRate="fast"
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                    {banners.map((item) => (
                        <View key={item.id} style={[styles.bannerCard, { backgroundColor: colors.muted }]}>
                            <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
                            <View style={styles.bannerOverlay}>
                                <Text style={styles.bannerText}>{item.title}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Categories */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Categories</Text>
                <View style={styles.categoriesGrid}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => handleCategoryPress(cat.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.categoryIconContainer, { backgroundColor: `${cat.color}15` }]}>
                                <cat.icon size={24} color={cat.color} />
                            </View>
                            <Text style={[styles.categoryLabel, { color: colors.text }]}>{cat.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Fresh Recommendations (Feed) */}
            <View style={[styles.section, { paddingBottom: 100 }]}>
                <View style={styles.rowBetween}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Fresh Recommendations</Text>
                    <Zap size={20} color={colors.primary} fill={colors.primary} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                ) : listings.length > 0 ? (
                    <View style={styles.listingsGrid}>
                        {listings.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.listingCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                                onPress={() => router.push(`/listing/${item.id}`)}
                                activeOpacity={0.9}
                            >
                                <View style={styles.imageContainer}>
                                    {item.images && item.images.length > 0 ? (
                                        <Image source={{ uri: item.images[0] }} style={styles.listingImage} />
                                    ) : (
                                        <View style={[styles.listingImage, { backgroundColor: colors.muted, justifyContent: 'center', alignItems: 'center' }]}>
                                            <ShoppingBag size={24} color={colors.textSecondary} />
                                        </View>
                                    )}
                                    <View style={styles.categoryBadge}>
                                        <Text style={styles.categoryBadgeText}>{item.subCategory || item.category}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardContent}>
                                    <Text numberOfLines={2} style={[styles.cardTitle, { color: colors.text }]}>
                                        {item.title}
                                    </Text>
                                    <Text style={[styles.cardPrice, { color: colors.primary }]}>
                                        {formatPrice(item)}
                                    </Text>
                                    <View style={styles.locationRow}>
                                        <MapPin size={12} color={colors.textSecondary} />
                                        <Text numberOfLines={1} style={[styles.locationText, { color: colors.textSecondary }]}>
                                            {item.location}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={{ color: colors.textSecondary }}>No listings found yet.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 10,
        backgroundColor: '#FFF',
    },
    searchPlaceholder: {
        fontSize: 14,
    },
    bannerWrapper: {
        marginBottom: 20,
    },
    bannerContainer: {
        paddingHorizontal: 0,
    },
    bannerCard: {
        width: width - 32,
        height: 160,
        borderRadius: 16,
        marginRight: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 12,
    },
    bannerText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    categoryCard: {
        width: (width - 44) / 3, // 3 columns aprox
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
    },
    categoryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    listingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    listingCard: {
        width: (width - 44) / 2, // 2 columns
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        marginBottom: 4,
    },
    imageContainer: {
        height: 140,
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    listingImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    categoryBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    categoryBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
    },
    cardContent: {
        padding: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        height: 40,
    },
    cardPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 11,
        flex: 1,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
});
