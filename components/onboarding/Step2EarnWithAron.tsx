
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EARN_OPTIONS = [
    { id: 'sell', label: 'Sell Products', icon: 'cart-outline', desc: 'Manage your store & products' },
    { id: 'rent', label: 'Offer Rentals', icon: 'key-outline', desc: 'Rent out properties or vehicles' },
    { id: 'job', label: 'Find Jobs', icon: 'briefcase-outline', desc: 'Apply for jobs & manage career' },
    { id: 'hire', label: 'Hire Workers', icon: 'people-outline', desc: 'Post jobs & find talent' },
    { id: 'service', label: 'Provide Services', icon: 'construct-outline', desc: 'Offer professional services' },
    { id: 'business', label: 'Business Owner', icon: 'business-outline', desc: 'Manage your business online' },
];

export function Step2EarnWithAron({ onNext, initialData }: any) {
    const [selected, setSelected] = useState<string | null>(initialData?.earnType || null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        onNext({ earnType: selected });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Check into ARON</Text>
            <Text style={styles.subHeader}>How do you want to use ARON?</Text>

            <View style={styles.grid}>
                {EARN_OPTIONS.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[styles.card, selected === option.id && styles.selectedCard]}
                        onPress={() => handleSelect(option.id)}
                    >
                        <Ionicons name={option.icon as any} size={32} color={selected === option.id ? 'white' : '#007bff'} />
                        <Text style={[styles.cardLabel, selected === option.id && styles.selectedText]}>{option.label}</Text>
                        <Text style={[styles.cardDesc, selected === option.id && styles.selectedText]}>{option.desc}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity onPress={handleNext} style={[styles.nextButton, !selected && { backgroundColor: '#ccc' }]} disabled={!selected}>
                <Text style={styles.nextButtonText}>Next Step →</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: 'white', flex: 1 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    subHeader: { fontSize: 16, color: '#666', marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    selectedCard: { backgroundColor: '#007bff', borderColor: '#007bff' },
    cardLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 10, textAlign: 'center', color: '#333' },
    cardDesc: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 5 },
    selectedText: { color: 'white' },
    nextButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 40 },
    nextButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
