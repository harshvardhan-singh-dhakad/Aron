
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Share, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Listing, Application } from '../../types';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, MapPin, Tag, User as UserIcon } from 'lucide-react-native';
import { useDoc } from '../../hooks/useDoc';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function ListingDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();

    // Fetch listing data
    const { data: listing, loading, error } = useDoc('listings', id);

    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        if (user && id) {
            checkIfApplied(id, user.uid);
        }
    }, [user, id]);

    const checkIfApplied = async (listingId: string, userId: string) => {
        try {
            const q = query(
                collection(db, 'applications'),
                where('listingId', '==', listingId),
                where('applicantId', '==', userId)
            );
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                setHasApplied(true);
            }
        } catch (err) {
            console.error("Error checking application status:", err);
        }
    }

    const handleApply = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please log in to contact the owner.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => router.push('/profile') }
            ]);
            return;
        }

        if (!listing) return;

        setApplying(true);

        try {
            const newApp: Omit<Application, 'id'> = {
                listingId: listing.id,
                applicantId: user.uid,
                ownerId: listing.createdBy,
                status: 'pending',
                appliedAt: new Date(),
                listingTitle: listing.title
            };

            await addDoc(collection(db, 'applications'), newApp);

            setHasApplied(true);
            Alert.alert('Success', 'Application sent successfully! The owner will contact you shortly.');
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to send application. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    const handleShare = async () => {
        try {
            // Native share
            await Share.share({
                message: `Check out this listing on Kaam Kiraya: ${listing?.title} - ${listing?.description}`,
                url: `https://kaamkiraya.app/listing/${listing?.id}`, // Mock URL
            });
        } catch (err) {
            console.log(err);
        }
    }

    const getPrice = (listing: Listing) => {
        if (listing.price) return `₹${listing.price}`;
        if (listing.rent) return `₹${listing.rent}/mo`;
        if (listing.salary) return `₹${listing.salary}/mo`;
        return 'Contact for Price';
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (!listing) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <Text className="text-gray-500 text-lg">Listing not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-black px-6 py-3 rounded-full">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center p-4 border-b border-gray-100 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg font-bold flex-1" numberOfLines={1}>{listing.title}</Text>
                <TouchableOpacity onPress={handleShare} className="p-1">
                    <Share2 size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
                {/* Image Section */}
                {listing.images && listing.images.length > 0 ? (
                    <Image
                        source={{ uri: listing.images[0] }}
                        className="w-full h-64 bg-gray-200"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-48 bg-gray-100 items-center justify-center">
                        <Text className="text-gray-400">No Image Available</Text>
                    </View>
                )}

                <View className="p-5">
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="bg-blue-50 px-3 py-1 rounded-md self-start">
                            <Text className="text-xs font-bold text-blue-700 uppercase tracking-wide">{listing.category}</Text>
                        </View>
                        <Text className="text-xs text-gray-400">
                            Posted {listing.createdAt?.toDate ? listing.createdAt.toDate().toLocaleDateString() : new Date(listing.createdAt).toLocaleDateString()}
                        </Text>
                    </View>

                    <Text className="text-2xl font-bold mb-2 text-gray-900 leading-tight">{listing.title}</Text>

                    <View className="flex-row items-center mb-6 mt-1">
                        <Text className="text-xl font-bold text-blue-600">
                            {getPrice(listing)}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-6 bg-gray-50 p-3 rounded-lg">
                        <MapPin size={18} color="#4B5563" />
                        <Text className="ml-2 text-gray-600 font-medium">{listing.location}</Text>
                    </View>

                    {/* Owner Info */}
                    <View className="flex-row items-center mb-6 pb-6 border-b border-gray-100">
                        <Image
                            source={{ uri: listing.ownerImage || 'https://via.placeholder.com/50' }}
                            className="w-12 h-12 rounded-full bg-gray-200 mr-3"
                        />
                        <View>
                            <Text className="font-bold text-gray-900 text-base">{listing.ownerName || 'Kaam Kiraya User'}</Text>
                            <Text className="text-gray-500 text-sm">Verified Poster</Text>
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="font-bold text-lg mb-3 text-gray-900">Description</Text>
                        <Text className="text-gray-600 leading-7 text-base">{listing.description}</Text>
                    </View>

                    {/* Additional Details based on Mock Data */}
                    <View className="bg-gray-50 rounded-xl p-4 mb-24">
                        <Text className="font-bold mb-3 text-gray-900">Additional Details</Text>

                        {listing.condition && (
                            <View className="flex-row justify-between py-2 border-b border-gray-200 border-dashed">
                                <Text className="text-gray-500">Condition</Text>
                                <Text className="font-medium text-gray-900 capitalize">{listing.condition}</Text>
                            </View>
                        )}
                        {listing.jobType && (
                            <View className="flex-row justify-between py-2 border-b border-gray-200 border-dashed">
                                <Text className="text-gray-500">Job Type</Text>
                                <Text className="font-medium text-gray-900 capitalize">{listing.jobType}</Text>
                            </View>
                        )}
                        {listing.period && (
                            <View className="flex-row justify-between py-2 border-b border-gray-200 border-dashed">
                                <Text className="text-gray-500">Rent Period</Text>
                                <Text className="font-medium text-gray-900 capitalize">{listing.period}</Text>
                            </View>
                        )}
                        <View className="flex-row justify-between py-2">
                            <Text className="text-gray-500">Listing ID</Text>
                            <Text className="font-medium text-gray-900">#{listing.id.substring(0, 8)}</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* Footer Action */}
            <View className="absolute bottom-0 w-full bg-white border-t border-gray-200 p-4 safe-area-bottom shadow-lg">
                {user?.uid === listing.createdBy ? (
                    <TouchableOpacity className="bg-gray-100 w-full py-4 rounded-xl items-center border border-gray-200">
                        <Text className="font-bold text-gray-500">You posted this listing</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={handleApply}
                        disabled={hasApplied || applying}
                        className={`w-full py-4 rounded-xl items-center shadow-md active:scale-[0.98] transition-all ${hasApplied ? 'bg-green-600' : 'bg-black'}`}
                    >
                        {applying ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                {hasApplied ? 'Request Sent' : 'Contact / Apply Now'}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}
