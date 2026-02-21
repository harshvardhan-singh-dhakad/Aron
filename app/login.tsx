
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
    const router = useRouter();
    const { redirect } = useLocalSearchParams<{ redirect: string }>();

    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [otp, setOtp] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [timer, setTimer] = useState(30);

    // Initialize Recaptcha (Handled in handleSendOtp now)
    useEffect(() => {
        // Any other phone-mount side effects can go here
    }, [step]);

    // OTP Timer
    useEffect(() => {
        let interval: any;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOtp = async () => {
        const cleanedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digit chars
        if (cleanedPhone.length < 10) {
            Alert.alert("Invalid Number", "Please enter a valid 10-digit phone number.");
            return;
        }

        setIsSending(true);
        try {
            const formattedPhoneNumber = `+91${cleanedPhone.slice(-10)}`;
            console.log("Attempting to send OTP to:", formattedPhoneNumber);

            let appVerifier: any;

            if (Platform.OS === 'web') {
                // Ensure a clean recaptcha container
                const container = document.getElementById('recaptcha-container');
                if (!container) {
                    throw new Error("Recaptcha container not found in DOM");
                }

                if (!(window as any).recaptchaVerifier) {
                    console.log("Initializing RecaptchaVerifier...");
                    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        'size': 'invisible',
                        'callback': (response: any) => {
                            console.log("Recaptcha solved");
                        },
                        'expired-callback': () => {
                            console.log("Recaptcha expired");
                        }
                    });
                }
                appVerifier = (window as any).recaptchaVerifier;
            }

            console.log("Calling signInWithPhoneNumber...");
            const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
            console.log("OTP sent successfully!");

            setVerificationId(confirmationResult.verificationId);
            setStep('otp');
            setTimer(30);
            if (Platform.OS === 'web') (window as any).confirmationResult = confirmationResult;

        } catch (error: any) {
            console.error("SMS Error Detail:", error);
            let errorMessage = error.message;
            if (error.code === 'auth/invalid-phone-number') errorMessage = 'The phone number is invalid.';
            else if (error.code === 'auth/too-many-requests') errorMessage = 'Too many requests. Please try again later.';
            else if (error.code === 'auth/quota-exceeded') errorMessage = 'SMS quota exceeded.';
            else if (error.code === 'auth/captcha-check-failed') errorMessage = 'reCAPTCHA check failed. Please refresh and try again.';

            Alert.alert("Login Failed", `${errorMessage} (${error.code || 'unknown'})`);

            if (Platform.OS === 'web' && (window as any).recaptchaVerifier) {
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
            let result;
            if (Platform.OS === 'web' && (window as any).confirmationResult) {
                result = await (window as any).confirmationResult.confirm(otp);
            } else {
                const credential = PhoneAuthProvider.credential(verificationId, otp);
                result = await signInWithCredential(auth, credential);
            }

            // Success! Check if profile exists
            if (result.user) {
                const userDoc = await getDoc(doc(db, 'users', result.user.uid));
                if (userDoc.exists() && userDoc.data().onboardingCompleted) {
                    // Existing User -> Go to redirect or home
                    if (redirect) router.replace(redirect as any);
                    else router.replace('/');
                } else {
                    // New User or Incomplete -> Go to Profile Setup
                    router.replace({ pathname: '/complete-profile', params: { redirect } });
                }
            }

        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", "Invalid verification code.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-6 justify-center">
            <TouchableOpacity onPress={() => step === 'otp' ? setStep('phone') : router.back()} className="absolute top-12 left-6 z-10">
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <View className="mb-8 mt-10">
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
                    <View className="flex-row items-center border border-gray-300 rounded-xl p-3 mb-6 bg-gray-50">
                        <View className="flex-row items-center pr-3 border-r border-gray-200">
                            <Text className="text-xl mr-1">🇮🇳</Text>
                            <Text className="text-lg font-medium text-black">+91</Text>
                        </View>
                        <TextInput
                            className="flex-1 text-lg ml-3 text-black font-semibold"
                            placeholder="Mobile Number"
                            placeholderTextColor="#9ca3af"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            maxLength={10}
                            autoFocus
                        />
                    </View>

                    {Platform.OS === 'web' && <div id="recaptcha-container"></div>}

                    <TouchableOpacity
                        onPress={handleSendOtp}
                        disabled={isSending}
                        className={`bg-blue-600 p-4 rounded-xl items-center shadow-lg active:scale-[0.98] transition-all ${isSending ? 'opacity-70' : ''}`}
                    >
                        {isSending ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Continue</Text>}
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <TextInput
                        className="border border-gray-300 rounded-xl p-4 mb-6 text-3xl text-center tracking-[10px] font-bold bg-gray-50"
                        placeholder="000000"
                        placeholderTextColor="#e5e7eb"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus
                    />

                    <View className="flex-row justify-between mb-8 items-center">
                        <Text className="text-gray-500">Didn't receive code?</Text>
                        {timer > 0 ? (
                            <Text className="text-gray-400 font-medium">Resend in 00:{timer < 10 ? `0${timer}` : timer}</Text>
                        ) : (
                            <TouchableOpacity onPress={handleSendOtp}>
                                <Text className="text-blue-600 font-bold">Resend OTP</Text>
                            </TouchableOpacity>
                        )}
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
