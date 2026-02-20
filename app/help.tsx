import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HelpPage() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 py-3 flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">Help & Support</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                <Text className="text-2xl font-bold text-gray-900 mb-2">How can we help you?</Text>
                <Text className="text-gray-500 mb-6">Find answers to commonly asked questions or contact us directly.</Text>

                <View className="space-y-4 mb-8">
                    <TouchableOpacity className="bg-gray-50 p-4 rounded-xl flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                                <Ionicons name="chatbubbles-outline" size={20} color="#2563eb" />
                            </View>
                            <View>
                                <Text className="font-semibold text-gray-900">Chat with Support</Text>
                                <Text className="text-xs text-gray-500">Typical reply in few minutes</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-gray-50 p-4 rounded-xl flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                                <Ionicons name="mail-outline" size={20} color="#16a34a" />
                            </View>
                            <View>
                                <Text className="font-semibold text-gray-900">Email Us</Text>
                                <Text className="text-xs text-gray-500">Get response via email</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                <Text className="font-bold text-gray-900 mb-4 text-lg">FAQ</Text>
                {['How to verify my profile?', 'How to add money to wallet?', 'How to change my service location?', 'What is Partner Mode?'].map((q, i) => (
                    <TouchableOpacity key={i} className="py-4 border-b border-gray-100 flex-row justify-between items-center">
                        <Text className="text-gray-700 font-medium">{q}</Text>
                        <Ionicons name="chevron-down" size={18} color="#9ca3af" />
                    </TouchableOpacity>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}
