import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsOfServicePage() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-4 py-3 flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Text className="text-2xl">←</Text>
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">Terms of Service</Text>
            </View>

            <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
                <Text className="text-sm text-gray-500 mb-4">Last updated: February 20, 2026</Text>

                <Text className="text-base font-bold text-gray-800 mb-2">1. Acceptance of Terms</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    By accessing or using the Aron platform ("Platform"), including the mobile application and website, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Platform. These Terms constitute a legally binding agreement between you and Aron.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">2. Eligibility</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    You must be at least 18 years of age and possess the legal authority to enter into these Terms. By registering on the Platform, you represent that you meet these requirements. Users who provide false information about their age or identity will have their accounts terminated.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">3. Account Registration</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• You must register using a valid Indian mobile number</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• You are responsible for maintaining the confidentiality of your account</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Each person may only maintain one active account</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• You must provide accurate and complete information</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">• You are responsible for all activities under your account</Text>

                <Text className="text-base font-bold text-gray-800 mb-2">4. Platform Services</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    Aron is a marketplace that connects users with service providers, businesses, employers, and sellers. We facilitate connections through listings, bookings, and lead generation. Aron does not directly provide any services listed by partners and is not responsible for the quality, safety, or legality of services offered by third-party providers.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">5. User Responsibilities</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Provide truthful and accurate information in listings and profiles</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Not engage in fraudulent, misleading, or deceptive practices</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Not use the Platform for any illegal or unauthorized purpose</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Not harass, abuse, or harm other users</Text>
                <Text className="text-sm text-gray-600 mb-1 leading-5">• Not upload harmful content, malware, or spam</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">• Comply with all applicable local, state, and national laws</Text>

                <Text className="text-base font-bold text-gray-800 mb-2">6. Partner / Service Provider Terms</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    Partners who list services on the Platform must ensure they hold valid licenses and qualifications for the services they offer. Partners are solely responsible for their service quality, pricing, and customer interactions. Aron may charge commission or listing fees as applicable. Partners must respond to leads and bookings in a timely manner.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">7. Payments & Refunds</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    Payments processed through the Platform are subject to our payment terms. Refunds, if applicable, will be processed according to our refund policy. Aron uses secure third-party payment processors and does not store your full payment credentials. Disputes between users and service providers should first be resolved mutually; Aron may mediate but is not obligated to do so.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">8. Identity Verification</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    Users may optionally verify their identity by uploading government-issued documents (Aadhaar Card, PAN Card, Voter ID, or Driving License). Verification helps build trust on the Platform but does not guarantee the character or reliability of any user. Aron reserves the right to reject or revoke verification at its discretion.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">9. Content & Intellectual Property</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    All content on the Platform, including logos, designs, text, and features, is the intellectual property of Aron. Users retain ownership of their uploaded content but grant Aron a non-exclusive, royalty-free license to display, distribute, and use such content for Platform operations. You must not copy, reproduce, or redistribute Platform content without permission.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">10. Limitation of Liability</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    To the fullest extent permitted by law, Aron shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Platform. Aron does not guarantee uninterrupted or error-free service. Our total liability shall not exceed the amount paid by you to Aron in the preceding 12 months.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">11. Account Termination</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    You may delete your account at any time through Settings. Aron reserves the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or harm the Platform community. Upon termination, your right to access the Platform ceases immediately, though certain provisions of these Terms will survive termination.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">12. Modifications to Terms</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    Aron may modify these Terms at any time. We will provide notice of significant changes through the Platform or via notification. Your continued use of the Platform after such modifications constitutes acceptance of the updated Terms.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">13. Governing Law</Text>
                <Text className="text-sm text-gray-600 mb-4 leading-5">
                    These Terms are governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in India.
                </Text>

                <Text className="text-base font-bold text-gray-800 mb-2">14. Contact Us</Text>
                <Text className="text-sm text-gray-600 mb-10 leading-5">
                    For any questions regarding these Terms of Service, please contact us at:{"\n"}
                    Email: support@aron.app{"\n"}
                    Address: India
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
