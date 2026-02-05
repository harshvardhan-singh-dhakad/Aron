import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SubCategories, ListingCategory } from '@/types';
import { MapPin, BadgeCheck, ChevronRight } from 'lucide-react-native';

// Mock listings by category
const mockListings: Record<ListingCategory, any[]> = {
    jobs: [
        { id: '1', title: 'Office Assistant Needed', subCategory: 'Office Assistant', price: '₹15,000/month', location: 'Jaipur, RJ', ownerVerified: true },
        { id: '2', title: 'Delivery Driver Required', subCategory: 'Driver', price: '₹18,000/month', location: 'Lucknow, UP', ownerVerified: true },
    ],
    services: [
        { id: '3', title: 'Electrician Available', subCategory: 'Electrician', price: '₹500/hour', location: 'Indore, MP', ownerVerified: true },
        { id: '4', title: 'Plumbing Services', subCategory: 'Plumber', price: '₹400/hour', location: 'Bhopal, MP', ownerVerified: false },
    ],
    'buy-sell': [
        { id: '5', title: 'Samsung TV 55 inch', subCategory: 'Electronics', price: '₹25,000', location: 'Jaipur, RJ', ownerVerified: true },
    ],
    rent: [
        { id: '6', title: 'JCB for Rent', subCategory: 'JCB', price: '₹2,000/day', location: 'Jodhpur, RJ', ownerVerified: true },
        { id: '7', title: 'Tractor Available', subCategory: 'Tractor', price: '₹1,500/day', location: 'Ajmer, RJ', ownerVerified: false },
    ],
    business: [
        { id: '8', title: 'Sharma General Store', subCategory: 'Grocery', price: 'Open 9 AM - 9 PM', location: 'Jaipur, RJ', ownerVerified: true },
        { id: '9', title: 'Raj Electronics', subCategory: 'Electronics', price: 'Open 10 AM - 8 PM', location: 'Udaipur, RJ', ownerVerified: true },
        { id: '10', title: 'Neha Beauty Parlour', subCategory: 'Salon', price: 'Open 10 AM - 7 PM', location: 'Jodhpur, RJ', ownerVerified: false },
    ],
};

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

    const category = categoryId as ListingCategory;
    const listings = mockListings[category] || [];
    const subCategories = SubCategories[category] || [];

    return (
        <>
            <Stack.Screen options={{ title: categoryTitles[category] || 'Listings' }} />

            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                showsVerticalScrollIndicator={false}
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
                                <View style={[styles.listingImage, { backgroundColor: colors.muted }]} />
                                <View style={styles.listingContent}>
                                    <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={1}>
                                        {listing.title}
                                    </Text>
                                    <Text style={[styles.listingSubCategory, { color: colors.textSecondary }]}>
                                        {listing.subCategory}
                                    </Text>
                                    <Text style={[styles.listingPrice, { color: colors.primary }]}>
                                        {listing.price}
                                    </Text>
                                    <View style={styles.listingFooter}>
                                        <View style={styles.locationRow}>
                                            <MapPin size={12} color={colors.textSecondary} />
                                            <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                                                {listing.location}
                                            </Text>
                                        </View>
                                        {listing.ownerVerified && (
                                            <BadgeCheck size={16} color={colors.accent} />
                                        )}
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
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
