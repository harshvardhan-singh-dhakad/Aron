import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    ScrollView,
    Keyboard,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { sendOTP, verifyOTP, initRecaptcha } from '@/lib/services/auth';
import { useAuth } from '@/contexts/AuthContext';

type Step = 'phone' | 'otp';

export default function LoginScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const { setUserProfile } = useAuth();

    const [step, setStep] = useState<Step>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const otpInputs = useRef<TextInput[]>([]);

    // Initialize reCAPTCHA on mount (for web only)
    useEffect(() => {
        // Only run on web platform
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
            // Add invisible recaptcha container
            const container = document.getElementById('recaptcha-container');
            if (!container) {
                const div = document.createElement('div');
                div.id = 'recaptcha-container';
                document.body.appendChild(div);
            }
        }
    }, []);

    const handleSendOtp = async () => {
        if (phoneNumber.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Initialize recaptcha for web only
            if (Platform.OS === 'web') {
                initRecaptcha('recaptcha-container');
            }

            await sendOTP(phoneNumber);
            setStep('otp');
        } catch (err: any) {
            console.error('OTP Error:', err);
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const profile = await verifyOTP(otpString);

            if (profile) {
                setUserProfile(profile);

                // Check if profile is complete
                if (!profile.profileCompleted) {
                    router.replace('/complete-profile');
                } else {
                    router.replace('/(tabs)');
                }
            }
        } catch (err: any) {
            console.error('Verify Error:', err);
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    {/* Header */}
                    {step === 'otp' && (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {
                                setStep('phone');
                                setOtp(['', '', '', '', '', '']);
                                setError('');
                            }}
                        >
                            <ArrowLeft size={24} color={colors.text} />
                        </TouchableOpacity>
                    )}

                    {/* Logo */}
                    <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
                        <Text style={styles.logoText}>A</Text>
                    </View>
                    <Text style={[styles.appName, { color: colors.primary }]}>Aron</Text>

                    {/* Title */}
                    <Text style={[styles.title, { color: colors.text }]}>
                        {step === 'phone' ? 'Welcome' : 'Verify OTP'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {step === 'phone'
                            ? 'Enter your mobile number to get started'
                            : `Enter the 6-digit code sent to +91 ${phoneNumber}`}
                    </Text>

                    {/* Error Message */}
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Form */}
                    {step === 'phone' ? (
                        <View style={styles.form}>
                            <View style={[styles.phoneInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <View style={[styles.countryCode, { borderRightColor: colors.border }]}>
                                    <Text style={[styles.countryCodeText, { color: colors.text }]}>+91</Text>
                                </View>
                                <TextInput
                                    style={[styles.phoneInput, { color: colors.text }]}
                                    placeholder="9876543210"
                                    placeholderTextColor={colors.textSecondary}
                                    value={phoneNumber}
                                    onChangeText={(text) => {
                                        setPhoneNumber(text.replace(/[^0-9]/g, ''));
                                        setError('');
                                    }}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    autoFocus
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.primary }]}
                                onPress={handleSendOtp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.buttonText}>Continue</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.form}>
                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => { if (ref) otpInputs.current[index] = ref; }}
                                        style={[
                                            styles.otpInput,
                                            {
                                                backgroundColor: colors.card,
                                                borderColor: digit ? colors.primary : colors.border,
                                                color: colors.text
                                            }
                                        ]}
                                        value={digit}
                                        onChangeText={(value) => handleOtpChange(value.replace(/[^0-9]/g, ''), index)}
                                        onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.primary }]}
                                onPress={handleVerifyOtp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.buttonText}>Verify & Login</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.resendButton} onPress={handleSendOtp} disabled={loading}>
                                <Text style={[styles.resendText, { color: colors.primary }]}>Resend OTP</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Footer - inside content view */}
                    <View style={styles.footerContainer}>
                        <Text style={[styles.footer, { color: colors.textSecondary }]}>
                            By continuing, you agree to our{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/terms-of-service')}>
                            <Text style={[styles.footerLink, { color: colors.primary }]}>
                                Terms of Service
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.footer, { color: colors.textSecondary }]}> and </Text>
                        <TouchableOpacity onPress={() => router.push('/privacy-policy')}>
                            <Text style={[styles.footerLink, { color: colors.primary }]}>
                                Privacy Policy
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hidden recaptcha container for web */}
                <View nativeID="recaptcha-container" style={styles.recaptchaContainer} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        padding: 8,
    },
    logoContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFF',
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        width: '100%',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 24,
    },
    countryCode: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRightWidth: 1,
    },
    countryCodeText: {
        fontSize: 16,
        fontWeight: '600',
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 18,
        letterSpacing: 1,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    otpInput: {
        width: 48,
        height: 56,
        borderRadius: 12,
        borderWidth: 2,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendButton: {
        marginTop: 24,
        alignItems: 'center',
    },
    resendText: {
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        fontSize: 12,
        textAlign: 'center',
    },
    footerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingBottom: 32,
    },
    footerLink: {
        fontSize: 12,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    recaptchaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        opacity: 0,
    },
});
