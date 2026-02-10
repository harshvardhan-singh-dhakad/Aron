import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    useColorScheme,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const sections = [
        {
            title: '1. Information We Collect',
            content: `When you use Aron, we collect the following types of information:

• Personal Information: Phone number, name, location, and profile details you provide during registration.
• Listing Data: Information you include in your listings such as titles, descriptions, images, prices, and category details.
• Device Information: Device type, operating system, unique device identifiers, and mobile network information.
• Usage Data: How you interact with our app, including pages visited, features used, and time spent on the app.
• Location Data: With your permission, we may collect your approximate location to show relevant local listings.`,
        },
        {
            title: '2. How We Use Your Information',
            content: `We use the collected information for the following purposes:

• To provide and maintain our services, including listing creation and discovery.
• To verify your identity through phone number verification (OTP).
• To connect buyers and sellers, job seekers and employers, and service providers with customers.
• To personalize your experience and show relevant listings based on your location.
• To send you notifications about your listings, applications, and important updates.
• To improve our app, detect bugs, and enhance user experience.
• To prevent fraud, abuse, and ensure the safety of our community.`,
        },
        {
            title: '3. Information Sharing',
            content: `We may share your information in the following circumstances:

• With Other Users: Your name, phone number, and listing details are visible to other users when you post a listing or apply for one.
• Service Providers: We may share data with third-party services (like Firebase) that help us operate our app.
• Legal Requirements: We may disclose information if required by law, regulation, or legal process.
• Business Transfers: In case of a merger, acquisition, or sale of assets, your data may be transferred.

We do NOT sell your personal information to third parties for advertising purposes.`,
        },
        {
            title: '4. Data Security',
            content: `We take reasonable measures to protect your personal information:

• All data transmission is encrypted using industry-standard SSL/TLS protocols.
• User authentication is handled through Firebase Authentication with OTP verification.
• We regularly review our data collection, storage, and processing practices.
• Access to personal information is restricted to authorized personnel only.

However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.`,
        },
        {
            title: '5. Data Retention',
            content: `We retain your personal information for as long as your account is active or as needed to provide you services. If you wish to delete your account, please contact us, and we will remove your data within 30 days, except where retention is required by law.`,
        },
        {
            title: '6. Your Rights',
            content: `You have the following rights regarding your personal data:

• Access: You can request a copy of the personal data we hold about you.
• Correction: You can update or correct your profile information at any time through the app.
• Deletion: You can request deletion of your account and associated data.
• Opt-out: You can opt out of receiving promotional notifications.
• Data Portability: You can request your data in a commonly used, machine-readable format.`,
        },
        {
            title: '7. Children\'s Privacy',
            content: `Aron is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.`,
        },
        {
            title: '8. Third-Party Services',
            content: `Our app uses the following third-party services:

• Firebase (Google): For authentication, database, storage, and hosting.
• Expo: For app development and distribution.

Each of these services has their own privacy policies, and we encourage you to review them.`,
        },
        {
            title: '9. Changes to This Policy',
            content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy in the app and updating the "Last Updated" date. Your continued use of the app after changes are posted constitutes your acceptance of the revised policy.`,
        },
        {
            title: '10. Contact Us',
            content: `If you have any questions or concerns about this Privacy Policy, please contact us:

• App: Aron
• Email: support@aron.app
• Location: India`,
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
                    <Text style={styles.heroTitle}>Privacy Policy</Text>
                    <Text style={styles.heroSubtitle}>
                        Your privacy is important to us. This policy explains how Aron collects, uses, and protects your information.
                    </Text>
                    <Text style={styles.lastUpdated}>Last Updated: February 10, 2026</Text>
                </View>

                {/* Introduction */}
                <View style={[styles.introCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.introText, { color: colors.textSecondary }]}>
                        Aron ("we", "our", or "us") operates the Aron mobile application and web platform.
                        This Privacy Policy informs you of our policies regarding the collection, use, and
                        disclosure of personal data when you use our Service and the choices you have associated
                        with that data. By using Aron, you agree to the collection and use of information in
                        accordance with this policy.
                    </Text>
                </View>

                {/* Sections */}
                {sections.map((section, index) => (
                    <View
                        key={index}
                        style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                            {section.title}
                        </Text>
                        <Text style={[styles.sectionContent, { color: colors.text }]}>
                            {section.content}
                        </Text>
                    </View>
                ))}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        © 2026 Aron. All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'web' ? 16 : 56,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroSection: {
        padding: 32,
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    heroSubtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 500,
    },
    lastUpdated: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.65)',
        marginTop: 16,
        fontStyle: 'italic',
    },
    introCard: {
        margin: 16,
        marginTop: -20,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    introText: {
        fontSize: 14,
        lineHeight: 22,
    },
    sectionCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    sectionContent: {
        fontSize: 14,
        lineHeight: 22,
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
    },
});
