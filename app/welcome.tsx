
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function WelcomePage() {
    const router = useRouter();
    const { setGuestMode } = useAuth();

    const handleGetStarted = () => {
        router.push('/login');
    };

    const handleSkip = () => {
        setGuestMode(true);
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-between p-6">
            <StatusBar style="dark" />

            <View className="items-center mt-10">
                {/* Logo Placeholder */}
                <View className="mb-6 shadow-xl">
                    <Image
                        source={require('../assets/images/icon.png')}
                        style={{ width: 100, height: 100, borderRadius: 20 }}
                        resizeMode="contain"
                    />
                </View>

                <Text className="text-4xl font-extrabold text-gray-900 tracking-tight text-center">ARON</Text>
                <Text className="text-gray-500 text-lg mt-2 font-medium tracking-wide">Everything around you.</Text>
            </View>

            <View className="w-full items-center mb-10">
                {/* Illustration */}
                <Image
                    source={{ uri: 'https://img.freepik.com/free-vector/city-skyline-concept-illustration_114360-8923.jpg' }} // Placeholder illustration
                    style={{ width: width * 0.9, height: 250 }}
                    resizeMode="contain"
                    className="mb-10"
                />

                <TouchableOpacity
                    onPress={handleGetStarted}
                    className="w-full bg-blue-600 py-4 rounded-xl items-center shadow-lg active:scale-95 transition-transform"
                >
                    <Text className="text-white text-lg font-bold">Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSkip}
                    className="mt-5 py-2 px-6"
                >
                    <Text className="text-gray-500 font-medium text-base">Skip for now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
