import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useCollection } from '@/hooks/useCollection';
import { where, orderBy, limit } from 'firebase/firestore';
import { ListingCard } from '@/components/ListingCard';

const categories = [
  { id: 'jobs', name: 'Jobs' },
  { id: 'services', name: 'Services' },
  { id: 'rentals', name: 'Rentals' },
];

export default function HomeScreen() {
  const { data: listings, loading } = useCollection(
    'listings',
    where('isVerifiedPost', '==', true),
    orderBy('createdAt', 'desc'),
    limit(6)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Huchdoo - Local Services</Text>

      {/* Search Bar */}
      <Link href="/search" asChild>
        <TouchableOpacity style={styles.searchBar}>
          <Text>Search for services...</Text>
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
        {categories.map((cat) => (
          <Link key={cat.id} href={`/listings/${cat.id}`} asChild>
            <TouchableOpacity style={styles.categoryCard}>
              <Text>{cat.name}</Text>
            </TouchableOpacity>
          </Link>
        ))}
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
          data={listings}
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
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
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
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
