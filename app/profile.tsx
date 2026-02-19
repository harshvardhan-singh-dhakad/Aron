
import { View, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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

// Mock Data (In a real app, this would come from an API/Context)
const MOCK_USER = {
  name: "Rahul Sharma",
  phone: "+91 98765 43210",
  city: "Indore, MP",
  email: "rahul@email.com",
  profession: "Electrician",
  photo: "https://api.dicebear.com/7.x/thumbs/svg?seed=rahul&backgroundColor=b6e3f4",
  rating: 4.2,
  reviews: 38,
};

const USER_STATS = { bookings: 24, saved: 12, reviews: 38 };
const PARTNER_STATS = { views: 1284, calls: 87, leads: 34, revenue: 12400 };

const MOCK_BOOKINGS = [
  { id: 1, service: "AC Repair", provider: "Suresh Kumar", date: "12 Jan 2025", amount: 800, status: "completed", myRating: 4 },
  { id: 2, service: "Plumber", provider: "Ramesh Plumbing", date: "8 Jan 2025", amount: 500, status: "completed", myRating: 0 },
  { id: 3, service: "Room Rental", provider: "Vijay Nagar Society", date: "1 Jan 2025", amount: 8000, status: "active", myRating: 0 },
  { id: 4, service: "Movers", provider: "City Packers", date: "28 Dec 2024", amount: 3500, status: "cancelled", myRating: 0 },
];

const MOCK_TRANSACTIONS = [
  { id: 1, title: "Wallet Top-up", date: "12 Jan", amount: 500, type: "cr", icon: "💳" },
  { id: 2, title: "AC Repair Payment", date: "12 Jan", amount: -800, type: "dr", icon: "🔧" },
  { id: 3, title: "Refund — Cancelled", date: "29 Dec", amount: 350, type: "cr", icon: "↩️" },
];

const MOCK_LEADS = [
  { id: 1, name: "Priya Joshi", time: "2 min ago", msg: "Mujhe aaj electrician chahiye ghar pe, AC wiring ka kaam hai.", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=priya&backgroundColor=ffdfbf" },
  { id: 2, name: "Amit Verma", time: "1 hr ago", msg: "Mere shop mein 5 extra points lagate ho kya? Rate batao.", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=amit&backgroundColor=c0aede" },
];

const MOCK_LISTINGS = [
  { title: "Electrician Service — Indore", views: 284, calls: 18, status: "active", boost: true },
  { title: "AC Wiring — ₹500 onwards", views: 156, calls: 9, status: "active", boost: false },
];

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth(); // Using real auth context for logout
  const router = useRouter();

  // State
  const [isPartner, setIsPartner] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

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

  // Render Content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoSection user={MOCK_USER} onEdit={() => { }} onLogout={logout} onDelete={() => { }} />;
      case 'activity':
        return <BookingsList bookings={MOCK_BOOKINGS} isPartner={isPartner} />;
      case 'wallet':
        return <WalletSection wallet={{ balance: 1250, pending: 300 }} transactions={MOCK_TRANSACTIONS} />;
      case 'dashboard':
        return <PartnerDashboard stats={PARTNER_STATS} leads={MOCK_LEADS} listings={MOCK_LISTINGS} onAction={() => { }} />;
      case 'leads':
        return <LeadsList leads={MOCK_LEADS} />;
      case 'listings':
        return <ListingsList listings={MOCK_LISTINGS} />;
      // For now, other tabs can just show a placeholder or reuse existing components
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
          >
            <Text className={`text-xs font-semibold ${isPartner ? 'text-p-amber' : 'text-white'
              }`}>Edit</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <ProfileHero
            user={MOCK_USER}
            isPartner={isPartner}
            onEdit={() => { }}
            onPhotoUpload={() => { }}
          />

          <StatsRow isPartner={isPartner} stats={isPartner ? PARTNER_STATS : USER_STATS} />

          <ModeSwitch isPartner={isPartner} onSwitch={(val) => {
            setIsPartner(val);
            setActiveTab(val ? 'dashboard' : 'info');
          }} />

          <SectionTabs
            tabs={currentTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isPartner={isPartner}
            tabLabels={TAB_LABELS}
            hasLeads={MOCK_LEADS.length > 0}
          />

          {renderContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}