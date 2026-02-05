import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useDoc } from '../hooks/useDoc';
import { useCollection } from '../hooks/useCollection';
import { where } from 'firebase/firestore';
import { CompleteProfileForm } from './CompleteProfileForm';
import { ListingCard } from './ListingCard';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function ProfileView() {
  const { user } = useAuth();
  const { data: profile, loading: profileLoading } = useDoc('users', user!.uid);
  const { data: myListings } = useCollection('listings', where('ownerId', '==', user!.uid));

  const handleLogout = async () => {
    await signOut(auth);
    Alert.alert('Success', 'Logged out');
  };

  if (profileLoading) return <Text>Loading...</Text>;

  if (!profile) return <CompleteProfileForm />;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Profile</Text>
      <View style={{ marginBottom: 16 }}>
        <Text>Name: {profile.name}</Text>
        <Text>Phone: {profile.phone}</Text>
        <Text>Location: {profile.location}</Text>
        <Text>Verified: {profile.verified ? 'Yes' : 'No'}</Text>
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        style={{ borderWidth: 1, borderColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 24 }}
      >
        <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Log Out</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>My Listings</Text>
      <FlatList
        data={myListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        scrollEnabled={false}
        ListEmptyComponent={<Text>No listings.</Text>}
      />
    </ScrollView>
  );
}