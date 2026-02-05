import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Search as SearchIcon, X, MapPin, BadgeCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock search results
const mockResults = [
    {
        id: '1',
        title: 'Office Assistant Needed',
        category: 'jobs',
        price: '₹15,000/month',
        location: 'Jaipur, RJ',
        ownerVerified: true,
    },
    {
        id: '2',
        title: 'Electrician Available',
        category: 'services',
        price: '₹500/hour',
        location: 'Lucknow, UP',
        ownerVerified: true,
    },
];

export default function SearchScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<typeof mockResults>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            // In real app, this would call Firestore
            setResults(mockResults.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            ));
            setHasSearched(true);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setResults([]);
        setHasSearched(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
                <SearchIcon size={20} color={colors.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search listings..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch}>
                        <X size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
                {!hasSearched ? (
                    <View style={styles.emptyState}>
                        <SearchIcon size={64} color={colors.muted} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            Search for listings
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                            Find jobs, services, items for sale, and rentals in your area
                        </Text>
                    </View>
                ) : results.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            No results found
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                            Try a different search term
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
                            {results.length} result{results.length !== 1 ? 's' : ''} found
                        </Text>
                        {results.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.resultCard, { backgroundColor: colors.card }]}
                                onPress={() => router.push(`/listing/${item.id}`)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.resultImage, { backgroundColor: colors.muted }]} />
                                <View style={styles.resultContent}>
                                    <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <Text style={[styles.resultCategory, { color: colors.textSecondary }]}>
                                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                    </Text>
                                    <Text style={[styles.resultPrice, { color: colors.primary }]}>
                                        {item.price}
                                    </Text>
                                    <View style={styles.resultLocation}>
                                        <MapPin size={12} color={colors.textSecondary} />
                                        <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                                            {item.location}
                                        </Text>
                                        {item.ownerVerified && (
                                            <BadgeCheck size={14} color={colors.accent} style={{ marginLeft: 4 }} />
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
        marginRight: 8,
    },
    resultsContainer: {
        flex: 1,
        padding: 16,
        paddingTop: 0,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    resultsCount: {
        fontSize: 14,
        marginBottom: 16,
    },
    resultCard: {
        flexDirection: 'row',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultImage: {
        width: 100,
        height: 100,
    },
    resultContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultCategory: {
        fontSize: 12,
    },
    resultPrice: {
        fontSize: 14,
        fontWeight: '600',
    },
    resultLocation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 12,
        marginLeft: 4,
    },
});
