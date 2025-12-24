import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const categories = [
  { id: 'jobs', name: 'Jobs', fields: ['title', 'description', 'location', 'salary'] },
  { id: 'services', name: 'Services', fields: ['title', 'description', 'location', 'price'] },
  { id: 'rentals', name: 'Rentals', fields: ['title', 'description', 'location', 'price', 'duration'] },
];

export default function PostAdScreen() {
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post an ad.');
      return;
    }
    if (!category || !formData.title || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'listings'), {
        ...formData,
        category,
        userId: user.uid,
        isVerifiedPost: false,
        createdAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Ad posted successfully!');
      setFormData({});
      setCategory('');
    } catch (error) {
      Alert.alert('Error', 'Failed to post ad.');
    }
  };

  const selectedCategory = categories.find((cat) => cat.id === category);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Post an Ad</Text>

      <Text>Category</Text>
      <View style={styles.categoryButtons}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryButton, category === cat.id && styles.selectedCategory]}
            onPress={() => setCategory(cat.id)}
          >
            <Text>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCategory && (
        <View>
          {selectedCategory.fields.map((field) => (
            <View key={field} style={styles.inputContainer}>
              <Text>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
              <TextInput
                style={styles.input}
                value={formData[field] || ''}
                onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                multiline={field === 'description'}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Post Ad</Text>
          </TouchableOpacity>
        </View>
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
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  categoryButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectedCategory: {
    backgroundColor: '#007bff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});