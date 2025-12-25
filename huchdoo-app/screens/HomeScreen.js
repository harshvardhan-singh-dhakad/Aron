import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useCollection } from '../hooks/useCollection';
import { where, orderBy, limit } from 'firebase/firestore';
import ListingCard from '../components/ListingCard';

const categories = [
  { id: 'jobs', name: 'Jobs' },
  { id: 'services', name: 'Services' },
  { id: 'rentals', name: 'Rentals' },
];

export default function HomeScreen({ navigation }) {
  const { data: listings, loading } = useCollection(
    'listings',
    where('isVerifiedPost', '==', true),
    orderBy('createdAt', 'desc'),
    limit(6)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Huchdoo - Local Services</Text>
      <Text style={styles.subtitle}>Find trusted local professionals</Text>

      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('Search')}
      >
        <Text>🔍 Search for services...</Text>
      </TouchableOpacity>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>Welcome to Huchdoo!</Text>
        <Text>Find local services in your area.</Text>
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('CategoryListings', { categoryId: cat.id })}
          >
            <Text>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.listingsHeader}>
        <Text style={styles.sectionTitle}>Recent Listings</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CategoryListings', { categoryId: 'all' })}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} navigation={navigation} />}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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