import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Image,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Briefcase, Wrench, ShoppingBag, Truck, Store, Search } from 'lucide-react-native';
import { ListingCategory } from '@/types';

const { width } = Dimensions.get('window');
const categoryWidth = (width - 48) / 2;

// Category data matching screenshot style
const categories: { id: ListingCategory; label: string; icon: any; color: string }[] = [
    { id: 'jobs', label: 'Jobs', icon: Briefcase, color: '#3B82F6' },
    { id: 'services', label: 'Service', icon: Wrench, color: '#3B82F6' },
    { id: 'rent', label: 'Kiraya', icon: Truck, color: '#3B82F6' },
    { id: 'buy-sell', label: 'Buy/Sell', icon: ShoppingBag, color: '#3B82F6' },
    { id: 'business', label: 'Business', icon: Store, color: '#3B82F6' },
];

export default function HomeScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const handleCategoryPress = (categoryId: ListingCategory) => {
        router.push(`/listings/${categoryId}`);
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Search Bar */}
            <TouchableOpacity
                style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push('/(tabs)/search')}
            >
                <Search size={20} color={colors.textSecondary} />
                <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
                    Search jobs, services, or shops...
                </Text>
            </TouchableOpacity>

            {/* Hero Banner Image */}
            <View style={styles.bannerContainer}>
                <View style={[styles.banner, { backgroundColor: colors.muted }]}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800' }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                </View>
            </View>

            {/* Browse by Category */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Browse by category</Text>
                <View style={styles.categoriesGrid}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => handleCategoryPress(cat.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.categoryIconContainer, { backgroundColor: `${cat.color}10` }]}>
                                <cat.icon size={24} color={cat.color} />
                            </View>
                            <Text style={[styles.categoryLabel, { color: colors.text }]}>{cat.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Bottom Spacing */}
            <View style={{ height: 100 }} />
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
        margin: 16,
        padding: 14,
        borderRadius: 28,
        borderWidth: 1,
        gap: 10,
    },
    searchPlaceholder: {
        fontSize: 15,
    },
    bannerContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    banner: {
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    section: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: categoryWidth,
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
    },
    categoryIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
});
