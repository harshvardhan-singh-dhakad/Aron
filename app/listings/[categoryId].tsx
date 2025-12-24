import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCollection } from '@/hooks/useCollection';
import { where, orderBy } from 'firebase/firestore';
import { ListingCard } from '@/components/ListingCard';

export default function CategoryListingsScreen() {
  const { categoryId } = useLocalSearchParams();

  const { data: listings, loading } = useCollection(
    'listings',
    where('isVerifiedPost', '==', true),
    where('category', '==', categoryId),
    orderBy('createdAt', 'desc')
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryId} Listings</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
        />
      )}
    </View>
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
});