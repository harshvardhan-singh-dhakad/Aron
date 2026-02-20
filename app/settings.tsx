import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [theme, setTheme] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 py-3 flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">Settings</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                <View className="mb-8">
                    <Text className="text-gray-500 text-sm mb-2 font-medium uppercase">Preferences</Text>

                    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
                        <View className="flex-row items-center gap-3">
                            <Ionicons name="notifications-outline" size={22} color="#4b5563" />
                            <Text className="text-base text-gray-800">Push Notifications</Text>
                        </View>
                        <Switch value={notifications} onValueChange={setNotifications} />
                    </View>

                    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
                        <View className="flex-row items-center gap-3">
                            <Ionicons name="moon-outline" size={22} color="#4b5563" />
                            <Text className="text-base text-gray-800">Dark Mode</Text>
                        </View>
                        <Switch value={theme} onValueChange={setTheme} />
                    </View>
                </View>

                <View>
                    <Text className="text-gray-500 text-sm mb-2 font-medium uppercase">Account</Text>

                    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
                        <View className="flex-row items-center gap-3">
                            <Ionicons name="lock-closed-outline" size={22} color="#4b5563" />
                            <Text className="text-base text-gray-800">Privacy Policy</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
                        <View className="flex-row items-center gap-3">
                            <Ionicons name="document-text-outline" size={22} color="#4b5563" />
                            <Text className="text-base text-gray-800">Terms of Service</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center justify-between py-4 border-b border-gray-100"
                        onPress={() => {
                            Alert.alert(
                                "Delete Account",
                                "Are you sure you want to delete your account? This action cannot be undone.",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    { text: "Delete", style: "destructive", onPress: () => console.log("Delete account") }
                                ]
                            );
                        }}
                    >
                        <View className="flex-row items-center gap-3">
                            <Ionicons name="trash-outline" size={22} color="#ef4444" />
                            <Text className="text-base text-red-500">Delete Account</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="mt-10 items-center">
                    <Text className="text-gray-400 text-xs">Version 1.0.2</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
