import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, User, Briefcase, DollarSign, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useDoc } from '../../hooks/useDoc';
import { db } from '../../lib/firebase';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';

export default function ListingDetailPage() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const { data: listing, loading: listingLoading } = useDoc('listings', id);
  const { data: postedBy, loading: userLoading } = useDoc('users', listing?.ownerId || '');
  const [isApplying, setIsApplying] = useState(false);
  const mockListing = {
    id: 'mock',
    title: 'Sample Listing',
    description: 'This is a sample listing for design purposes.',
    category: 'services',
    location: 'Sample City',
    salary: '$100/hour',
    experience: '2 years',
    ownerId: 'mockUser',
    imageUrl: 'https://via.placeholder.com/400x200?text=Sample+Listing',
    createdAt: new Date(),
  };

  const mockPostedBy = {
    id: 'mockUser',
    name: 'Sample User',
    isVerified: true,
  };

  const displayListing = listing || mockListing;
  const displayPostedBy = postedBy || mockPostedBy;
  const handleApplyOrBook = async () => {
    if (!user) {
      router.push('/profile');
      return;
    }
    if (user.uid === displayListing.ownerId) {
      Alert.alert('Error', 'You cannot apply to your own listing.');
      return;
    }
    if (!displayListing) {
      Alert.alert('Error', 'Listing not found.');
      return;
    }
    setIsApplying(true);
    try {
      await addDoc(collection(db, 'applications'), {
        listingId: id,
        applicantId: user.uid,
        ownerId: displayListing.ownerId,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Application submitted successfully!');
    } catch (error) {
      console.error('Error applying:', error);
      Alert.alert('Error', 'Failed to submit application.');
    } finally {
      setIsApplying(false);
    }
  };

  if (listingLoading || userLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const postedDate = displayListing.createdAt && typeof (displayListing.createdAt as any).toDate === 'function' 
    ? (displayListing.createdAt as any).toDate() 
    : new Date(displayListing.createdAt as any);

  const isJob = displayListing.category === 'jobs';
  const buttonText = isJob ? 'Apply Now' : 'Book Now';
  const isButtonDisabled = user ? user.uid === displayListing.ownerId : false;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        {/* Back */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
            <ArrowLeft size={20} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '600', marginLeft: 12 }}>Listing Details</Text>
        </View>


        {/* Image */}
        <View style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e0e0e0' }}>
          <Image source={{ uri: displayListing.imageUrl || 'https://via.placeholder.com/400x200' }} style={{ width: '100%', height: 200 }} />
        </View>

        {/* Title + location */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 4 }}>{displayListing.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MapPin size={16} color="#666" />
            <Text style={{ fontSize: 14, color: '#666', marginLeft: 4 }}>{displayListing.location}</Text>
          </View>
        </View>

        {/* Info cards */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
          {displayListing.salary && (
            <View style={{ width: '48%', backgroundColor: 'white', borderRadius: 12, padding: 12, marginRight: '4%', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <DollarSign size={18} color="#16a34a" />
                <Text style={{ fontSize: 14, fontWeight: '500', marginLeft: 8 }}>{isJob ? 'Salary' : 'Rate'}</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#16a34a' }}>{displayListing.salary}</Text>
            </View>
          )}

          {displayListing.experience && (
            <View style={{ width: '48%', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Briefcase size={18} color="#2563eb" />
                <Text style={{ fontSize: 14, fontWeight: '500', marginLeft: 8 }}>Experience</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>{displayListing.experience}</Text>
            </View>
          )}

          <View style={{ width: '100%', backgroundColor: 'white', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <User size={18} color="#9333ea" />
              <Text style={{ fontSize: 14, fontWeight: '500', marginLeft: 8 }}>Posted by</Text>
            </View>
            {displayPostedBy && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>{displayPostedBy.name}</Text>
                {displayPostedBy.isVerified && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                    <CheckCircle size={16} color="#16a34a" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#16a34a', marginLeft: 2 }}>Verified</Text>
                  </View>
                )}
              </View>
            )}
            {displayListing.createdAt && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Calendar size={14} color="#6b7280" />
                <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>Posted on {postedDate.toLocaleDateString()}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Job / Service Description</Text>
          <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20 }}>{displayListing.description}</Text>
        </View>

        {/* Actions */}
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Actions</Text>
          <TouchableOpacity
            onPress={handleApplyOrBook}
            disabled={isButtonDisabled || isApplying}
            style={{
              backgroundColor: isButtonDisabled ? '#d1d5db' : '#007bff',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
              opacity: isApplying ? 0.7 : 1
            }}
          >
            {isApplying ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontWeight: '600' }}>{buttonText}</Text>
            )}
          </TouchableOpacity>
          {isButtonDisabled && (
            <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 8 }}>You cannot apply to your own listing.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
