
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileView } from '../components/ProfileView';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit phone number.");
      return;
    }
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      Alert.alert("Invalid Code", "Please enter the verification code.");
      return;
    }
    setIsSending(true);
    try {
      // Simulate verification and login anonymously for demo
      await signInAnonymously(auth);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (user) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <ProfileView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-6" edges={['top']}>
      <TouchableOpacity onPress={() => step === 'otp' ? setStep('phone') : null} className="mb-6">
        {step === 'otp' && <Ionicons name="arrow-back" size={24} color="black" />}
      </TouchableOpacity>

      <View className="mb-8">
        <Text className="text-3xl font-bold text-black mb-2">
          {step === 'phone' ? "Log in or sign up" : "Enter code"}
        </Text>
        <Text className="text-gray-500 text-base">
          {step === 'phone'
            ? "Please enter your country code and enter your phone number."
            : `We've sent an SMS with an activation code to your phone +91 ${phoneNumber}`}
        </Text>
      </View>

      {step === 'phone' ? (
        <View>
          <View className="flex-row items-center border border-gray-300 rounded-xl p-3 mb-6">
            <View className="flex-row items-center pr-3 border-r border-gray-200">
              <Text className="text-xl mr-1">🇮🇳</Text>
              <Text className="text-lg font-medium text-black">+91</Text>
              <Ionicons name="chevron-down" size={16} color="gray" style={{ marginLeft: 4 }} />
            </View>
            <TextInput
              className="flex-1 text-lg ml-3 text-black"
              placeholder="98765 43210"
              placeholderTextColor="#9ca3af"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
              autoFocus
            />
          </View>

          <TouchableOpacity
            onPress={handleSendOtp}
            disabled={isSending}
            className={`bg-black p-4 rounded-xl items-center shadow-lg active:scale-[0.98] transition-all ${isSending ? 'opacity-70' : ''}`}
          >
            {isSending ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Continue</Text>}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center my-8">
            <View className="h-[1px] bg-gray-200 flex-1" />
            <Text className="mx-4 text-gray-400 font-medium">or</Text>
            <View className="h-[1px] bg-gray-200 flex-1" />
          </View>

          <View className="flex-row justify-center space-x-6">
            <TouchableOpacity className="border border-gray-200 p-3 rounded-full">
              <Ionicons name="logo-google" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="border border-gray-200 p-3 rounded-full">
              <Ionicons name="logo-apple" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="border border-gray-200 p-3 rounded-full">
              <Ionicons name="logo-facebook" size={24} color="blue" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleGuestLogin} className="mt-8 items-center">
            <Text className="text-gray-400 text-sm underline">Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-6 text-2xl text-center tracking-[10px] font-bold"
            placeholder="0000"
            placeholderTextColor="#e5e7eb"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={4}
            autoFocus
          />

          <View className="flex-row justify-between mb-8">
            <Text className="text-gray-500">Resend code in 00:30</Text>
          </View>

          <TouchableOpacity
            onPress={handleVerifyOtp}
            disabled={isSending}
            className={`bg-black p-4 rounded-xl items-center shadow-lg active:scale-[0.98] transition-all ${isSending ? 'opacity-70' : ''}`}
          >
            {isSending ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Verify</Text>}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}