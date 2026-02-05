import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/listings/${category.id}`} asChild>
      <TouchableOpacity style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, marginBottom: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>{category.name}</Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>{category.description}</Text>
      </TouchableOpacity>
    </Link>
  );
}