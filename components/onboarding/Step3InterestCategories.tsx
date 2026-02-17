
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export function Step3InterestCategories({ onNext, initialData, earnType }: any) {
    const [formData, setFormData] = useState<any>(initialData?.categoryData || {});

    const handleChange = (key: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const renderForm = () => {
        switch (earnType) {
            case 'sell':
                return (
                    <>
                        <Text style={styles.label}>Shop Name</Text>
                        <TextInput style={styles.input} onChangeText={(t) => handleChange('shopName', t)} value={formData.shopName} />
                        <Text style={styles.label}>Product Category</Text>
                        <TextInput style={styles.input} onChangeText={(t) => handleChange('category', t)} value={formData.category} />
                    </>
                );
            case 'rent':
                return (
                    <>
                        <Text style={styles.label}>What do you rent?</Text>
                        <TextInput style={styles.input} placeholder="e.g. Apartments, Cars" onChangeText={(t) => handleChange('rentType', t)} value={formData.rentType} />
                    </>
                );
            case 'job':
                return (
                    <>
                        <Text style={styles.label}>Position</Text>
                        <TextInput style={styles.input} placeholder="e.g. Developer, Designer" onChangeText={(t) => handleChange('position', t)} value={formData.position} />
                        <Text style={styles.label}>Experience (Years)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={(t) => handleChange('experience', t)} value={formData.experience} />
                    </>
                );
            case 'hire':
                return (
                    <>
                        <Text style={styles.label}>Company Name</Text>
                        <TextInput style={styles.input} onChangeText={(t) => handleChange('companyName', t)} value={formData.companyName} />
                        <Text style={styles.label}>Hiring For</Text>
                        <TextInput style={styles.input} placeholder="e.g. Sales, Tech" onChangeText={(t) => handleChange('hiringField', t)} value={formData.hiringField} />
                    </>
                );
            case 'service':
                return (
                    <>
                        <Text style={styles.label}>Service Type</Text>
                        <TextInput style={styles.input} placeholder="e.g. Plumbing, Cleaning" onChangeText={(t) => handleChange('serviceType', t)} value={formData.serviceType} />
                        <Text style={styles.label}>Years of Experience</Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={(t) => handleChange('experience', t)} value={formData.experience} />
                    </>
                );
            case 'business':
                return (
                    <>
                        <Text style={styles.label}>Business Name</Text>
                        <TextInput style={styles.input} onChangeText={(t) => handleChange('businessName', t)} value={formData.businessName} />
                        <Text style={styles.label}>Business Type</Text>
                        <TextInput style={styles.input} onChangeText={(t) => handleChange('businessType', t)} value={formData.businessType} />
                    </>
                );
            default:
                return <Text>Select category first</Text>;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Tell us more</Text>
            <Text style={styles.subHeader}>Complete your profile for {earnType}</Text>

            {renderForm()}

            <TouchableOpacity onPress={() => onNext({ categoryData: formData })} style={styles.nextButton}>
                <Text style={styles.nextButtonText}>Next Step →</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: 'white', flex: 1 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    subHeader: { fontSize: 16, color: '#666', marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 15 },
    nextButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 40 },
    nextButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
