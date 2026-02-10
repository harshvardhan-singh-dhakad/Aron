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

export default function TermsOfServiceScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: `By accessing or using the Aron app ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.

These Terms apply to all users of the app, including buyers, sellers, job seekers, employers, service providers, and visitors.`,
        },
        {
            title: '2. Eligibility',
            content: `To use Aron, you must:

• Be at least 13 years of age.
• Have a valid Indian phone number for verification.
• Provide accurate and truthful information during registration.
• Not have been previously banned or suspended from using the Service.

By using Aron, you represent and warrant that you meet all eligibility requirements.`,
        },
        {
            title: '3. Account Registration',
            content: `• You must register with a valid phone number and verify it through OTP (One-Time Password).
• You are responsible for maintaining the security of your account and all activities under it.
• You must provide accurate profile information including your name and location.
• You agree to update your information to keep it accurate and current.
• You must not create multiple accounts or share your account with others.`,
        },
        {
            title: '4. User Conduct',
            content: `When using Aron, you agree NOT to:

• Post false, misleading, or fraudulent listings.
• Impersonate another person or misrepresent your identity.
• Harass, threaten, or abuse other users.
• Post spam, duplicate listings, or irrelevant content.
• Use the platform for any illegal activities.
• Collect or harvest other users' personal information.
• Attempt to gain unauthorized access to the app or its systems.
• Post content that is offensive, obscene, or discriminatory.
• Manipulate pricing or engage in unfair business practices.
• Use automated tools, bots, or scripts to access the Service.`,
        },
        {
            title: '5. Listings & Content',
            content: `• All listings must be accurate, honest, and comply with applicable Indian laws.
• You are solely responsible for the content you post, including text, images, and pricing.
• Aron reserves the right to review, edit, or remove any listing that violates these Terms.
• Listings for illegal items, prohibited goods, or restricted services are strictly forbidden.
• Images must be original or you must have the right to use them.
• Prices must be fair and transparent. Hidden charges are not allowed.

Prohibited Items/Services include but are not limited to:
  - Drugs, narcotics, or controlled substances
  - Weapons, firearms, or explosives
  - Stolen goods or counterfeit products
  - Adult content or services
  - Wildlife or endangered species products
  - Financial scams or pyramid schemes`,
        },
        {
            title: '6. Verification System',
            content: `• Aron offers a voluntary verification system where users can verify their identity by submitting government-issued documents (Aadhar, PAN, etc.).
• Verified badges indicate that a user's identity has been confirmed, but do NOT guarantee the quality of their products, services, or business practices.
• Aron is not responsible for the actions of verified users.
• Providing false documents for verification will result in permanent account suspension.`,
        },
        {
            title: '7. Transactions & Payments',
            content: `• Aron is a platform that connects users. We are NOT a party to any transaction between users.
• All financial transactions, negotiations, and agreements are between the buyer and seller (or employer and job seeker).
• Aron does not guarantee the quality, safety, or legality of listed items or services.
• Users are encouraged to verify products/services before making any payment.
• Always meet in safe, public places for in-person transactions.
• Aron is not responsible for any financial loss resulting from user-to-user transactions.`,
        },
        {
            title: '8. Intellectual Property',
            content: `• The Aron app, its logo, design, and features are the intellectual property of Aron.
• You may not copy, modify, distribute, or create derivative works from any part of the app without our explicit written permission.
• By posting content on Aron, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content within the platform.
• You retain ownership of your original content but allow Aron to use it for platform operations.`,
        },
        {
            title: '9. Limitation of Liability',
            content: `• Aron is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind.
• We do not guarantee uninterrupted or error-free service.
• Aron is NOT liable for:
  - Any damages arising from user-to-user transactions
  - Loss of data or unauthorized access to your account
  - Any indirect, incidental, or consequential damages
  - Quality of products, services, or jobs listed on the platform
  - Actions or conduct of other users
• Our total liability shall not exceed the amount you have paid to Aron (if any) in the past 12 months.`,
        },
        {
            title: '10. Termination',
            content: `• You may delete your account at any time by contacting our support team.
• Aron reserves the right to suspend or terminate your account at any time if:
  - You violate these Terms of Service
  - You engage in fraudulent or harmful activities
  - Your account poses a security risk
  - Required by law or regulation
• Upon termination, your listings will be removed, but some data may be retained as required by law.`,
        },
        {
            title: '11. Dispute Resolution',
            content: `• Any disputes between users should be resolved directly between the parties involved.
• If you have a dispute with Aron, you agree to first attempt to resolve it informally by contacting our support team.
• All disputes shall be governed by the laws of India and subject to the jurisdiction of courts in India.
• Users agree to attempt mediation before pursuing legal action.`,
        },
        {
            title: '12. Modifications to Terms',
            content: `• Aron reserves the right to modify these Terms at any time.
• Changes will be effective immediately upon posting in the app.
• We will notify users of significant changes through in-app notifications.
• Your continued use of the Service after changes constitutes acceptance of the modified Terms.
• If you disagree with any changes, you should discontinue use of the Service.`,
        },
        {
            title: '13. Governing Law',
            content: `These Terms of Service shall be governed by and construed in accordance with the laws of India, including but not limited to:

• Information Technology Act, 2000
• Consumer Protection Act, 2019
• Indian Contract Act, 1872

Any legal proceedings shall be subject to the exclusive jurisdiction of courts in India.`,
        },
        {
            title: '14. Contact Us',
            content: `If you have any questions about these Terms of Service, please contact us:

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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Terms of Service</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={[styles.heroSection, { backgroundColor: colors.accent }]}>
                    <Text style={styles.heroTitle}>Terms of Service</Text>
                    <Text style={styles.heroSubtitle}>
                        Please read these terms carefully before using Aron. By using our app, you agree to these terms and conditions.
                    </Text>
                    <Text style={styles.lastUpdated}>Last Updated: February 10, 2026</Text>
                </View>

                {/* Introduction */}
                <View style={[styles.introCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.introText, { color: colors.textSecondary }]}>
                        Welcome to Aron! These Terms of Service ("Terms") govern your use of the Aron mobile
                        application and web platform, operated by Aron. Aron is a local classifieds and
                        community platform that connects people for jobs, services, buying & selling,
                        rentals, and local businesses. Please read these Terms carefully before using our Service.
                    </Text>
                </View>

                {/* Sections */}
                {sections.map((section, index) => (
                    <View
                        key={index}
                        style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.accent }]}>
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
