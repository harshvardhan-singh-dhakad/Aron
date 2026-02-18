
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Listing } from '../../types';
import { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useCollection } from '../../hooks/useCollection';
import { where, orderBy } from 'firebase/firestore';
import { CATEGORIES } from '../../constants/categories';

export default function CategoryListingsPage() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const [filter, setFilter] = useState<string | null>(null);

  // Memoize query constraints
  const queryConstraints = useMemo(() => [
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  ], [category]);

  const { data: listings, loading } = useCollection(
    'listings',
    ...queryConstraints
  );

  const filteredListings = useMemo(() => {
    let result = listings as Listing[];
    if (filter) {
      result = result.filter(l => l.subCategory === filter);
    }
    return result;
  }, [listings, filter]);

  const currentCategoryData = CATEGORIES.find(c => c.id === category);
  const currentSubCats = currentCategoryData?.subcategories || [];

  const getPrice = (listing: Listing) => {
    if (listing.price) return `₹${listing.price}`;
    if (listing.rent) return `₹${listing.rent}/mo`;
    if (listing.salary) return `₹${listing.salary}/mo`;
    return 'Contact';
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold capitalize text-gray-900">{currentCategoryData?.name || category}</Text>
      </View>

      <View className="py-3 bg-white border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row px-4">
          <TouchableOpacity
            onPress={() => setFilter(null)}
            className={`px-5 py-2 rounded-full border mr-2 ${filter === null ? 'bg-black border-black' : 'bg-white border-gray-300'}`}
          >
            <Text className={`font-medium ${filter === null ? 'text-white' : 'text-gray-700'}`}>All</Text>
          </TouchableOpacity>
          {currentSubCats.map((sub, index) => (
            <TouchableOpacity
              key={sub.value}
              onPress={() => setFilter(sub.value)}
              className={`px-5 py-2 rounded-full border mr-2 ${filter === sub.value ? 'bg-black border-black' : 'bg-white border-gray-300'} ${index === currentSubCats.length - 1 ? 'mr-8' : ''}`}
            >
              <Text className={`font-medium ${filter === sub.value ? 'text-white' : 'text-gray-700'}`}>{sub.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="black" />
          <Text className="text-gray-400 mt-2">Loading listings...</Text>
        </View>
      ) : (
        <ScrollView className="px-4 pt-4" showsVerticalScrollIndicator={false}>
          {filteredListings.length === 0 ? (
            <View className="items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-4">
              <Text className="text-gray-400 text-lg font-medium">No listings found</Text>
              <Text className="text-gray-400 text-sm mt-1">Try changing filters or check back later.</Text>
            </View>
          ) : (
            filteredListings.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                onPress={() => router.push(`/listing/${listing.id}`)}
                className="mb-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm active:bg-gray-50 transition-colors"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 pr-4">
                    <Text className="font-bold text-lg text-gray-900 mb-1 leading-6">{listing.title}</Text>
                    <Text className="text-sm text-gray-500 mb-2" numberOfLines={2}>{listing.description}</Text>
                    <Text className="text-xs text-gray-400 font-medium">{listing.location}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-blue-600 text-lg">{getPrice(listing)}</Text>
                    <Text className="text-[10px] text-gray-400 mt-1">
                      {listing.createdAt instanceof Date
                        ? listing.createdAt.toLocaleDateString()
                        : (listing.createdAt as any)?.toDate
                          ? (listing.createdAt as any).toDate().toLocaleDateString()
                          : new Date(listing.createdAt as any).toLocaleDateString()
                      }
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View className="h-24" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
