import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuthStore } from '../hooks/useAuthStore'; 
import { useState } from 'react';
import { mockListings } from '../constants/mockData';
import { Listing } from '../types';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Upload, X } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

const categories = [
  { label: 'Jobs', value: 'jobs' },
  { label: 'Services', value: 'services' },
  { label: 'Buy / Sell', value: 'buy-sell' },
  { label: 'Rentals', value: 'rentals' },
];

export default function PostAdPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'jobs' as Listing['category'],
    location: '',
    price: '',
    rent: '',
    salary: '',
  });

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to post an ad.');
      router.push('/profile');
      return;
    }

    if (!formData.title || !formData.description || !formData.location) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
        try {
          const newListing: Listing = {
            id: `listing_${Date.now()}`,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            location: formData.location,
            createdBy: user.uid,
            createdAt: new Date(),
            isVerifiedPost: true, // Auto verify for mock
            ownerName: user.name,
            ownerImage: user.profileImage,
            images: [],
          };
    
          if (formData.category === 'jobs' && formData.salary) newListing.salary = Number(formData.salary);
          if (formData.category === 'rentals' && formData.rent) newListing.rent = Number(formData.rent);
          if ((formData.category === 'buy-sell' || formData.category === 'services') && formData.price) {
            newListing.price = Number(formData.price);
          }
    
          mockListings.unshift(newListing); // Add to beginning of mock array
          
          Alert.alert('Success', 'Your ad has been posted successfully!');
          setLoading(false);
          router.push('/');
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to post ad. Please try again.');
          setLoading(false);
        }
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Post New Ad</Text>
      </View>

      <ScrollView className="p-4" keyboardShouldPersistTaps="handled">
        
        {/* Image Upload Placeholder */}
        <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-xl h-40 items-center justify-center mb-6 bg-gray-50">
          <View className="items-center">
            <Upload size={32} color="gray" />
            <Text className="text-gray-500 mt-2 font-medium">Upload Photos</Text>
            <Text className="text-gray-400 text-xs mt-1">(Tap to add images)</Text>
          </View>
        </TouchableOpacity>

        <Text className="font-semibold mb-2 text-gray-700">Title</Text>
        <TextInput
          className="border border-gray-300 rounded-xl p-4 mb-4 text-base bg-gray-50"
          placeholder="Ad Title (e.g. Plumber needed)"
          value={formData.title}
          onChangeText={(text) => handleChange('title', text)}
        />

        <Text className="font-semibold mb-2 text-gray-700">Category</Text>
        <View className="border border-gray-300 rounded-xl mb-4 bg-gray-50 overflow-hidden">
          <Picker
            selectedValue={formData.category}
            onValueChange={(itemValue) => handleChange('category', itemValue)}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Picker>
        </View>

        {formData.category === 'jobs' && (
          <>
            <Text className="font-semibold mb-2 text-gray-700">Salary (Monthly)</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-4 text-base bg-gray-50"
              placeholder="e.g. 15000"
              keyboardType="numeric"
              value={formData.salary}
              onChangeText={(text) => handleChange('salary', text)}
            />
          </>
        )}

        {formData.category === 'rentals' && (
          <>
            <Text className="font-semibold mb-2 text-gray-700">Rent (Monthly)</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-4 text-base bg-gray-50"
              placeholder="e.g. 8000"
              keyboardType="numeric"
              value={formData.rent}
              onChangeText={(text) => handleChange('rent', text)}
            />
          </>
        )}

        {(formData.category === 'buy-sell' || formData.category === 'services') && (
          <>
            <Text className="font-semibold mb-2 text-gray-700">Price</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-4 text-base bg-gray-50"
              placeholder="e.g. 500"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => handleChange('price', text)}
            />
          </>
        )}

        <Text className="font-semibold mb-2 text-gray-700">Location</Text>
        <TextInput
          className="border border-gray-300 rounded-xl p-4 mb-4 text-base bg-gray-50"
          placeholder="City, Area (e.g. Andheri West, Mumbai)"
          value={formData.location}
          onChangeText={(text) => handleChange('location', text)}
        />

        <Text className="font-semibold mb-2 text-gray-700">Description</Text>
        <TextInput
          className="border border-gray-300 rounded-xl p-4 mb-6 h-32 text-base bg-gray-50"
          placeholder="Describe your listing in detail..."
          multiline
          textAlignVertical="top"
          value={formData.description}
          onChangeText={(text) => handleChange('description', text)}
        />

        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={loading}
          className={`bg-black p-4 rounded-xl items-center mb-8 shadow-lg ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Post Ad</Text>
          )}
        </TouchableOpacity>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
