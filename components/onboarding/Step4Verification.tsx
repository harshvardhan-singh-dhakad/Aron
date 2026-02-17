
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export function Step4Verification({ onSubmit, loading }: any) {
    const [email, setEmail] = useState('');
    const [idProof, setIdProof] = useState<string | null>(null);
    const [selfie, setSelfie] = useState<string | null>(null);

    const pickImage = async (setter: any) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
        });
        if (!result.canceled) setter(result.assets[0].uri);
    };

    const handleSubmit = () => {
        if (!email) {
            Alert.alert('Email required', 'Please verify your email.');
            return;
        }
        onSubmit({ email, idProof, selfie });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Trust & Verification</Text>
            <Text style={styles.subHeader}>Help us keep Aron safe.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your@email.com"
                    keyboardType="email-address"
                />
            </View>

            <Text style={styles.label}>Government ID (Optional)</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setIdProof)}>
                {idProof ? <Ionicons name="checkmark-circle" size={40} color="green" /> : <Ionicons name="cloud-upload-outline" size={40} color="#007bff" />}
                <Text style={styles.uploadText}>{idProof ? 'ID Uploaded' : 'Upload ID Proof'}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Selfie Verification (Optional)</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setSelfie)}>
                {selfie ? <Ionicons name="checkmark-circle" size={40} color="green" /> : <Ionicons name="camera-outline" size={40} color="#007bff" />}
                <Text style={styles.uploadText}>{selfie ? 'Selfie Uploaded' : 'Take a Selfie'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Complete Setup</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: 'white', flex: 1 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    subHeader: { fontSize: 16, color: '#666', marginBottom: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
    uploadBox: { borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 20, backgroundColor: '#f9f9f9' },
    uploadText: { marginTop: 10, color: '#666' },
    submitButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 40 },
    submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
