import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useDoc } from '../hooks/useDoc';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ListingDetailScreen({ route }) {
  const { id } = route.params;
  const { user } = useAuth();
  const { data: listing, loading } = useDoc('listings', id);
  const [message, setMessage] = useState('');

  const handleApply = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to apply.');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message.');
      return;
    }

    try {
      await addDoc(collection(db, 'applications'), {
        listingId: id,
        senderId: user.uid,
        recipientId: listing.userId,
        message,
        status: 'pending',
        listingTitle: listing.title,
        createdAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Application sent!');
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send application.');
    }
  };

  const handleShare = () => {
    Alert.alert('Share', 'Sharing functionality not implemented yet.');
  };

  if (loading) return <Text>Loading...</Text>;
  if (!listing) return <Text>Listing not found.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{listing.title}</Text>
      <Text style={styles.description}>{listing.description}</Text>
      <Text>Location: {listing.location}</Text>
      {listing.price && <Text>Price: ${listing.price}</Text>}
      {listing.salary && <Text>Salary: ${listing.salary}</Text>}
      {listing.duration && <Text>Duration: {listing.duration}</Text>}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleApply}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Your message..."
        value={message}
        onChangeText={setMessage}
        multiline
      />
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
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    height: 100,
    textAlignVertical: 'top',
  },
});