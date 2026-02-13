import React, { useState, useEffect } from 'react';
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
    Image,
    ActivityIndicator,
    Modal,
    Platform,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { getListingById } from '@/lib/services/listings';
import { Listing } from '@/types';
import * as Clipboard from 'expo-clipboard';
import {
    MapPin,
    BadgeCheck,
    Phone,
    Share2,
    Calendar,
    IndianRupee,
    Clock,
    Briefcase,
    Tag,
    X,
    Copy,
    MessageCircle,
    MoreHorizontal,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const { user, userProfile } = useAuth();

    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            if (!id) return;
            try {
                const data = await getListingById(id as string);
                setListing(data);
            } catch (error) {
                console.error('Error fetching listing:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    const getShareUrl = () => `https://aron-one.web.app/listing/${id}`;

    const handleShare = async () => {
        if (Platform.OS === 'web') {
            setShareModalVisible(true);
        } else {
            try {
                await Share.share({
                    message: `Check out this listing: ${listing?.title}\n\n${getShareUrl()}`,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        }
    };

    const shareToWhatsApp = () => {
        const text = `Check out this listing on Aron:\n*${listing?.title}*\n\n${getShareUrl()}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        Linking.openURL(url);
        setShareModalVisible(false);
    };

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(getShareUrl());
        alert('Link copied to clipboard!');
        setShareModalVisible(false);
    };

    const shareNative = async () => {
        setShareModalVisible(false);
        try {
            if (navigator.share) {
                await navigator.share({
                    title: listing?.title,
                    text: `Check out this listing on Aron: ${listing?.title}`,
                    url: getShareUrl(),
                });
            } else {
                // Fallback for browsers logic if needed, but we already have modal
            }
        } catch (error) {
            console.error('Error sharing native:', error);
        }
    };

    const handleCall = () => {
        if (!listing) return;
        Linking.openURL(`tel:${listing.ownerPhone}`);
    };

    const formatPrice = (): string => {
        if (!listing) return '';
        if (listing.category === 'jobs') {
            return `₹${listing.salary?.toLocaleString('en-IN')}/${listing.salaryType}`;
        }
        if (listing.category === 'buy-sell') {
            return `₹${listing.price?.toLocaleString('en-IN')}`;
        }
        if (listing.category === 'rent') {
            return `₹${listing.pricePerUnit?.toLocaleString('en-IN')}/${listing.priceUnit}`;
        }
        if (listing.category === 'services' && listing.ratePerHour) {
            return `₹${listing.ratePerHour?.toLocaleString('en-IN')}/hr`;
        }
        return '';
    };

    // ... (rest of getCategorySpecificDetails logic remains same)
    const getCategorySpecificDetails = () => {
        if (!listing) return null;
        const details: { label: string; value: string; icon: React.ReactNode }[] = [];

        if (listing.category === 'jobs') {
            if (listing.jobType) {
                details.push({
                    label: 'Job Type',
                    value: listing.jobType.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    icon: <Briefcase size={16} color={colors.primary} />,
                });
            }
            if (listing.experience) {
                details.push({
                    label: 'Experience',
                    value: listing.experience,
                    icon: <Clock size={16} color={colors.primary} />,
                });
            }
        }
        if (listing.category === 'buy-sell') {
            details.push({
                label: 'Condition',
                value: listing.condition?.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Used',
                icon: <Tag size={16} color={colors.primary} />,
            });
            details.push({
                label: 'Negotiable',
                value: listing.negotiable ? 'Yes' : 'No',
                icon: <IndianRupee size={16} color={colors.primary} />,
            });
        }
        if (listing.category === 'business') {
            if (listing.businessName) {
                details.push({
                    label: 'Business',
                    value: listing.businessName,
                    icon: <Tag size={16} color={colors.primary} />,
                });
            }
            if (listing.openingHours) {
                details.push({
                    label: 'Hours',
                    value: listing.openingHours,
                    icon: <Clock size={16} color={colors.primary} />,
                });
            }
            if (listing.address) {
                details.push({
                    label: 'Address',
                    value: listing.address,
                    icon: <MapPin size={16} color={colors.primary} />,
                });
            }
        }
        if (listing.category === 'services' && listing.availability) {
            details.push({
                label: 'Availability',
                value: listing.availability,
                icon: <Clock size={16} color={colors.primary} />,
            });
        }

        return details.length > 0 ? details : null;
    };


    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
            </View>
        );
    }

    if (!listing) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.text }]}>Listing not found</Text>
                <TouchableOpacity
                    style={[styles.backBtn, { backgroundColor: colors.primary }]}
                    onPress={() => router.back()}
                >
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const priceText = formatPrice();
    const categoryDetails = getCategorySpecificDetails();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel */}
                {listing.images && listing.images.length > 0 && !imageError ? (
                    <View style={styles.imageContainer}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                                setActiveImageIndex(index);
                            }}
                        >
                            {listing.images.map((uri, index) => (
                                <Image
                                    key={index}
                                    source={{ uri }}
                                    style={{ width, height: 300, backgroundColor: colors.muted }}
                                    resizeMode="cover"
                                    onError={(e) => {
                                        console.log('Image Load Error:', e.nativeEvent.error);
                                        // Only set error if first image fails, or handle individual fallbacks?
                                        // For now, simpler to just log. If all fail, user sees blank.
                                        // Using key to force refresh if URL changes might help.
                                    }}
                                />
                            ))}
                        </ScrollView>
                        {/* Dot indicators */}
                        {listing.images.length > 1 && (
                            <View style={styles.dotsContainer}>
                                {listing.images.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.dot,
                                            {
                                                backgroundColor: index === activeImageIndex ? '#FFF' : 'rgba(255,255,255,0.5)',
                                                width: index === activeImageIndex ? 24 : 8,
                                            },
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                        {/* Image counter */}
                        <View style={styles.imageCounter}>
                            <Text style={styles.imageCounterText}>
                                {activeImageIndex + 1}/{listing.images.length}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.imageContainer, styles.noImageContainer, { backgroundColor: colors.muted }]}>
                        <Text style={[styles.imagePlaceholder, { color: colors.textSecondary }]}>
                            {imageError ? 'Failed to load images' : 'No images available'}
                        </Text>
                    </View>
                )}

                {/* Content */}
                <View style={styles.content}>
                    {/* Title & Price */}
                    <View style={styles.titleSection}>
                        <Text style={[styles.title, { color: colors.text }]}>{listing.title}</Text>
                        {priceText ? (
                            <Text style={[styles.price, { color: colors.primary }]}>{priceText}</Text>
                        ) : null}
                    </View>

                    {/* Meta Row (Badge) */}
                    <View style={styles.metaRow}>
                        <View style={[styles.categoryBadge, { backgroundColor: `${colors.primary}20` }]}>
                            <Text style={[styles.categoryText, { color: colors.primary }]}>
                                {listing.category.charAt(0).toUpperCase() +
                                    listing.category.slice(1).replace('-', ' ')}{' '}
                                • {listing.subCategory}
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
                            Posted{' '}
                            {listing.createdAt instanceof Date
                                ? listing.createdAt.toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })
                                : 'Recently'}
                        </Text>
                    </View>

                    {/* Category-specific details */}
                    {categoryDetails && (
                        <>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
                                <View style={[styles.detailsGrid, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                    {categoryDetails.map((detail, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.detailItem,
                                                index < categoryDetails.length - 1 && {
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: colors.border,
                                                },
                                            ]}
                                        >
                                            <View style={styles.detailIconRow}>
                                                {detail.icon}
                                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                                                    {detail.label}
                                                </Text>
                                            </View>
                                            <Text style={[styles.detailValue, { color: colors.text }]}>
                                                {detail.value}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                        <Text style={[styles.description, { color: colors.text }]}>
                            {listing.description}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Owner Info */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Posted By</Text>
                        <View style={[styles.ownerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={[styles.ownerAvatar, { backgroundColor: colors.primary }]}>
                                <Text style={styles.ownerAvatarText}>
                                    {listing.ownerName?.charAt(0)?.toUpperCase() || '?'}
                                </Text>
                            </View>
                            <View style={styles.ownerInfo}>
                                <View style={styles.ownerNameRow}>
                                    <Text style={[styles.ownerName, { color: colors.text }]}>
                                        {listing.ownerName || 'Unknown'}
                                    </Text>
                                    {listing.ownerVerified && (
                                        <BadgeCheck size={18} color={colors.success} />
                                    )}
                                </View>
                                <Text style={[styles.ownerPhone, { color: colors.textSecondary }]}>
                                    {listing.ownerPhone || ''}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.callButton, { backgroundColor: colors.success + '20' }]}
                                onPress={handleCall}
                            >
                                <Phone size={20} color={colors.success} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Bottom spacing */}
                <View style={{ height: 100 }} />
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
                    onPress={handleCall}
                >
                    <Phone size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.applyButtonText}>
                        {listing.category === 'jobs' ? 'Call to Apply' : 'Contact Now'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Share Modal */}
            <Modal
                transparent
                visible={shareModalVisible}
                animationType="fade"
                onRequestClose={() => setShareModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShareModalVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Share via</Text>
                            <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                                <X size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.shareOptions}>
                            <TouchableOpacity style={styles.shareOption} onPress={shareToWhatsApp}>
                                <View style={[styles.iconCircle, { backgroundColor: '#25D366' }]}>
                                    <MessageCircle size={24} color="#FFF" />
                                </View>
                                <Text style={[styles.shareText, { color: colors.text }]}>WhatsApp</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.shareOption} onPress={copyToClipboard}>
                                <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
                                    <Copy size={24} color="#FFF" />
                                </View>
                                <Text style={[styles.shareText, { color: colors.text }]}>Copy Link</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.shareOption} onPress={shareNative}>
                                <View style={[styles.iconCircle, { backgroundColor: colors.textSecondary }]}>
                                    <MoreHorizontal size={24} color="#FFF" />
                                </View>
                                <Text style={[styles.shareText, { color: colors.text }]}>More</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    backBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    imageContainer: {
        height: 300,
        position: 'relative',
    },
    noImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholder: {
        fontSize: 16,
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    imageCounter: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    imageCounterText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
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
    detailsGrid: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    detailIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailLabel: {
        fontSize: 14,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
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
        borderWidth: 1,
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
        flexDirection: 'row',
    },
    applyButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    shareOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    shareOption: {
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
