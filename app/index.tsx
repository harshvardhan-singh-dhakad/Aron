
import { View, Text, ScrollView, Pressable, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Listing } from '../types';
import { useState, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Clock, Briefcase, ShoppingBag, Home, UserPlus, Wrench, Store } from 'lucide-react-native';
import { useCollection } from '../hooks/useCollection';
import { orderBy, limit } from 'firebase/firestore';
import Header from '../components/header';

import { CATEGORIES as categories } from '../constants/categories'; // Alias to keep existing map logic


export default function HomePage() {
  const router = useRouter();

  // Fetch listings sorted by createdAt descending
  const queryConstraints = useMemo(() => [
    orderBy('createdAt', 'desc'),
    limit(10)
  ], []);

  const { data: listings, loading, error } = useCollection(
    'listings',
    ...queryConstraints
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Real-time updates mean we don't really need to fetch, 
    // but we can simulate a refresh for UX
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getPrice = (listing: Listing) => {
    if (listing.price) return `₹${listing.price}`;
    if (listing.rent) return `₹${listing.rent}/mo`;
    if (listing.salary) return `₹${listing.salary}/mo`;
    return 'Contact for Price';
  }

  const getTimeAgo = (date: any) => {
    if (!date) return '';
    // Handle Firestore Timestamp
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        {/* Header */}
        <Header />

        {/* Search Bar */}
        <Pressable
          onPress={() => router.push('/search')}
          className="flex-row items-center bg-white border border-gray-200 p-4 rounded-2xl mb-8 shadow-sm active:bg-gray-50 transition-all"
        >
          <Search size={22} color="#6B7280" />
          <Text className="ml-3 text-gray-400 text-base">Search jobs, services, or shops...</Text>
        </Pressable>

        {/* Categories Grid */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Browse Categories</Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => router.push(`/listings/${category.id}`)}
                className="w-[48%] bg-white p-5 rounded-2xl items-center justify-center mb-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
              >
                <View className={`w-14 h-14 rounded-full items-center justify-center mb-3 ${category.bg}`}>
                  <category.icon size={28} strokeWidth={2} color={category.hex} />
                </View>
                <Text className="font-bold text-gray-800 text-lg">{category.name}</Text>
                <Text className="text-xs text-gray-400 mt-1 font-medium">Explore</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Listings */}
        <View className="mb-24">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Fresh Recommendations</Text>
          </View>

          {loading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#2563EB" />
              <Text className="text-gray-400 text-base mt-2">Finding best matches...</Text>
            </View>
          ) : listings.length === 0 ? (
            <View className="items-center justify-center py-10 bg-white rounded-2xl border border-gray-100 border-dashed">
              <Text className="text-gray-400 text-base">No listings found yet.</Text>
            </View>
          ) : (
            listings.map((listing: any) => (
              <Pressable
                key={listing.id}
                onPress={() => router.push(`/listing/${listing.id}`)}
                className="mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-row items-center mb-3">
                    <Image
                      source={{ uri: listing.ownerImage || 'https://via.placeholder.com/40' }}
                      className="w-8 h-8 rounded-full bg-gray-200 mr-2"
                    />
                    <View>
                      <Text className="text-xs font-bold text-gray-800">{listing.ownerName || 'User'}</Text>
                      <View className="flex-row items-center">
                        <Clock size={10} color="#9CA3AF" />
                        <Text className="text-[10px] text-gray-400 ml-1">{getTimeAgo(listing.createdAt)}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="bg-gray-100 px-2 py-1 rounded-md">
                    <Text className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">{listing.category}</Text>
                  </View>
                </View>

                <View className="flex-row">
                  {listing.images && listing.images.length > 0 && (
                    <Image
                      source={{ uri: listing.images[0] }}
                      className="w-24 h-24 rounded-lg bg-gray-200 mr-4"
                      resizeMode="cover"
                    />
                  )}
                  <View className="flex-1 justify-between py-1">
                    <View>
                      <Text className="font-bold text-lg text-gray-900 leading-6 mb-1" numberOfLines={2}>{listing.title}</Text>
                      <View className="flex-row items-center mb-2">
                        <MapPin size={12} color="#9CA3AF" />
                        <Text className="text-xs text-gray-500 ml-1" numberOfLines={1}>{listing.location}</Text>
                      </View>
                    </View>
                    <Text className="font-bold text-blue-600 text-lg">{getPrice(listing)}</Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB to Post Ad */}
      <Pressable
        onPress={() => router.push('/post-ad')}
        className="absolute bottom-6 right-6 w-16 h-16 bg-orange-500 rounded-full items-center justify-center shadow-2xl z-50 active:scale-95 transition-transform"
      >
        <Text className="text-white text-4xl pb-1 font-light">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
