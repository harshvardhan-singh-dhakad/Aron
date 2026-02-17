
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
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
                Alert.alert('Permission to access location was denied');
                return;
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
            Alert.alert('Error', 'Could not fetch location');
        }
        setLoadingLocation(false);
    };

    const handleNext = () => {
        if (!name || !phone || !city) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }
        onNext({ name, phone, photoURL: image, location, city, state, pincode });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Help us confirm it's you!</Text>
            <Text style={styles.subHeader}>Step 1: Basic Info</Text>

            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="camera" size={40} color="#ccc" />
                        <Text style={{ color: '#ccc' }}>Upload Photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone number"
                    editable={!user?.phoneNumber} // Editable only if not from auth
                    keyboardType="phone-pad"
                />
                {user?.phoneNumber && <Text style={styles.verifiedText}>✓ Verified</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginRight: 10 }]}
                        value={city}
                        editable={false}
                        placeholder="Auto-detected City"
                    />
                    <TouchableOpacity onPress={detectLocation} style={styles.locationButton} disabled={loadingLocation}>
                        {loadingLocation ? <ActivityIndicator color="white" /> : <Ionicons name="location" size={20} color="white" />}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[styles.inputGroup, { width: '48%' }]}>
                    <Text style={styles.label}>State</Text>
                    <TextInput style={styles.input} value={state} onChangeText={setState} placeholder="State" />
                </View>
                <View style={[styles.inputGroup, { width: '48%' }]}>
                    <Text style={styles.label}>Pincode</Text>
                    <TextInput style={styles.input} value={pincode} onChangeText={setPincode} placeholder="Pincode" keyboardType="numeric" />
                </View>
            </View>

            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                <Text style={styles.nextButtonText}>Next Step →</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: 'white', flex: 1 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    subHeader: { fontSize: 16, color: '#666', marginBottom: 20 },
    imageContainer: { alignSelf: 'center', marginBottom: 20 },
    image: { width: 100, height: 100, borderRadius: 50 },
    placeholderImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
    verifiedText: { color: 'green', fontSize: 12, marginTop: 5 },
    locationButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 8 },
    nextButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 40 },
    nextButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
