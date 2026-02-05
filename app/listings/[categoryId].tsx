import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCollection } from '@/hooks/useCollection';
import { where, orderBy } from 'firebase/firestore';
import { ListingCard } from '@/components/ListingCard';
import { ArrowLeft, Briefcase, Wrench, Home } from 'lucide-react';

const categoryIcons = {
  jobs: Briefcase,
  services: Wrench,
  rentals: Home,
};

const mockListings = {
  jobs: [
    {
      id: '1',
      title: 'Senior React Developer',
      description: 'Looking for experienced React developer for full-time position.',
      category: 'jobs',
      location: 'San Francisco, CA',
      salary: '$120k/year',
      ownerId: 'user1',
      imageUrl: 'https://via.placeholder.com/300x200?text=React+Dev',
      createdAt: new Date(),
      isVerifiedPost: true,
    },
    {
      id: '2',
      title: 'Graphic Designer',
      description: 'Creative designer needed for marketing campaigns.',
      category: 'jobs',
      location: 'New York, NY',
      salary: '$60k/year',
      ownerId: 'user2',
      imageUrl: 'https://via.placeholder.com/300x200?text=Designer',
      createdAt: new Date(),
      isVerifiedPost: true,
    },
  ],
  services: [
    {
      id: '3',
      title: 'Home Cleaning Service',
      description: 'Professional cleaning services for homes and offices.',
      category: 'services',
      location: 'Los Angeles, CA',
      price: '$50/hour',
      ownerId: 'user3',
      imageUrl: 'https://via.placeholder.com/300x200?text=Cleaning',
      createdAt: new Date(),
      isVerifiedPost: true,
    },
  ],
  rentals: [
    {
      id: '4',
      title: 'Modern 2BR Apartment',
      description: 'Beautiful apartment in downtown area with all amenities.',
      category: 'rentals',
      location: 'Chicago, IL',
      price: '$1800/month',
      ownerId: 'user4',
      imageUrl: 'https://via.placeholder.com/300x200?text=Apartment',
      createdAt: new Date(),
      isVerifiedPost: true,
    },
  ],
};

export default function CategoryListingsScreen() {
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();

  const { data: listings, loading } = useCollection(
    'listings',
    where('isVerifiedPost', '==', true),
    where('category', '==', categoryId),
    orderBy('createdAt', 'desc')
  );

  const displayListings = listings && listings.length > 0 ? listings : (mockListings[categoryId as keyof typeof mockListings] || []);
  const IconComponent = categoryIcons[categoryId as keyof typeof categoryIcons] || Wrench;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#007bff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <IconComponent size={28} color="#007bff" />
          <Text style={styles.title}>{categoryId?.charAt(0).toUpperCase() + categoryId?.slice(1)} Listings</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading listings...</Text>
        </View>
      ) : displayListings.length === 0 ? (
        <View style={styles.center}>
          <IconComponent size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No {categoryId} listings yet</Text>
          <Text style={styles.emptyText}>Check back later for new opportunities!</Text>
        </View>
      ) : (
        <FlatList
          data={displayListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
});