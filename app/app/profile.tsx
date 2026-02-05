import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useAuthStore } from '../hooks/useAuthStore';
import { useState } from 'react';
import { User, Listing } from '../types';
import { mockUsers, mockListings } from '../constants/mockData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ProfilePage() {
  const { user, login, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  // Login Form States
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Mock Profile Creation States
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const handleLogin = () => {
    // Simulate login by just picking the first mock user for simplicity
    // or create a basic session if phone number provided
    if (phoneNumber.length > 0) {
      // Check if user exists in mock users (very simple simulation)
      const existingUser = mockUsers[0]; 
      login(existingUser);
    } else {
        Alert.alert("Please enter a phone number");
    }
  };

  const handleGuestLogin = () => {
    // Log in as a random mock user
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    login(randomUser);
  };

  const getUserListings = (): Listing[] => {
    if (!user) return [];
    return mockListings.filter(l => l.createdBy === user.uid);
  };

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white p-6 justify-center">
        
        <View className="mb-8 items-center">
            <View className="w-20 h-20 bg-gray-900 rounded-full items-center justify-center mb-4">
                <Text className="text-white text-3xl font-bold">K</Text>
            </View>
            <Text className="text-2xl font-bold mb-2 text-center">Welcome to Kaam Kiraya</Text>
            <Text className="text-gray-500 text-center px-4">Your local marketplace for jobs, services, and rentals.</Text>
        </View>

        <View className="space-y-4">
            <Text className="text-sm font-medium text-gray-700 ml-1 mb-1">Mobile Number</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-4 text-lg bg-gray-50"
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
            
            <TouchableOpacity 
              onPress={handleLogin}
              className="bg-black p-4 rounded-xl items-center shadow-lg active:scale-[0.98] transition-all"
            >
              <Text className="text-white font-bold text-lg">Login / Sign Up</Text>
            </TouchableOpacity>

            <View className="flex-row items-center justify-center my-6">
                <View className="h-[1px] bg-gray-200 flex-1" />
                <Text className="mx-4 text-gray-400">OR</Text>
                <View className="h-[1px] bg-gray-200 flex-1" />
            </View>

            <TouchableOpacity 
                onPress={handleGuestLogin}
                className="bg-white border border-gray-300 p-4 rounded-xl items-center shadow-sm active:bg-gray-50"
            >
                <Text className="text-gray-800 font-bold text-lg">Continue as Guest</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const userListings = getUserListings();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6 border-b border-gray-100 bg-white">
        <View className="flex-row justify-between items-start mb-6">
           <View className="flex-row items-center">
               <Image 
                 source={{ uri: user.profileImage || 'https://via.placeholder.com/150' }} 
                 className="w-16 h-16 rounded-full bg-gray-200"
               />
               <View className="ml-4">
                 <Text className="text-2xl font-bold text-gray-900">{user.name}</Text>
                 <Text className="text-gray-500">{user.location}</Text>
               </View>
           </View>
        </View>

        <TouchableOpacity onPress={logout} className="bg-red-50 border border-red-100 py-3 rounded-xl items-center w-full">
            <Text className="text-red-500 font-semibold">Log Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 bg-gray-50 p-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-4 mt-2">
             <Text className="text-xl font-bold text-gray-900">My Listings</Text>
             <View className="bg-blue-100 px-3 py-1 rounded-full">
                 <Text className="text-blue-700 font-bold text-xs">{userListings.length}</Text>
             </View>
        </View>
        
        {userListings.length === 0 ? (
          <View className="bg-white p-8 rounded-2xl items-center justify-center border border-gray-100 border-dashed">
              <Text className="text-gray-400 text-lg mb-2">No active listings</Text>
              <TouchableOpacity onPress={() => router.push('/post-ad')}>
                  <Text className="text-blue-600 font-medium">Post an Ad now</Text>
              </TouchableOpacity>
          </View>
        ) : (
          userListings.map((listing) => (
            <View key={listing.id} className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100 relative overflow-hidden">
               {/* Status Badge */}
               <View className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl ${listing.isVerifiedPost ? 'bg-green-100' : 'bg-yellow-100'}`}>
                   <Text className={`text-[10px] font-bold tracking-wider ${listing.isVerifiedPost ? 'text-green-700' : 'text-yellow-700'}`}>
                       {listing.isVerifiedPost ? 'ACTIVE' : 'PENDING'}
                   </Text>
               </View>

              <View className="flex-row">
                  {listing.images && listing.images.length > 0 && (
                      <Image 
                        source={{ uri: listing.images[0] }} 
                        className="w-20 h-20 rounded-xl bg-gray-100 mr-4" 
                      />
                  )}
                  <View className="flex-1 justify-center">
                      <Text className="font-bold text-lg text-gray-900 mb-1" numberOfLines={1}>{listing.title}</Text>
                      <Text className="text-sm text-gray-500 mb-2 capitalize">{listing.category} • {listing.createdAt instanceof Date ? listing.createdAt.toLocaleDateString() : 'Just now'}</Text>
                      <Text className="text-blue-600 font-bold">
                        {listing.price ? `₹${listing.price}` : 
                         listing.salary ? `₹${listing.salary}/mo` : 
                         listing.rent ? `₹${listing.rent}/mo` : 'Contact for Price'}
                      </Text>
                  </View>
              </View>
              
              <View className="flex-row mt-4 pt-4 border-t border-gray-100">
                  <TouchableOpacity 
                     onPress={() => router.push(`/listing/${listing.id}`)}
                     className="flex-1 items-center"
                  >
                      <Text className="text-gray-900 font-medium">View</Text>
                  </TouchableOpacity>
                  <View className="w-[1px] bg-gray-200 h-full mx-2" />
                  <TouchableOpacity className="flex-1 items-center">
                      <Text className="text-gray-500 font-medium">Edit</Text>
                  </TouchableOpacity>
                  <View className="w-[1px] bg-gray-200 h-full mx-2" />
                  <TouchableOpacity className="flex-1 items-center">
                      <Text className="text-red-500 font-medium">Delete</Text>
                  </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}