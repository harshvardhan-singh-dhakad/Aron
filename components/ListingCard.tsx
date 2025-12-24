import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

interface Listing {
  id: string;
  title: string;
  description: string;
  price?: number;
  salary?: number;
  location: string;
  category: string;
  createdAt: any;
  userId: string;
  isVerifiedPost: boolean;
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listing/${listing.id}` as any} asChild>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.description}>{listing.description}</Text>
        <Text>Location: {listing.location}</Text>
        {listing.price && <Text>Price: ${listing.price}</Text>}
        {listing.salary && <Text>Salary: ${listing.salary}</Text>}
        <Text>Category: {listing.category}</Text>
      </TouchableOpacity>
    </Link>
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