import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyPage() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-4 py-3 flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Text className="text-2xl">←</Text>
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">Privacy Policy</Text>
            </View>

            <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
                <Text className="text-sm text-gray-500 mb-4">Last updated: February 20, 2026</Text>

                <Text className="text-base font-bold text-gray-800 mb-2">1. Introduction</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    Welcome to Aron ("we," "us," or "our"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the Aron mobile application and website (the "Platform"). Please read this policy carefully.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">2. Information We Collect</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5 font-semibold">Personal Information:</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Full name, phone number, and email address</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• City, state, and location data (with your consent)</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Profile photo and profession details</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Identity documents (Aadhaar, PAN, Voter ID, Driving License) for verification</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">• Payment and billing information</Text>

                <Text className="text-sm text-gray-600 mb-1 leading-5 font-semibold">Usage Information:</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Device type, operating system, and browser</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• IP address and approximate location</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• App usage patterns and interaction data</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">• Crash logs and performance data</Text>

                <Text className="text-base font-bold text-gray-800 mb-2">3. How We Use Your Information</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• To create and manage your account</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• To connect you with service providers and businesses</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• To verify your identity and ensure platform safety</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• To process bookings, payments, and transactions</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• To send you notifications about your activity</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• To improve our services and user experience</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">• To comply with legal obligations</Text>

                <Text className="text-base font-bold text-gray-800 mb-2">4. Data Sharing & Disclosure</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    We do not sell your personal data. We may share your information with: service providers who assist in delivering our services, partners for completing bookings or transactions, law enforcement when required by law, and other users only as necessary to facilitate your requested services (e.g., your name and phone number with a booked service provider).
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">5. Data Security</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    We implement industry-standard security measures including encryption, secure servers, and access controls to protect your data. Identity documents are stored securely in Firebase Storage with restricted access. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">6. Data Retention</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    We retain your personal data for as long as your account is active or as needed to provide services. Verification documents are retained until verification is complete and then securely deleted. You may request deletion of your account and data at any time through the Settings page.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">7. Your Rights</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Access and review your personal data</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Update or correct inaccurate information</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Delete your account and associated data</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Opt out of marketing communications</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">• Withdraw consent for location or notification access</Text>

                <Text className="text-base font-bold text-gray-800 mb-2">8. Third-Party Services</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    Our Platform uses third-party services including Firebase (Google) for authentication, data storage, and hosting; Nominatim (OpenStreetMap) for location services; and payment gateways for transactions. These services have their own privacy policies, and we encourage you to review them.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">9. Children's Privacy</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    Our Platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If we learn that we have collected data from a child under 18, we will promptly delete it.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">10. Changes to This Policy</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or via email. Continued use of the Platform after changes constitutes acceptance of the updated policy.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">11. Contact Us</Text>
                <Text className="text-sm text-gray-600 mb-10 leading-5">
                    If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us at:{"\n"}
                    Email: support@aron.app{"\n"}
                    Address: India
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
