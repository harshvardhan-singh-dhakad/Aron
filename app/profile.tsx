import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileView } from '../components/ProfileView';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('9999999999');
  const [verificationId, setVerificationId] = useState('');
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Initialize Recaptcha on mount or when returning to phone step
  useEffect(() => {
    if (step === 'phone' && typeof window !== 'undefined') {
      try {
        if (!(window as any).recaptchaVerifier) {
          // Use 'recaptcha-container' div ID specifically
          (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA solved
            },
            'expired-callback': () => {
              // Expired logic
            }
          });
        }
      } catch (err) {
        console.error("Recaptcha Init Error", err);
      }
    }
  }, [step]);

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSending(true);
    try {
      const formattedPhoneNumber = `+91${phoneNumber}`;

      // Ensure verifier exists
      if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
        });
      }

      const appVerifier = (window as any).recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setStep('otp');
      (window as any).confirmationResult = confirmationResult;

    } catch (error: any) {
      console.error("SMS Error:", error);

      let errorMessage = error.message;
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'The phone number is invalid.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'Recaptcha check failed. Please refresh and try again.';
      }

      Alert.alert("Login Failed", errorMessage);

      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) { }
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit verification code.");
      return;
    }
    setIsSending(true);
    try {
      if ((window as any).confirmationResult) {
        await (window as any).confirmationResult.confirm(otp);
      } else {
        const credential = PhoneAuthProvider.credential(verificationId, otp);
        await signInWithCredential(auth, credential);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Invalid verification code.");
    } finally {
      setIsSending(false);
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
          {step === 'phone' ? "Log in with Mobile" : "Enter Verification Code"}
        </Text>
        <Text className="text-gray-500 text-base">
          {step === 'phone'
            ? "Please enter your mobile number to receive an OTP."
            : `Enter the 6-digit code sent to +91 ${phoneNumber}`}
        </Text>
      </View>

      {step === 'phone' ? (
        <View>
          <View className="flex-row items-center border border-gray-300 rounded-xl p-3 mb-6">
            <View className="flex-row items-center pr-3 border-r border-gray-200">
              <Text className="text-xl mr-1">🇮🇳</Text>
              <Text className="text-lg font-medium text-black">+91</Text>
            </View>
            <TextInput
              className="flex-1 text-lg ml-3 text-black"
              placeholder="Mobile Number"
              placeholderTextColor="#9ca3af"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
              autoFocus
            />
          </View>

          <div id="recaptcha-container"></div>

          <TouchableOpacity
            id="send-otp-button"
            onPress={handleSendOtp}
            disabled={isSending}
            className={`bg-blue-600 p-4 rounded-xl items-center shadow-lg active:scale-[0.98] transition-all ${isSending ? 'opacity-70' : ''}`}
          >
            {isSending ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Send OTP</Text>}
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput
            className="border border-gray-300 rounded-xl p-4 mb-6 text-2xl text-center tracking-[10px] font-bold"
            placeholder="000000"
            placeholderTextColor="#e5e7eb"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          <View className="flex-row justify-between mb-8">
            <Text className="text-gray-500">Resend code in 00:30</Text>
          </View>

          <TouchableOpacity
            onPress={handleVerifyOtp}
            disabled={isSending}
            className={`bg-blue-600 p-4 rounded-xl items-center shadow-lg active:scale-[0.98] transition-all ${isSending ? 'opacity-70' : ''}`}
          >
            {isSending ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Verify & Login</Text>}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}