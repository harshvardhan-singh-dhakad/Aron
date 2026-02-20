import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { CATEGORIES } from '../../constants/categories';

interface PartnerRegistrationModalProps {
    visible: boolean;
    onClose: () => void;
    user: any;
    onSuccess: () => void;
}

export function PartnerRegistrationModal({ visible, onClose, user, onSuccess }: PartnerRegistrationModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Partner Type
    const [partnerType, setPartnerType] = useState<'individual' | 'business'>('individual');

    // Step 2: Info
    const [businessName, setBusinessName] = useState(user?.name || '');
    const [profession, setProfession] = useState(user?.profession || '');

    // Step 2: Location
    const [city, setCity] = useState(user?.city || '');
    const [area, setArea] = useState(user?.area || '');
    const [pincode, setPincode] = useState(user?.pincode || '');
    const [lat, setLat] = useState(user?.lat || 0);
    const [lng, setLng] = useState(user?.lng || 0);
    const [detectingLocation, setDetectingLocation] = useState(false);

    // Categories list flattened for the picker
    const ALL_CATEGORIES = CATEGORIES.flatMap(c => c.subcategories.map(s => ({ ...s, parent: c.name })));
    const [categoryModal, setCategoryModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = ALL_CATEGORIES.filter(c =>
        c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.parent.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Step 3: Identity Verification
    const [docType, setDocType] = useState('aadhaar');
    const [docImage, setDocImage] = useState<string | null>(null);

    const handleNext = () => {
        console.log('Moving to next step. Current step:', step);
        Keyboard.dismiss();
        if (step === 1) {
            // Pre-fill name if individual and name is empty
            if (partnerType === 'individual' && !businessName.trim() && user?.name) {
                setBusinessName(user.name);
            }
            setStep(2);
        } else if (step === 2) {
            if (!businessName.trim()) {
                const label = partnerType === 'individual' ? "your name or work name" : "your business or shop name";
                Alert.alert("Required", `Please enter ${label}.`);
                return;
            }
            if (!profession.trim()) {
                Alert.alert("Required", "Please enter your profession or category.");
                return;
            }
            setStep(3);
        } else if (step === 3) {
            if (!city.trim() || !area.trim()) {
                Alert.alert("Required", "City and Locality/Area are mandatory.");
                return;
            }
            setStep(4);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const detectLocation = async () => {
        setDetectingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission denied", "Please allow location access to auto-detect your city.");
                return;
            }

            const pos = await Location.getCurrentPositionAsync({});
            const [rev] = await Location.reverseGeocodeAsync({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
            });

            if (rev) {
                setCity(rev.city || rev.district || rev.region || '');
                setArea(`${rev.name || ''}, ${rev.street || ''}`.replace(/^, /, ''));
                setPincode(rev.postalCode || '');
                setLat(pos.coords.latitude);
                setLng(pos.coords.longitude);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not detect location. Please try manually or check GPS.");
        } finally {
            setDetectingLocation(false);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Please allow access to your photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setDocImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        console.log('Submit button clicked on Step 4');
        Keyboard.dismiss();
        if (!docImage) {
            console.log('Validation failed: No document image');
            Alert.alert("Required", "Please upload a photo of your identity document.");
            return;
        }

        setLoading(true);
        console.log('Submission logic starting...', { partnerType, businessName, profession, city, area });
        try {
            // 1. Upload Document Image
            let downloadURL = docImage;

            if (docImage && (docImage.startsWith('file') || docImage.startsWith('blob') || !docImage.startsWith('http'))) {
                console.log('Image needs upload, starting storage task...');
                const response = await fetch(docImage);
                const blob = await response.blob();
                const storageRef = ref(storage, `verifications/${user.uid}/${Date.now()}.jpg`);
                await uploadBytes(storageRef, blob);
                downloadURL = await getDownloadURL(storageRef);
                console.log('Image uploaded successfully:', downloadURL);
            } else {
                console.log('Image already uploaded or invalid protocol, skipping upload step.');
            }

            console.log('Updating Firestore...');
            // 2. Update Firestore
            await updateDoc(doc(db, 'users', user.uid), {
                partnerStatus: 'pending',
                isPartnerRegistered: true,
                partnerType: partnerType,
                businessDetails: {
                    name: businessName,
                    category: profession,
                    isIndividual: partnerType === 'individual',
                },
                location: {
                    city: city,
                    area: area,
                    pincode: pincode,
                    lat: lat,
                    lng: lng,
                    address: `${area}, ${city} ${pincode}`.trim(),
                },
                city: city,
                area: area,
                pincode: pincode,
                verification: {
                    type: docType,
                    imageUrl: downloadURL,
                    status: 'pending',
                    submittedAt: serverTimestamp(),
                }
            });

            console.log('Submission complete! Triggering onSuccess callback.');
            Alert.alert("Success", "Registration submitted! Your profile is under review.");
            onSuccess();
        } catch (error: any) {
            console.error('Submission error:', error);
            Alert.alert("Error", `Failed to submit registration: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal visible={visible} animationType="slide" transparent>
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl h-[85%] px-6 pt-8">
                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-2xl font-extrabold text-u-navy">Partner Registration</Text>
                                <Text className="text-gray-400 text-sm mt-1">Step {step} of 4</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
                                <Text className="text-xl">✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                            {step === 1 && (
                                <View className="gap-6">
                                    <Text className="text-lg font-bold text-gray-800">Choose Profile Type</Text>
                                    <View className="gap-3">
                                        <TouchableOpacity
                                            onPress={() => setPartnerType('individual')}
                                            className={`p-5 rounded-2xl border-2 ${partnerType === 'individual' ? 'bg-u-navy/5 border-u-navy' : 'bg-gray-50 border-gray-100'}`}
                                        >
                                            <View className="flex-row items-center gap-4">
                                                <Text className="text-3xl">👷</Text>
                                                <View className="flex-1">
                                                    <Text className={`text-base font-bold ${partnerType === 'individual' ? 'text-u-navy' : 'text-gray-700'}`}>Individual / Multi-Work</Text>
                                                    <Text className="text-xs text-gray-400 mt-0.5">For Plumbers, Drivers, Farmers, Laborers, etc.</Text>
                                                </View>
                                                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${partnerType === 'individual' ? 'border-u-navy bg-u-navy' : 'border-gray-300'}`}>
                                                    {partnerType === 'individual' && <View className="w-2 h-2 rounded-full bg-white" />}
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => setPartnerType('business')}
                                            className={`p-5 rounded-2xl border-2 ${partnerType === 'business' ? 'bg-u-navy/5 border-u-navy' : 'bg-gray-50 border-gray-100'}`}
                                        >
                                            <View className="flex-row items-center gap-4">
                                                <Text className="text-3xl">🏪</Text>
                                                <View className="flex-1">
                                                    <Text className={`text-base font-bold ${partnerType === 'business' ? 'text-u-navy' : 'text-gray-700'}`}>Business / Shop Name</Text>
                                                    <Text className="text-xs text-gray-400 mt-0.5">For Agencies, Registered Shops, Showrooms, etc.</Text>
                                                </View>
                                                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${partnerType === 'business' ? 'border-u-navy bg-u-navy' : 'border-gray-300'}`}>
                                                    {partnerType === 'business' && <View className="w-2 h-2 rounded-full bg-white" />}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {step === 2 && (
                                <View className="gap-5">
                                    <Text className="text-lg font-bold text-gray-800">
                                        {partnerType === 'individual' ? "Individual Profile" : "Business Profile"}
                                    </Text>
                                    <View>
                                        <Text className="text-xs font-bold text-gray-400 uppercase mb-2">
                                            {partnerType === 'individual' ? "Work Name / Display Name" : "Business / Shop Name"}
                                        </Text>
                                        <TextInput
                                            value={businessName}
                                            onChangeText={setBusinessName}
                                            placeholder={partnerType === 'individual' ? "e.g. Ramu Driver, Sonu Mechanic" : "e.g. Singh Electronics, Raj Services"}
                                            className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-base"
                                        />
                                        {partnerType === 'individual' && (
                                            <Text className="text-[10px] text-gray-400 mt-1.5 ml-1">You can use your own name or a work name (jasie: Raju Mistri)</Text>
                                        )}
                                    </View>
                                    <View>
                                        <Text className="text-xs font-bold text-gray-400 uppercase mb-2">Category / Profession</Text>
                                        <TouchableOpacity
                                            onPress={() => setCategoryModal(true)}
                                            className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-row justify-between items-center"
                                        >
                                            <Text className={`text-base ${profession ? 'text-gray-800' : 'text-gray-400'}`}>
                                                {profession || "Select your category..."}
                                            </Text>
                                            <Text className="text-gray-400">▼</Text>
                                        </TouchableOpacity>
                                        <Text className="text-[10px] text-gray-400 mt-1.5 ml-1">Choose from standard categories (e.g. Electrician, Painter, etc.)</Text>
                                    </View>
                                </View>
                            )}

                            {step === 3 && (
                                <View className="gap-5">
                                    <Text className="text-lg font-bold text-gray-800">Your Location</Text>

                                    <View className="gap-4">
                                        <View>
                                            <Text className="text-xs font-bold text-gray-400 uppercase mb-2">City / District</Text>
                                            <TextInput
                                                value={city}
                                                onChangeText={setCity}
                                                placeholder="e.g. Jaipur, Phulera"
                                                className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-base"
                                            />
                                        </View>

                                        <View>
                                            <Text className="text-xs font-bold text-gray-400 uppercase mb-2">Locality / Area / Village</Text>
                                            <TextInput
                                                value={area}
                                                onChangeText={setArea}
                                                placeholder="e.g. Malviya Nagar, Gandhi Chowk"
                                                className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-base"
                                            />
                                        </View>

                                        <View>
                                            <Text className="text-xs font-bold text-gray-400 uppercase mb-2">Pincode (Optional)</Text>
                                            <TextInput
                                                value={pincode}
                                                onChangeText={setPincode}
                                                placeholder="e.g. 302017"
                                                keyboardType="numeric"
                                                className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-base"
                                            />
                                        </View>
                                    </View>

                                    <View className="mt-2 pt-4 border-t border-gray-100">
                                        <TouchableOpacity
                                            onPress={detectLocation}
                                            disabled={detectingLocation}
                                            className="bg-u-navy/5 p-4 rounded-2xl border border-u-navy/20 flex-row items-center justify-center gap-3"
                                        >
                                            {detectingLocation ? (
                                                <ActivityIndicator color="#1e293b" />
                                            ) : (
                                                <>
                                                    <Text className="text-xl">📡</Text>
                                                    <Text className="text-sm font-bold text-u-navy">Auto-Detect Current Location</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                        <Text className="text-[11px] text-gray-400 text-center mt-3 italic">
                                            Using GPS is recommended for better lead matching.
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {step === 4 && (
                                <View className="gap-5">
                                    <Text className="text-lg font-bold text-gray-800">Identity Verification</Text>

                                    <View>
                                        <Text className="text-xs font-bold text-gray-400 uppercase mb-3">Document Type</Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {['aadhaar', 'pan', 'voter', 'dl'].map((t) => (
                                                <TouchableOpacity
                                                    key={t}
                                                    onPress={() => setDocType(t)}
                                                    className={`px-4 py-2.5 rounded-xl border ${docType === t ? 'bg-u-navy border-u-navy' : 'bg-white border-gray-200'}`}
                                                >
                                                    <Text className={`text-xs font-bold uppercase ${docType === t ? 'text-white' : 'text-gray-500'}`}>{t}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-xs font-bold text-gray-400 uppercase mb-3">Upload Photo</Text>
                                        <TouchableOpacity
                                            onPress={pickImage}
                                            className="w-full h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden items-center justify-center"
                                        >
                                            {docImage ? (
                                                <Image source={{ uri: docImage }} className="w-full h-full" />
                                            ) : (
                                                <>
                                                    <Text className="text-3xl mb-2">📸</Text>
                                                    <Text className="text-sm font-bold text-gray-500">Tap to upload photo</Text>
                                                    <Text className="text-xs text-gray-400 mt-1">Front side of your ID card</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </ScrollView>

                        {/* Footer Buttons */}
                        <View className="py-6 flex-row gap-3">
                            {step > 1 && (
                                <TouchableOpacity
                                    onPress={handleBack}
                                    className="flex-1 bg-gray-100 py-4 rounded-xl items-center"
                                >
                                    <Text className="text-base font-bold text-gray-600">Back</Text>
                                </TouchableOpacity>
                            )}

                            {step < 4 ? (
                                <TouchableOpacity
                                    onPress={handleNext}
                                    className="flex-[2] bg-u-navy py-4 rounded-xl items-center"
                                >
                                    <Text className="text-base font-bold text-white">Continue</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={loading}
                                    className="flex-[2] bg-p-green py-4 rounded-xl items-center shadow-sm shadow-green-500/30"
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text className="text-base font-bold text-white">Submit Registration</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Category Selection Modal moved OUTSIDE main modal view hierarchy but kept within component */}
            <Modal visible={categoryModal} animationType="slide" transparent>
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl h-[70%] p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-u-navy">Select Category</Text>
                            <TouchableOpacity onPress={() => {
                                setCategoryModal(false);
                                Keyboard.dismiss();
                            }} className="bg-gray-100 p-2 rounded-full">
                                <Text className="font-bold">✕</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            placeholder="Search categories (e.g. Plumber, Shop...)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-base mb-4"
                        />

                        <ScrollView className="flex-1">
                            {filteredCategories.map((item, index) => (
                                <TouchableOpacity
                                    key={`${item.value}-${index}`}
                                    onPress={() => {
                                        setProfession(item.label);
                                        setCategoryModal(false);
                                        Keyboard.dismiss();
                                    }}
                                    className="py-4 border-b border-gray-50 flex-row justify-between items-center"
                                >
                                    <View>
                                        <Text className="text-base text-gray-800 font-semibold">{item.label}</Text>
                                        <Text className="text-[10px] text-gray-400 uppercase tracking-wider">{item.parent}</Text>
                                    </View>
                                    {profession === item.label && <Text className="text-u-navy text-lg">✓</Text>}
                                </TouchableOpacity>
                            ))}
                            {filteredCategories.length === 0 && (
                                <View className="items-center py-10">
                                    <Text className="text-gray-400">No matching categories found</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setCategoryModal(false);
                                            Keyboard.dismiss();
                                        }}
                                        className="mt-4 bg-u-navy/10 px-6 py-2 rounded-full"
                                    >
                                        <Text className="text-u-navy font-bold">Use Custom Category</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}
