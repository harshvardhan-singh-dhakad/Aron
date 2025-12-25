import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListingCard({ listing, navigation }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ListingDetail', { id: listing.id })}
    >
      <Text style={styles.title}>{listing.title}</Text>
      <Text style={styles.description}>{listing.description}</Text>
      <Text>Location: {listing.location}</Text>
      {listing.price && <Text>Price: ${listing.price}</Text>}
      {listing.salary && <Text>Salary: ${listing.salary}</Text>}
      <Text>Category: {listing.category}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    marginBottom: 5,
  },
});