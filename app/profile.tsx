
import { View, ScrollView, Image, TouchableOpacity, Text, Alert, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { doc, onSnapshot, collection, query, where, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { ProfileHero } from '../components/profile/ProfileHero';
import { StatsRow } from '../components/profile/StatsRow';
import { ModeSwitch } from '../components/profile/ModeSwitch';
import { SectionTabs } from '../components/profile/SectionTabs';
import { InfoSection } from '../components/profile/InfoSection';
import { WalletSection } from '../components/profile/WalletSection';
import { BookingsList } from '../components/profile/BookingsList';
import { PartnerDashboard } from '../components/profile/PartnerDashboard';
import { LeadsList } from '../components/profile/LeadsList';
import { ListingsList } from '../components/profile/ListingsList';
import { PartnerRegistrationModal } from '../components/profile/PartnerRegistrationModal';

// Default Guest User
const GUEST_USER = {
  name: "Guest User",
  phone: "",
  city: "",
  email: "",
  profession: "",
  photo: "https://api.dicebear.com/7.x/thumbs/svg?seed=guest&backgroundColor=e5e7eb",
  rating: 0,
  reviews: 0,
};

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const router = useRouter();

  // State
  const [isPartner, setIsPartner] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [userData, setUserData] = useState<any>(GUEST_USER);
  const [loading, setLoading] = useState(true);

  // Real data states
  const [bookings, setBookings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletData, setWalletData] = useState({ balance: 0, pending: 0 });
  const [leads, setLeads] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ bookings: 0, saved: 0, reviews: 0 });
  const [partnerStats, setPartnerStats] = useState({ views: 0, calls: 0, leads: 0, revenue: 0 });

  // Inline edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Document verification modal state
  const [docModal, setDocModal] = useState(false);
  const [docType, setDocType] = useState('');
  const [docImage, setDocImage] = useState<string | null>(null);
  const [docSaving, setDocSaving] = useState(false);

  // Partner Registration modal state
  const [partnerRegVisible, setPartnerRegVisible] = useState(false);

  const DOC_TYPES = [
    { key: 'aadhaar', label: 'Aadhaar Card' },
    { key: 'pan', label: 'PAN Card' },
    { key: 'voter_id', label: 'Voter ID' },
    { key: 'driving_license', label: 'Driving License' },
  ];

  // ────────────────────────────────────────
  // 1. USER PROFILE — Real-time listener
  // ────────────────────────────────────────
  useEffect(() => {
    if (!authUser) {
      setUserData(GUEST_USER);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, 'users', authUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          ...GUEST_USER,
          ...data,
          name: data.name || GUEST_USER.name,
          photo: data.profileImage || GUEST_USER.photo,
          phone: data.phoneNumber || data.phone || authUser.phoneNumber || "",
          city: data.city || data.location || "",
          email: data.email || "",
          profession: data.profession || "",
          rating: data.rating || 0,
          reviews: data.reviewCount || 0,
          partnerStatus: data.partnerStatus || 'inactive',
          isPartnerRegistered: data.isPartnerRegistered || false,
        });
        setUserStats(prev => ({ ...prev, reviews: data.reviewCount || 0 }));
      }
      setLoading(false);
    });

    return () => unsub();
  }, [authUser]);

  // ────────────────────────────────────────
  // 2. BOOKINGS — Real-time listener
  // ────────────────────────────────────────
  useEffect(() => {
    if (!authUser) { setBookings([]); return; }

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', authUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: any[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
      items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setBookings(items.slice(0, 20));
      setUserStats(prev => ({ ...prev, bookings: items.length }));
    }, (err) => console.log('Bookings listener error:', err));

    return () => unsub();
  }, [authUser]);

  // ────────────────────────────────────────
  // 3. WALLET & TRANSACTIONS — Real-time
  // ────────────────────────────────────────
  useEffect(() => {
    if (!authUser) { setTransactions([]); setWalletData({ balance: 0, pending: 0 }); return; }

    const walletUnsub = onSnapshot(doc(db, 'wallets', authUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWalletData({ balance: data.balance || 0, pending: data.pending || 0 });
      }
    }, (err) => console.log('Wallet listener error:', err));

    const txUnsub = onSnapshot(
      collection(db, 'wallets', authUser.uid, 'transactions'),
      (snap) => {
        const items: any[] = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setTransactions(items.slice(0, 20));
      },
      (err) => console.log('Transactions listener error:', err)
    );

    return () => { walletUnsub(); txUnsub(); };
  }, [authUser]);

  // ────────────────────────────────────────
  // 4. LEADS — Real-time (Partner Mode)
  // ────────────────────────────────────────
  useEffect(() => {
    if (!authUser) { setLeads([]); return; }

    const q = query(
      collection(db, 'leads'),
      where('partnerId', '==', authUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: any[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
      items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setLeads(items.slice(0, 20));
      setPartnerStats(prev => ({ ...prev, leads: items.length }));
    }, (err) => console.log('Leads listener error:', err));

    return () => unsub();
  }, [authUser]);

  // ────────────────────────────────────────
  // 5. LISTINGS — Real-time (Partner Mode)
  // ────────────────────────────────────────
  useEffect(() => {
    if (!authUser) { setListings([]); return; }

    const q = query(
      collection(db, 'listings'),
      where('ownerId', '==', authUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: any[] = [];
      let totalViews = 0, totalCalls = 0, totalRevenue = 0;
      snap.forEach((d) => {
        const data = d.data();
        items.push({ id: d.id, ...data });
        totalViews += data.views || 0;
        totalCalls += data.calls || 0;
        totalRevenue += data.revenue || 0;
      });
      items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setListings(items.slice(0, 20));
      setPartnerStats(prev => ({ ...prev, views: totalViews, calls: totalCalls, revenue: totalRevenue }));
    }, (err) => console.log('Listings listener error:', err));

    return () => unsub();
  }, [authUser]);

  // ────────────────────────────────────────
  // 6. USER STATS — Saved count
  // ────────────────────────────────────────
  useEffect(() => {
    if (!authUser) { setUserStats({ bookings: 0, saved: 0, reviews: 0 }); return; }

    const unsub = onSnapshot(
      collection(db, 'users', authUser.uid, 'saved'),
      (snap) => { setUserStats(prev => ({ ...prev, saved: snap.size })); },
      (err) => console.log('Saved listener error:', err)
    );

    return () => unsub();
  }, [authUser]);

  // ────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────
  const handleEditProfile = () => {
    if (!authUser) { router.push('/login'); return; }
    router.push('/complete-profile?redirect=/profile');
  };

  // Open inline edit modal for a specific field
  const handleFieldEdit = (field: string, currentValue: string) => {
    if (!authUser) { router.push('/login'); return; }
    const labels: Record<string, string> = {
      name: 'Full Name',
      email: 'Email',
      city: 'City / Location',
      profession: 'Skill / Profession',
    };
    setEditField(field);
    setEditLabel(labels[field] || field);
    setEditValue(currentValue || '');
    setEditModal(true);
  };

  // Save single field to Firestore
  const handleFieldSave = async () => {
    if (!authUser || !editField) return;
    setEditSaving(true);
    try {
      await updateDoc(doc(db, 'users', authUser.uid), {
        [editField]: editValue.trim(),
      });
      setEditModal(false);
    } catch (err) {
      console.log('Field save error:', err);
      Alert.alert('Error', 'Could not save. Please try again.');
    } finally {
      setEditSaving(false);
    }
  };

  // Open document verification modal
  const handleVerify = () => {
    if (!authUser) { router.push('/login'); return; }
    setDocType(userData.verification?.type || '');
    setDocImage(userData.verification?.imageUrl || null);
    setDocModal(true);
  };

  // Pick document image
  const handlePickDocImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setDocImage(result.assets[0].uri);
    }
  };

  // Submit document verification
  const handleDocSubmit = async () => {
    if (!authUser || !docType) {
      Alert.alert('Select Document', 'Please select a document type.');
      return;
    }
    setDocSaving(true);
    try {
      let imageUrl = docImage;

      // Upload image if it's a local file (not already a URL)
      if (docImage && !docImage.startsWith('http')) {
        const response = await fetch(docImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `verifications/${authUser.uid}/${docType}_${Date.now()}`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, 'users', authUser.uid), {
        verification: {
          type: docType,
          imageUrl: imageUrl || '',
          status: 'pending',
          submittedAt: Timestamp.now(),
        },
      });

      setDocModal(false);
      Alert.alert('Submitted!', 'Your document has been submitted for verification.');
    } catch (err) {
      console.log('Doc submit error:', err);
      Alert.alert('Error', 'Could not submit document. Please try again.');
    } finally {
      setDocSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: async () => {
            alert("Account deletion request received.");
            logout();
          }
        }
      ]
    );
  };

  const handleToggleMode = (toPartner: boolean) => {
    if (!authUser) { router.push('/login'); return; }

    if (toPartner) {
      if (userData.partnerStatus === 'active') {
        setIsPartner(true);
        setActiveTab('dashboard');
      } else if (userData.partnerStatus === 'pending') {
        Alert.alert(
          "Review in Progress",
          "Your partner registration is being reviewed. We'll notify you once it's active!",
          [{ text: "Okay" }]
        );
      } else {
        // Not registered or inactive
        setPartnerRegVisible(true);
      }
    } else {
      setIsPartner(false);
      setActiveTab('info');
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'settings') { router.push('/settings' as any); return; }
    if (tab === 'help') { router.push('/help' as any); return; }
    setActiveTab(tab);
  };

  // Tabs Config
  const USER_TABS = ['info', 'activity', 'wallet', 'settings', 'help'];
  const PARTNER_TABS = ['dashboard', 'leads', 'listings', 'activity', 'help'];

  const TAB_LABELS: Record<string, string> = {
    info: "👤 Info",
    activity: "📦 Bookings",
    wallet: "💰 Wallet",
    settings: "⚙️ Settings",
    help: "❓ Help",
    dashboard: "📊 Dashboard",
    leads: "🔔 Leads",
    listings: "📌 Listings",
  };

  const currentTabs = isPartner ? PARTNER_TABS : USER_TABS;

  // ────────────────────────────────────────
  // Render Content based on active tab
  // ────────────────────────────────────────
  const renderContent = () => {
    if (!authUser && activeTab !== 'info') {
      return (
        <View className="p-10 items-center">
          <Text className="text-gray-400 text-center mb-4">Please login to access this section</Text>
          <TouchableOpacity onPress={() => router.push('/login')} className="bg-u-navy px-6 py-2.5 rounded-full">
            <Text className="text-white text-sm font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (activeTab) {
      case 'info':
        return <InfoSection user={userData} onEdit={handleFieldEdit} onVerify={handleVerify} onLogout={logout} onDelete={handleDeleteAccount} />;
      case 'activity':
        return bookings.length > 0
          ? <BookingsList bookings={bookings} isPartner={isPartner} />
          : <EmptyState message="No bookings yet" icon="📋" />;
      case 'wallet':
        return <WalletSection wallet={walletData} transactions={transactions} />;

      // Partner Tabs - Restricted if pending
      case 'dashboard':
      case 'leads':
      case 'listings':
        if (userData.partnerStatus === 'pending') {
          return (
            <View className="flex-1 p-8 items-center justify-center">
              <View className="w-24 h-24 bg-p-amber-soft rounded-full items-center justify-center mb-6">
                <Text className="text-5xl">⏳</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-800 text-center mb-2">Registration Under Review</Text>
              <Text className="text-gray-500 text-center leading-5 mb-8">
                Your application to become a partner is being reviewed by our team.
                We'll notify you once your account is active!
              </Text>
              <TouchableOpacity
                onPress={() => setIsPartner(false)}
                className="bg-u-navy px-8 py-3.5 rounded-xl"
              >
                <Text className="text-white font-bold">Go Back to User Mode</Text>
              </TouchableOpacity>
            </View>
          );
        }

        if (activeTab === 'dashboard') return <PartnerDashboard stats={partnerStats} leads={leads} listings={listings} onAction={() => { }} />;
        if (activeTab === 'leads') return leads.length > 0 ? <LeadsList leads={leads} /> : <EmptyState message="No leads yet" icon="🔔" />;
        if (activeTab === 'listings') return listings.length > 0 ? <ListingsList listings={listings} /> : <EmptyState message="No listings yet" icon="📌" />;
        return null;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-u-bg items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-400 mt-3">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isPartner ? 'bg-p-bg' : 'bg-u-bg'}`} edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-5 pt-2 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className={`w-[38px] h-[38px] rounded-xl border items-center justify-center ${isPartner ? 'bg-white border-p-border' : 'bg-white border-u-border'}`}
          >
            <Text className={`text-lg ${isPartner ? 'text-p-text' : 'text-u-navy'}`}>←</Text>
          </TouchableOpacity>

          <Text className={`text-lg font-bold ${isPartner ? 'text-p-text' : 'text-u-navy'}`}>
            {isPartner ? "Partner Panel" : "My Profile"}
          </Text>

          <TouchableOpacity
            className={`px-3.5 py-1.5 rounded-full ${isPartner ? 'bg-p-amber-soft' : 'bg-u-navy'}`}
            onPress={handleEditProfile}
          >
            <Text className={`text-xs font-semibold ${isPartner ? 'text-p-amber' : 'text-white'}`}>{authUser ? 'Edit' : 'Login'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <ProfileHero user={userData} isPartner={isPartner} onEdit={handleEditProfile} onPhotoUpload={handleEditProfile} />
          <StatsRow isPartner={isPartner} stats={isPartner ? partnerStats : userStats} />
          <ModeSwitch isPartner={isPartner} onSwitch={handleToggleMode} />
          <SectionTabs tabs={currentTabs} activeTab={activeTab} onTabChange={handleTabChange} isPartner={isPartner} tabLabels={TAB_LABELS} hasLeads={leads.length > 0} />
          {renderContent()}
        </ScrollView>
      </View>

      {/* Inline Edit Modal */}
      <Modal visible={editModal} transparent animationType="fade" onRequestClose={() => setEditModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <TouchableOpacity activeOpacity={1} onPress={() => setEditModal(false)} className="flex-1 bg-black/50 justify-end">
            <TouchableOpacity activeOpacity={1} onPress={() => { }} className="bg-white rounded-t-3xl p-6">
              <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />
              <Text className="text-lg font-bold text-u-navy mb-4">Edit {editLabel}</Text>
              <TextInput
                className="border border-gray-300 rounded-xl p-4 bg-gray-50 text-base mb-4"
                placeholder={`Enter ${editLabel.toLowerCase()}`}
                value={editValue}
                onChangeText={setEditValue}
                autoFocus
              />
              <View className="flex-row gap-3">
                <TouchableOpacity onPress={() => setEditModal(false)} className="flex-1 border border-gray-300 rounded-xl py-3.5 items-center">
                  <Text className="text-gray-600 font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFieldSave} disabled={editSaving} className={`flex-1 bg-u-navy rounded-xl py-3.5 items-center ${editSaving ? 'opacity-60' : ''}`}>
                  {editSaving ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-semibold">Save</Text>}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* Document Verification Modal */}
      <Modal visible={docModal} transparent animationType="fade" onRequestClose={() => setDocModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <TouchableOpacity activeOpacity={1} onPress={() => setDocModal(false)} className="flex-1 bg-black/50 justify-end">
            <TouchableOpacity activeOpacity={1} onPress={() => { }} className="bg-white rounded-t-3xl p-6">
              <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />
              <Text className="text-lg font-bold text-u-navy mb-1">Identity Verification</Text>
              <Text className="text-xs text-gray-400 mb-4">Optional — upload a document for verification</Text>

              {/* Document Type Selector */}
              <Text className="text-sm font-semibold text-u-text mb-2">Document Type</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {DOC_TYPES.map((dt) => (
                  <TouchableOpacity
                    key={dt.key}
                    onPress={() => setDocType(dt.key)}
                    className={`px-4 py-2.5 rounded-xl border ${docType === dt.key ? 'bg-u-navy border-u-navy' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <Text className={`text-sm font-medium ${docType === dt.key ? 'text-white' : 'text-gray-600'}`}>{dt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Image Upload */}
              <Text className="text-sm font-semibold text-u-text mb-2">Document Image</Text>
              <TouchableOpacity onPress={handlePickDocImage} className="border-2 border-dashed border-gray-300 rounded-xl p-4 items-center justify-center mb-4 bg-gray-50" style={{ minHeight: 120 }}>
                {docImage ? (
                  <Image source={{ uri: docImage }} className="w-full h-28 rounded-lg" resizeMode="contain" />
                ) : (
                  <View className="items-center">
                    <Text className="text-3xl mb-1">📷</Text>
                    <Text className="text-sm text-gray-400">Tap to upload photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity onPress={() => setDocModal(false)} className="flex-1 border border-gray-300 rounded-xl py-3.5 items-center">
                  <Text className="text-gray-600 font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDocSubmit} disabled={docSaving} className={`flex-1 bg-u-navy rounded-xl py-3.5 items-center ${docSaving ? 'opacity-60' : ''}`}>
                  {docSaving ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-semibold">Submit</Text>}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
      {/* Partner Registration Modal */}
      <PartnerRegistrationModal
        visible={partnerRegVisible}
        onClose={() => setPartnerRegVisible(false)}
        user={{ uid: authUser?.uid, ...userData }}
        onSuccess={() => {
          setPartnerRegVisible(false);
          setIsPartner(true);
          setActiveTab('dashboard');
        }}
      />
    </SafeAreaView>
  );
}

// ────────────────────────────────────────
// Empty State Component
// ────────────────────────────────────────
function EmptyState({ message, icon }: { message: string; icon: string }) {
  return (
    <View className="p-10 items-center">
      <Text className="text-4xl mb-3">{icon}</Text>
      <Text className="text-gray-400 text-center">{message}</Text>
    </View>
  );
}