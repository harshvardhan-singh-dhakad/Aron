
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export function Step1BasicInfo({ onNext, initialData }: any) {
    const { user } = useAuth();
    const [name, setName] = useState(initialData?.name || user?.displayName || '');
    const [phone, setPhone] = useState(initialData?.phone || user?.phoneNumber || '');
    const [image, setImage] = useState(initialData?.photoURL || user?.photoURL || null);
    const [location, setLocation] = useState(initialData?.location || '');
    const [city, setCity] = useState(initialData?.city || '');
    const [state, setState] = useState(initialData?.state || '');
    const [pincode, setPincode] = useState(initialData?.pincode || '');
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // Optional: Alert.alert('Permission to access location was denied');
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const detectLocation = async () => {
        setLoadingLocation(true);
        try {
            let location = await Location.getCurrentPositionAsync({});
            let address = await Location.reverseGeocodeAsync(location.coords);
            if (address && address.length > 0) {
                const addr = address[0];
                setCity(addr.city || addr.subregion || '');
                setState(addr.region || '');
                setPincode(addr.postalCode || '');
                setLocation(`${addr.city}, ${addr.region}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Could not fetch location. Please enter manually.');
        }
        setLoadingLocation(false);
    };

    const handleNext = () => {
        if (!name || !phone || !city) {
            Alert.alert('Incomplete Profile', 'Please fill in your Name, Phone and City.');
            return;
        }
        onNext({ name, phone, photoURL: image, location, city, state, pincode });
    };

    return (
        <ScrollView className="flex-1 bg-white p-6" contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="mb-8">
                <Text className="text-2xl font-bold text-black mb-2">Help us confirm it's you!</Text>
                <Text className="text-gray-500 text-base">Step 1: Basic Info</Text>
            </View>

            <TouchableOpacity onPress={pickImage} className="self-center mb-8 relative">
                {image ? (
                    <Image source={{ uri: image }} className="w-28 h-28 rounded-full border-2 border-gray-100" />
                ) : (
                    <View className="w-28 h-28 rounded-full bg-gray-100 items-center justify-center border-2 border-dashed border-gray-300">
                        <Ionicons name="camera" size={32} color="#9ca3af" />
                        <Text className="text-gray-400 text-xs mt-1">Upload Photo</Text>
                    </View>
                )}
                <View className="absolute bottom-0 right-0 bg-black p-2 rounded-full border-2 border-white">
                    <Ionicons name="pencil" size={16} color="white" />
                </View>
            </TouchableOpacity>

            <View className="space-y-4">
                <View>
                    <Text className="text-sm font-medium text-gray-700 ml-1 mb-1">Full Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded-xl p-4 text-lg bg-gray-50 text-black"
                        value={name}
                        onChangeText={setName}
                        placeholder="John Doe"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View>
                    <Text className="text-sm font-medium text-gray-700 ml-1 mb-1">Phone Number</Text>
                    <View className="relative">
                        <TextInput
                            className="border border-gray-300 rounded-xl p-4 text-lg bg-gray-100 text-gray-500"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="+91 98765 43210"
                            editable={!user?.phoneNumber}
                            keyboardType="phone-pad"
                        />
                        {user?.phoneNumber && (
                            <View className="absolute right-4 top-4">
                                <Ionicons name="checkmark-circle" size={24} color="green" />
                            </View>
                        )}
                    </View>
                </View>

                <View>
                    <Text className="text-sm font-medium text-gray-700 ml-1 mb-1">City / Location</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
                        <TextInput
                            className="flex-1 p-4 text-lg text-black"
                            value={city}
                            onChangeText={setCity} // Allow manual edit if detection fails
                            placeholder="Detecting..."
                            placeholderTextColor="#9ca3af"
                        />
                        <TouchableOpacity
                            onPress={detectLocation}
                            disabled={loadingLocation}
                            className="p-4 bg-gray-200 border-l border-gray-300 active:bg-gray-300"
                        >
                            {loadingLocation ? <ActivityIndicator color="black" /> : <Ionicons name="locate" size={24} color="black" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row space-x-4">
                    <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-700 ml-1 mb-1">State</Text>
                        <TextInput
                            className="border border-gray-300 rounded-xl p-4 text-lg bg-gray-50 text-black"
                            value={state}
                            onChangeText={setState}
                            placeholder="State"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-700 ml-1 mb-1">Pincode</Text>
                        <TextInput
                            className="border border-gray-300 rounded-xl p-4 text-lg bg-gray-50 text-black"
                            value={pincode}
                            onChangeText={setPincode}
                            placeholder="Pincode"
                            keyboardType="numeric"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleNext}
                className="bg-black p-4 rounded-xl items-center shadow-lg active:scale-[0.98] transition-all mt-8"
            >
                <Text className="text-white font-bold text-lg">Next Step</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
