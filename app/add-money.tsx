import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function AddMoneyPage() {
    const router = useRouter();
    const [amount, setAmount] = useState('');

    const handleAddMoney = () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert("Invalid Amount", "Please enter a valid amount.");
            return;
        }
        // Mock payment integration
        Alert.alert("Success", `₹${amount} added to your wallet!`, [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 py-3 flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">Add Money</Text>
            </View>

            <View className="p-6">
                <Text className="text-gray-500 mb-2 font-medium">Enter Amount</Text>
                <View className="flex-row items-center border-b-2 border-blue-600 pb-2 mb-8">
                    <Text className="text-3xl font-bold text-gray-900 mr-2">₹</Text>
                    <TextInput
                        className="flex-1 text-4xl font-bold text-gray-900"
                        placeholder="0"
                        keyboardType="number-pad"
                        value={amount}
                        onChangeText={setAmount}
                        autoFocus
                    />
                </View>

                <View className="flex-row gap-3 mb-8">
                    {['100', '500', '1000', '2000'].map((amt) => (
                        <TouchableOpacity
                            key={amt}
                            onPress={() => setAmount(amt)}
                            className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200"
                        >
                            <Text className="font-semibold text-gray-700">+ ₹{amt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={handleAddMoney}
                    className="bg-blue-600 py-4 rounded-xl items-center shadow-lg active:scale-[0.98]"
                >
                    <Text className="text-white font-bold text-lg">Proceed to Pay</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
