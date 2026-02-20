
import { View, ScrollView, Image, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { doc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
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
          photo: data.profileImage || GUEST_USER.photo,
          phone: data.phone || authUser.phoneNumber || "",
          rating: data.rating || 0,
          reviews: data.reviewCount || 0,
        });
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
      where('userId', '==', authUser.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setBookings(items);
      setUserStats(prev => ({ ...prev, bookings: items.length }));
    }, (err) => console.log('Bookings listener error:', err));

    return () => unsub();
  }, [authUser]);

  // ────────────────────────────────────────
  // 3. WALLET & TRANSACTIONS — Real-time
  // ────────────────────────────────────────
  useEffect(() => {
    if (!authUser) { setTransactions([]); setWalletData({ balance: 0, pending: 0 }); return; }

    // Wallet balance from user doc (already fetched) or dedicated wallet doc
    const walletUnsub = onSnapshot(doc(db, 'wallets', authUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWalletData({
          balance: data.balance || 0,
          pending: data.pending || 0,
        });
      }
    }, (err) => console.log('Wallet listener error:', err));

    // Transactions
    const txQuery = query(
      collection(db, 'wallets', authUser.uid, 'transactions'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const txUnsub = onSnapshot(txQuery, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setTransactions(items);
    }, (err) => console.log('Transactions listener error:', err));

    return () => { walletUnsub(); txUnsub(); };
  }, [authUser]);

  // ────────────────────────────────────────
  // 4. LEADS — Real-time (Partner Mode)
  // ────────────────────────────────────────
  useEffect(() => {
    if (!authUser) { setLeads([]); return; }

    const q = query(
      collection(db, 'leads'),
      where('partnerId', '==', authUser.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setLeads(items);
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
      where('ownerId', '==', authUser.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: any[] = [];
      let totalViews = 0;
      let totalCalls = 0;
      let totalRevenue = 0;
      snap.forEach((doc) => {
        const data = doc.data();
        items.push({ id: doc.id, ...data });
        totalViews += data.views || 0;
        totalCalls += data.calls || 0;
        totalRevenue += data.revenue || 0;
      });
      setListings(items);
      setPartnerStats(prev => ({
        ...prev,
        views: totalViews,
        calls: totalCalls,
        revenue: totalRevenue,
      }));
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
      (snap) => {
        setUserStats(prev => ({ ...prev, saved: snap.size }));
      },
      (err) => console.log('Saved listener error:', err)
    );

    return () => unsub();
  }, [authUser]);

  // ────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────
  const handleEditProfile = () => {
    if (!authUser) {
      router.push('/login');
      return;
    }
    router.push('/complete-profile');
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

  const handleTabChange = (tab: string) => {
    if (tab === 'settings') {
      router.push('/settings' as any);
      return;
    }
    if (tab === 'help') {
      router.push('/help' as any);
      return;
    }
    setActiveTab(tab);
  };

  // Tabs Config
  const USER_TABS = ['info', 'activity', 'wallet', 'settings', 'help'];
  const PARTNER_TABS = ['dashboard', 'leads', 'listings', 'activity', 'help'];

  const TAB_LABELS: Record<string, string> = {
    info: "👤 Info",
    activity: "📋 Activity",
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
          <TouchableOpacity
            onPress={() => router.push('/login')}
            className="bg-u-navy px-6 py-2.5 rounded-full"
          >
            <Text className="text-white text-sm font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (activeTab) {
      case 'info':
        return <InfoSection user={userData} onEdit={handleEditProfile} onLogout={logout} onDelete={handleDeleteAccount} />;
      case 'activity':
        return bookings.length > 0
          ? <BookingsList bookings={bookings} isPartner={isPartner} />
          : <EmptyState message="No bookings yet" icon="📋" />;
      case 'wallet':
        return <WalletSection wallet={walletData} transactions={transactions} />;
      case 'dashboard':
        return <PartnerDashboard stats={partnerStats} leads={leads} listings={listings} onAction={() => { }} />;
      case 'leads':
        return leads.length > 0
          ? <LeadsList leads={leads} />
          : <EmptyState message="No leads yet" icon="🔔" />;
      case 'listings':
        return listings.length > 0
          ? <ListingsList listings={listings} />
          : <EmptyState message="No listings yet. Create your first listing!" icon="📌" />;
      case 'settings':
      case 'help':
        return (
          <View className="p-10 items-center">
            <Text className="text-gray-400">Section coming soon</Text>
          </View>
        );
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
        {/* Header - Back Button & Title */}
        <View className="px-5 pt-2 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className={`w-[38px] h-[38px] rounded-xl border items-center justify-center ${isPartner ? 'bg-white border-p-border' : 'bg-white border-u-border'
              }`}
          >
            <Text className={`text-lg ${isPartner ? 'text-p-text' : 'text-u-navy'}`}>←</Text>
          </TouchableOpacity>

          <Text className={`text-lg font-bold ${isPartner ? 'text-p-text' : 'text-u-navy'}`}>
            {isPartner ? "Partner Panel" : "My Profile"}
          </Text>

          <TouchableOpacity
            className={`px-3.5 py-1.5 rounded-full ${isPartner ? 'bg-p-amber-soft' : 'bg-u-navy'
              }`}
            onPress={handleEditProfile}
          >
            <Text className={`text-xs font-semibold ${isPartner ? 'text-p-amber' : 'text-white'
              }`}>{authUser ? 'Edit' : 'Login'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <ProfileHero
            user={userData}
            isPartner={isPartner}
            onEdit={handleEditProfile}
            onPhotoUpload={handleEditProfile}
          />

          <StatsRow isPartner={isPartner} stats={isPartner ? partnerStats : userStats} />

          <ModeSwitch isPartner={isPartner} onSwitch={(val) => {
            setIsPartner(val);
            setActiveTab(val ? 'dashboard' : 'info');
          }} />

          <SectionTabs
            tabs={currentTabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isPartner={isPartner}
            tabLabels={TAB_LABELS}
            hasLeads={leads.length > 0}
          />

          {renderContent()}
        </ScrollView>
      </View>
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