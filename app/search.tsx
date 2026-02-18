
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { Listing } from '../types';
import { useCollection } from '../hooks/useCollection';
import { orderBy, limit } from 'firebase/firestore';

export default function SearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch recent 50 listings for client-side search
  // In a real production app, use Algolia/Meilisearch
  const { data: listings, loading } = useCollection('listings', orderBy('createdAt', 'desc'), limit(50));

  const results = useMemo(() => {
    if (!searchTerm) return [];
    const lowerTerm = searchTerm.toLowerCase();

    return (listings as Listing[]).filter(l =>
      l.title.toLowerCase().includes(lowerTerm) ||
      l.description.toLowerCase().includes(lowerTerm) ||
      l.location.toLowerCase().includes(lowerTerm) ||
      l.category.toLowerCase().includes(lowerTerm)
    );
  }, [searchTerm, listings]);

  const getPrice = (listing: Listing) => {
    if (listing.price) return `₹${listing.price}`;
    if (listing.rent) return `₹${listing.rent}/mo`;
    if (listing.salary) return `₹${listing.salary}/mo`;
    return 'Contact';
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-3">
          <SearchIcon size={20} color="gray" />
          <TextInput
            autoFocus
            className="flex-1 ml-2 text-base"
            placeholder="Search jobs, services, locations..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
          />
        </View>
      </View>

      {loading && !listings.length && (
        <View className="p-8 items-center">
          <ActivityIndicator size="large" color="black" />
          <Text className="text-gray-400 mt-2">Loading data...</Text>
        </View>
      )}

      <ScrollView className="flex-1 p-4" keyboardShouldPersistTaps="handled">
        {!loading && searchTerm && results.length === 0 && (
          <View className="items-center justify-center pt-10">
            <Text className="text-center text-gray-500 text-lg">No results found for "{searchTerm}".</Text>
            <Text className="text-gray-400 mt-2">Try different keywords or check spelling.</Text>
          </View>
        )}

        {!searchTerm && (
          <View className="pt-4">
            <Text className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wide">Popular Searches</Text>
            <View className="flex-row flex-wrap gap-2">
              {['Driver', 'Cook', 'Plumber', 'Apartment', 'Used Bike'].map(term => (
                <TouchableOpacity
                  key={term}
                  onPress={() => setSearchTerm(term)}
                  className="bg-gray-100 px-4 py-2 rounded-full"
                >
                  <Text className="text-gray-700">{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {results.map((listing: any) => (
          <TouchableOpacity
            key={listing.id}
            onPress={() => router.push(`/listing/${listing.id}`)}
            className="mb-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm active:bg-gray-50 transition-colors"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-2">
                <Text className="font-bold text-lg text-gray-900 mb-1" numberOfLines={1}>{listing.title}</Text>
                <Text className="text-sm text-gray-500 mb-2" numberOfLines={2}>{listing.description}</Text>
                <View className="flex-row items-center">
                  <View className="bg-gray-100 px-2 py-1 rounded mr-2">
                    <Text className="text-xs text-gray-600 capitalize">{listing.category}</Text>
                  </View>
                  <Text className="text-xs text-gray-400">{listing.location}</Text>
                </View>
              </View>
              <Text className="font-bold text-blue-600 text-lg">{getPrice(listing)}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
