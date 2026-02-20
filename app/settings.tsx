import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

const THEME_KEY = '@aron_theme_mode';

export default function SettingsPage() {
    const router = useRouter();
    const { logout } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    // Load saved theme preference
    useEffect(() => {
        AsyncStorage.getItem(THEME_KEY).then((val) => {
            if (val === 'dark') setDarkMode(true);
        }).catch(() => { });
    }, []);

    // Toggle dark mode
    const handleThemeToggle = async (val: boolean) => {
        setDarkMode(val);
        try {
            await AsyncStorage.setItem(THEME_KEY, val ? 'dark' : 'light');
            // Apply theme via root class on web
            if (typeof document !== 'undefined') {
                document.documentElement.classList.toggle('dark', val);
                document.body.style.backgroundColor = val ? '#151718' : '#ffffff';
            }
        } catch (err) {
            console.log('Theme save error:', err);
        }
    };

    const bg = darkMode ? 'bg-gray-900' : 'bg-white';
    const textColor = darkMode ? 'text-white' : 'text-gray-800';
    const subText = darkMode ? 'text-gray-400' : 'text-gray-500';
    const borderColor = darkMode ? 'border-gray-700' : 'border-gray-100';
    const iconBg = darkMode ? 'text-gray-300' : 'text-gray-600';

    return (
        <SafeAreaView className={`flex-1 ${bg}`}>
            {/* Header */}
            <View className={`px-4 py-3 flex-row items-center border-b ${borderColor}`}>
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Text className={`text-2xl ${textColor}`}>←</Text>
                </TouchableOpacity>
                <Text className={`text-xl font-bold ${textColor}`}>Settings</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* PREFERENCES */}
                <View className="mb-8">
                    <Text className={`text-sm mb-2 font-medium uppercase ${subText}`}>Preferences</Text>

                    <View className={`flex-row items-center justify-between py-4 border-b ${borderColor}`}>
                        <View className="flex-row items-center gap-3">
                            <Text className="text-xl">🔔</Text>
                            <Text className={`text-base ${textColor}`}>Push Notifications</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#d1d5db', true: '#10b981' }}
                            thumbColor="white"
                        />
                    </View>

                    <View className={`flex-row items-center justify-between py-4 border-b ${borderColor}`}>
                        <View className="flex-row items-center gap-3">
                            <Text className="text-xl">🌙</Text>
                            <Text className={`text-base ${textColor}`}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={handleThemeToggle}
                            trackColor={{ false: '#d1d5db', true: '#10b981' }}
                            thumbColor="white"
                        />
                    </View>
                </View>

                {/* ACCOUNT */}
                <View>
                    <Text className={`text-sm mb-2 font-medium uppercase ${subText}`}>Account</Text>

                    <TouchableOpacity
                        onPress={() => router.push('/privacy-policy' as any)}
                        className={`flex-row items-center justify-between py-4 border-b ${borderColor}`}
                    >
                        <View className="flex-row items-center gap-3">
                            <Text className="text-xl">🔒</Text>
                            <Text className={`text-base ${textColor}`}>Privacy Policy</Text>
                        </View>
                        <Text className="text-gray-400 text-xl">›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/terms' as any)}
                        className={`flex-row items-center justify-between py-4 border-b ${borderColor}`}
                    >
                        <View className="flex-row items-center gap-3">
                            <Text className="text-xl">📄</Text>
                            <Text className={`text-base ${textColor}`}>Terms of Service</Text>
                        </View>
                        <Text className="text-gray-400 text-xl">›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-row items-center justify-between py-4 border-b ${borderColor}`}
                        onPress={() => {
                            Alert.alert(
                                "Delete Account",
                                "Are you sure you want to delete your account? This action cannot be undone.",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    {
                                        text: "Delete", style: "destructive", onPress: () => {
                                            alert("Account deletion request received.");
                                            logout();
                                        }
                                    }
                                ]
                            );
                        }}
                    >
                        <View className="flex-row items-center gap-3">
                            <Text className="text-xl">🗑️</Text>
                            <Text className="text-base text-red-500">Delete Account</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="mt-10 items-center">
                    <Text className={`text-xs ${subText}`}>Version 1.0.2</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
