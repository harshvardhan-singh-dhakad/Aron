
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function CompleteProfilePage() {
    const router = useRouter();
    const { user } = useAuth();
    const { redirect } = useLocalSearchParams<{ redirect: string }>();

    const [fullName, setFullName] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');

    const [locating, setLocating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.uid) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            const docRef = doc(db, 'users', user!.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFullName(data.name || '');
                setImage(data.profileImage || null);
                setCity(data.city || '');
                setState(data.state || '');
                setPincode(data.pincode || ''); // Assuming pincode is saved
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

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
        setLocating(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            // Try standard Expo Geocoding first
            let address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            console.log("Expo Value:", address);

            let cityVal = '';
            let stateVal = '';
            let postalVal = '';

            if (address && address.length > 0) {
                const addr = address[0] as any;
                cityVal = addr.city || addr.subregion || addr.district || '';
                stateVal = addr.region || addr.administrativeArea || '';
                postalVal = addr.postalCode || '';
            }

            // Web Fallback: If Expo returns empty details (common on web), use OpenStreetMap API
            if ((!cityVal || !stateVal) && Platform.OS === 'web') {
                console.log("Fetching from Nominatim (Web Fallback)...");
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
                    const data = await response.json();

                    console.log("Nominatim Data:", data);
                    if (data && data.address) {
                        cityVal = data.address.city || data.address.town || data.address.village || data.address.county || '';
                        stateVal = data.address.state || data.address.region || '';
                        postalVal = data.address.postcode || '';
                    }
                } catch (err) {
                    console.log("Nominatim Error:", err);
                }
            }

            if (cityVal) setCity(cityVal);
            if (stateVal) setState(stateVal);
            if (postalVal) setPincode(postalVal);

            if (!cityVal && !stateVal) {
                Alert.alert("Location Found", "GPS is working, but address lookup failed. Please type your City manually.");
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not fetch location. Please enter manually.');
        } finally {
            setLocating(false);
        }
    };

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert("Required", "Please enter your full name.");
            return;
        }
        if (!city.trim()) {
            Alert.alert("Required", "Please enter your city.");
            return;
        }

        setSaving(true);
        try {
            if (!user) throw new Error("No User Found");

            let imageUrl = '';
            if (image) {
                // Upload logic
                const response = await fetch(image);
                const blob = await response.blob();
                const storageRef = ref(storage, `profiles/${user.uid}/profile.jpg`);
                await uploadBytes(storageRef, blob);
                imageUrl = await getDownloadURL(storageRef);
            }

            // Save User Profile
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: fullName,
                profileImage: imageUrl,
                location: `${city}, ${state}`, // Simple string location
                city: city,
                state: state,
                phoneNumber: user.phoneNumber,
                onboardingCompleted: true, // Mark as done
                createdAt: new Date(),
                role: 'user' // Default Role
            }, { merge: true });

            Alert.alert("Success", "Profile setup complete!");

            // Redirect logic
            if (redirect) {
                router.replace(redirect as any);
            } else {
                router.replace('/profile');
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-3xl font-bold text-black mb-2">Setup Profile</Text>
                    <Text className="text-gray-500 mb-8">Let's get to know you better.</Text>

                    {/* Profile Photo */}
                    <View className="items-center mb-8">
                        <TouchableOpacity onPress={pickImage} className="relative">
                            <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center border border-gray-200 overflow-hidden">
                                {image ? (
                                    <Image source={{ uri: image }} className="w-full h-full" />
                                ) : (
                                    <Ionicons name="camera" size={32} color="#9ca3af" />
                                )}
                            </View>
                            <View className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-2 border-white">
                                <Ionicons name="pencil" size={12} color="white" />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-blue-600 font-medium mt-2">Upload Photo</Text>
                    </View>

                    {/* Fields */}
                    <Text className="font-bold mb-2 ml-1 text-gray-700">Full Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded-xl p-4 mb-6 bg-gray-50 text-base"
                        placeholder="Enter full name"
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <Text className="font-bold mb-2 ml-1 text-gray-700">Location</Text>
                    <View className="flex-row items-center mb-6">
                        <View className="flex-1">
                            <TextInput
                                className="border border-gray-300 rounded-xl p-4 bg-gray-50 text-base mb-3"
                                placeholder="City"
                                value={city}
                                onChangeText={setCity}
                            />
                            <View className="flex-row gap-3">
                                <TextInput
                                    className="flex-1 border border-gray-300 rounded-xl p-4 bg-gray-50 text-base"
                                    placeholder="State"
                                    value={state}
                                    editable={false} // Auto-filled typically
                                />
                                <TextInput
                                    className="flex-1 border border-gray-300 rounded-xl p-4 bg-gray-50 text-base"
                                    placeholder="Pincode"
                                    value={pincode}
                                    onChangeText={setPincode}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={detectLocation}
                        disabled={locating}
                        className="flex-row items-center justify-center border border-blue-600 rounded-xl p-3 mb-8 bg-blue-50"
                    >
                        {locating ? <ActivityIndicator size="small" color="#2563EB" /> : <Ionicons name="location" size={20} color="#2563EB" />}
                        <Text className="text-blue-600 font-bold ml-2">Detect Current Location</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={saving}
                        className={`bg-blue-600 p-4 rounded-xl items-center shadow-lg active:scale-[0.98] transition-all mb-10 ${saving ? 'opacity-70' : ''}`}
                    >
                        {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Save & Continue</Text>}
                    </TouchableOpacity>

                </ScrollView>
            )}
        </SafeAreaView>
    );
}
