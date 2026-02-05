import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Briefcase, Wrench, Home } from 'lucide-react';

const categories = [
  { id: 'jobs', name: 'Jobs', icon: Briefcase, fields: [
    { key: 'title', label: 'Job Title', placeholder: 'e.g. Software Developer', required: true },
    { key: 'description', label: 'Job Description', placeholder: 'Describe the job requirements and responsibilities', required: true, multiline: true },
    { key: 'location', label: 'Location', placeholder: 'e.g. New York, NY', required: true },
    { key: 'salary', label: 'Salary/Rate', placeholder: 'e.g. $50/hour or $100k/year', required: false },
  ]},
  { id: 'services', name: 'Services', icon: Wrench, fields: [
    { key: 'title', label: 'Service Title', placeholder: 'e.g. Plumbing Services', required: true },
    { key: 'description', label: 'Service Description', placeholder: 'Describe what services you offer', required: true, multiline: true },
    { key: 'location', label: 'Service Area', placeholder: 'e.g. Downtown Chicago', required: true },
    { key: 'price', label: 'Price/Rate', placeholder: 'e.g. $100 per visit', required: false },
  ]},
  { id: 'rentals', name: 'Rentals', icon: Home, fields: [
    { key: 'title', label: 'Property Title', placeholder: 'e.g. 2BR Apartment Downtown', required: true },
    { key: 'description', label: 'Property Description', placeholder: 'Describe the property features and amenities', required: true, multiline: true },
    { key: 'location', label: 'Location', placeholder: 'e.g. 123 Main St, City', required: true },
    { key: 'price', label: 'Rent Price', placeholder: 'e.g. $1500/month', required: false },
    { key: 'duration', label: 'Lease Duration', placeholder: 'e.g. 12 months', required: false },
  ]},
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
    if (!category) {
      Alert.alert('Error', 'Please select a category.');
      return;
    }
    const selectedCategory = categories.find((cat) => cat.id === category);
    const requiredFields = selectedCategory?.fields.filter(f => f.required) || [];
    const missingFields = requiredFields.filter(f => !formData[f.key]?.trim());
    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
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
      console.error('Error posting ad:', error);
      Alert.alert('Error', 'Failed to post ad.');
    }
  };

  const selectedCategory = categories.find((cat) => cat.id === category);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Plus size={24} color="#007bff" />
        <Text style={styles.headerTitle}>Create a New Listing</Text>
        <Text style={styles.headerSubtitle}>Post your job, service, or rental</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, category === cat.id && styles.selectedCategory]}
                onPress={() => setCategory(cat.id)}
              >
                <IconComponent size={32} color={category === cat.id ? '#fff' : '#007bff'} />
                <Text style={[styles.categoryText, category === cat.id && styles.selectedCategoryText]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {selectedCategory && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listing Details</Text>
          {selectedCategory.fields.map((field) => (
            <View key={field.key} style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {field.label} {field.required && <Text style={styles.required}>*</Text>}
              </Text>
              <TextInput
                style={[styles.input, field.multiline && styles.multilineInput]}
                value={formData[field.key] || ''}
                onChangeText={(text) => setFormData({ ...formData, [field.key]: text })}
                placeholder={field.placeholder}
                placeholderTextColor="#999"
                multiline={field.multiline}
                numberOfLines={field.multiline ? 4 : 1}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Post Listing</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    width: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategory: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#007bff',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  required: {
    color: '#dc3545',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
