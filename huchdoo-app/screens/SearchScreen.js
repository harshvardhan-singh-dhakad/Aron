import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { useCollection } from '../hooks/useCollection';
import { where, orderBy } from 'firebase/firestore';
import ListingCard from '../components/ListingCard';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: listings, loading } = useCollection(
    'listings',
    where('isVerifiedPost', '==', true),
    orderBy('createdAt', 'desc')
  );

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for services..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} navigation={navigation} />}
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});