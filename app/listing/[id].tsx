import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Dimensions,
    Share,
    Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import {
    MapPin,
    BadgeCheck,
    Phone,
    Share2,
    ChevronLeft,
    Calendar,
    IndianRupee,
    Clock
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock listing data
const mockListing = {
    id: '1',
    title: 'Office Assistant Needed',
    description: 'We are looking for a dedicated office assistant to help with daily administrative tasks. The ideal candidate should be punctual, organized, and have good communication skills. Basic computer knowledge is required.\n\nResponsibilities:\n- Managing phone calls and correspondence\n- Organizing files and documents\n- Assisting with data entry\n- General office maintenance',
    category: 'jobs',
    subCategory: 'Office Assistant',
    salary: 15000,
    salaryType: 'monthly',
    location: 'Jaipur, Rajasthan',
    images: [],
    ownerName: 'Rajesh Kumar',
    ownerPhone: '+91 9876543210',
    ownerVerified: true,
    createdAt: new Date(),
};

export default function ListingDetailScreen() {
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const { user, userProfile } = useAuth();

    const listing = mockListing; // In real app, fetch from Firestore

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this listing on Aron: ${listing.title}\n\nhttps://aron.app/listing/${id}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleCall = () => {
        Linking.openURL(`tel:${listing.ownerPhone}`);
    };

    const handleApply = () => {
        if (!user) {
            router.push('/(auth)/login');
            return;
        }
        if (userProfile?.verificationStatus !== 'approved') {
            router.push('/profile');
            return;
        }
        // In real app, create application in Firestore
        alert('Application submitted successfully!');
    };

    const formatPrice = () => {
        if (listing.category === 'jobs') {
            return `₹${listing.salary?.toLocaleString()}/${listing.salaryType}`;
        }
        return `₹${listing.salary?.toLocaleString()}`;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel Placeholder */}
                <View style={[styles.imageContainer, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.imagePlaceholder, { color: colors.textSecondary }]}>
                        No images available
                    </Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Title & Price */}
                    <View style={styles.titleSection}>
                        <Text style={[styles.title, { color: colors.text }]}>{listing.title}</Text>
                        <Text style={[styles.price, { color: colors.primary }]}>{formatPrice()}</Text>
                    </View>

                    {/* Category & Location */}
                    <View style={styles.metaRow}>
                        <View style={[styles.categoryBadge, { backgroundColor: `${colors.primary}20` }]}>
                            <Text style={[styles.categoryText, { color: colors.primary }]}>
                                {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)} • {listing.subCategory}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <MapPin size={16} color={colors.textSecondary} />
                        <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                            {listing.location}
                        </Text>
                    </View>

                    <View style={styles.dateRow}>
                        <Calendar size={16} color={colors.textSecondary} />
                        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                            Posted {listing.createdAt.toLocaleDateString()}
                        </Text>
                    </View>

                    {/* Divider */}
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                        <Text style={[styles.description, { color: colors.text }]}>
                            {listing.description}
                        </Text>
                    </View>

                    {/* Divider */}
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Owner Info */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Posted By</Text>
                        <View style={[styles.ownerCard, { backgroundColor: colors.card }]}>
                            <View style={[styles.ownerAvatar, { backgroundColor: colors.primary }]}>
                                <Text style={styles.ownerAvatarText}>
                                    {listing.ownerName.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.ownerInfo}>
                                <View style={styles.ownerNameRow}>
                                    <Text style={[styles.ownerName, { color: colors.text }]}>
                                        {listing.ownerName}
                                    </Text>
                                    {listing.ownerVerified && (
                                        <BadgeCheck size={18} color={colors.accent} />
                                    )}
                                </View>
                                <Text style={[styles.ownerPhone, { color: colors.textSecondary }]}>
                                    {listing.ownerPhone}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.callButton, { backgroundColor: colors.accent }]}
                                onPress={handleCall}
                            >
                                <Phone size={20} color="#003333" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.shareButton, { borderColor: colors.border }]}
                    onPress={handleShare}
                >
                    <Share2 size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.applyButton, { backgroundColor: colors.primary }]}
                    onPress={handleApply}
                >
                    <Text style={styles.applyButtonText}>
                        {listing.category === 'jobs' ? 'Apply Now' : 'Book Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholder: {
        fontSize: 16,
    },
    content: {
        padding: 16,
    },
    titleSection: {
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 14,
        marginLeft: 6,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 14,
        marginLeft: 6,
    },
    divider: {
        height: 1,
        marginVertical: 20,
    },
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
    },
    ownerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    ownerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ownerAvatarText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    ownerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    ownerNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ownerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    ownerPhone: {
        fontSize: 14,
        marginTop: 2,
    },
    callButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBar: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        gap: 12,
    },
    shareButton: {
        width: 56,
        height: 56,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyButton: {
        flex: 1,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
