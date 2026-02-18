
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
        <ScrollView className="flex-1 bg-white p-6" contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="mb-8">
                <Text className="text-2xl font-bold text-black mb-2">Check into ARON</Text>
                <Text className="text-gray-500 text-base">How do you want to use ARON?</Text>
            </View>

            <View className="flex-row flex-wrap justify-between">
                {EARN_OPTIONS.map((option) => {
                    const isSelected = selected === option.id;
                    return (
                        <TouchableOpacity
                            key={option.id}
                            className={`w-[48%] bg-white rounded-xl p-4 mb-4 border items-center shadow-sm active:scale-[0.98] transition-all ${isSelected ? 'bg-black border-black' : 'bg-white border-gray-200'
                                }`}
                            onPress={() => handleSelect(option.id)}
                        >
                            <View className={`p-3 rounded-full mb-3 ${isSelected ? 'bg-gray-800' : 'bg-blue-50'}`}>
                                <Ionicons
                                    name={option.icon as any}
                                    size={28}
                                    color={isSelected ? 'white' : '#000'}
                                />
                            </View>
                            <Text className={`text-base font-bold text-center mb-1 ${isSelected ? 'text-white' : 'text-black'}`}>
                                {option.label}
                            </Text>
                            <Text className={`text-xs text-center ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                                {option.desc}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity
                onPress={handleNext}
                className={`p-4 rounded-xl items-center shadow-lg active:scale-[0.98] transition-all mt-6 ${!selected ? 'bg-gray-300' : 'bg-black'}`}
                disabled={!selected}
            >
                <Text className="text-white font-bold text-lg">Next Step</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
