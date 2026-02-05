import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useCollection } from '@/hooks/useCollection';
import { where, orderBy, limit } from 'firebase/firestore';
import { ListingCard } from '@/components/ListingCard';
import { Search, MapPin, Briefcase, Home } from 'lucide-react';

const categories = [
  { id: 'jobs', name: 'Jobs', icon: Briefcase },
  { id: 'services', name: 'Services', icon: Search },
  { id: 'rentals', name: 'Rentals', icon: Home },
];

const mockListings = [
  {
    id: '1',
    title: 'Plumber Needed',
    description: 'Fix leaking faucet in kitchen.',
    category: 'services',
    location: 'New York',
    salary: '$50/hour',
    ownerId: 'user1',
    imageUrl: 'https://via.placeholder.com/300x200?text=Plumber',
    createdAt: new Date(),
    isVerifiedPost: true,
  },
  {
    id: '2',
    title: 'Software Developer Job',
    description: 'Full-time React developer position.',
    category: 'jobs',
    location: 'San Francisco',
    salary: '$100k/year',
    ownerId: 'user2',
    imageUrl: 'https://via.placeholder.com/300x200?text=Developer',
    createdAt: new Date(),
    isVerifiedPost: true,
  },
  {
    id: '3',
    title: 'Apartment for Rent',
    description: '2-bedroom apartment in downtown.',
    category: 'rentals',
    location: 'Chicago',
    salary: '$1500/month',
    ownerId: 'user3',
    imageUrl: 'https://via.placeholder.com/300x200?text=Apartment',
    createdAt: new Date(),
    isVerifiedPost: true,
  },
];

export default function HomeScreen() {
  const { data: listings, loading } = useCollection(
    'listings',
    where('isVerifiedPost', '==', true),
    orderBy('createdAt', 'desc'),
    limit(6)
  );

  const displayListings = listings && listings.length > 0 ? listings : mockListings;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Huchdoo - Local Services</Text>

      {/* Search Bar */}
      <Link href="/search" asChild>
        <TouchableOpacity style={styles.searchBar}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchText}>Search for jobs, services, rentals...</Text>
        </TouchableOpacity>
      </Link>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Welcome to Huchdoo!</Text>
        <Text>Find local services in your area.</Text>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categories}>
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <Link key={cat.id} href={`/listings/${cat.id}`} asChild>
              <TouchableOpacity style={styles.categoryCard}>
                <IconComponent size={24} color="#007bff" />
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>

      {/* Recent Listings */}
      <View style={styles.listingsHeader}>
        <Text style={styles.sectionTitle}>Recent Listings</Text>
        <Link href="/listings/all" asChild>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={displayListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    color: '#999',
    fontSize: 16,
  },
  banner: {
    backgroundColor: '#e0f7fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: 80,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  listingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAll: {
    color: '#007bff',
  },
});
