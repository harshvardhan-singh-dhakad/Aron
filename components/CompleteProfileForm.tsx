import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function CompleteProfileForm() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !location) return Alert.alert('Error', 'Fill all fields');
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user!.uid), {
        name,
        location,
        phone: user!.phoneNumber || '',
        verified: false,
      });
      Alert.alert('Success', 'Profile completed');
    } catch (error) {
      console.error('Failed to save profile', error);
      Alert.alert('Error', 'Failed to save profile');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <View style={{ width: '100%', maxWidth: 400 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Complete Your Profile</Text>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Name</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 16 }}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Location</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 16 }}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter your location"
        />
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={{ backgroundColor: loading ? '#ccc' : '#007bff', padding: 12, borderRadius: 8, alignItems: 'center' }}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Profile</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}