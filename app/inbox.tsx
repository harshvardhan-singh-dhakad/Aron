
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Application } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, ArrowRight } from 'lucide-react-native';
import { useCollection } from '../hooks/useCollection';
import { where, orderBy } from 'firebase/firestore';

export default function InboxPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const router = useRouter();

  // Query constraints based on active tab
  const constraints = user ? (
    activeTab === 'received'
      ? [where('ownerId', '==', user.uid), orderBy('appliedAt', 'desc')]
      : [where('applicantId', '==', user.uid), orderBy('appliedAt', 'desc')]
  ) : [];

  const { data: applications, loading } = useCollection('applications', ...constraints);

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white p-6">
        <View className="bg-gray-100 p-6 rounded-full mb-6">
          <Mail size={48} color="#9CA3AF" />
        </View>
        <Text className="text-xl font-bold mb-2 text-center text-gray-900">Inbox is Locked</Text>
        <Text className="text-gray-500 mb-8 text-center px-6">Please log in to view your messages and applications.</Text>
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          className="bg-black px-8 py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          <Text className="text-white font-bold text-lg">Go to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const formatDate = (date: any) => {
    if (!date) return '';
    return date.toDate ? date.toDate().toLocaleDateString() : new Date(date).toLocaleDateString();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="pt-2 pb-0 bg-white">
        <Text className="text-3xl font-bold mb-6 px-4 text-gray-900">Inbox</Text>
        <View className="flex-row border-b border-gray-100 px-4">
          <TouchableOpacity
            onPress={() => setActiveTab('received')}
            className={`flex-1 pb-4 items-center border-b-2 ${activeTab === 'received' ? 'border-black' : 'border-transparent'}`}
          >
            <Text className={`font-bold text-base ${activeTab === 'received' ? 'text-black' : 'text-gray-400'}`}>Received</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('sent')}
            className={`flex-1 pb-4 items-center border-b-2 ${activeTab === 'sent' ? 'border-black' : 'border-transparent'}`}
          >
            <Text className={`font-bold text-base ${activeTab === 'sent' ? 'text-black' : 'text-gray-400'}`}>Sent</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <ScrollView className="flex-1 p-4 bg-gray-50" showsVerticalScrollIndicator={false}>
          {applications.length === 0 ? (
            <View className="items-center justify-center py-20">
              <View className="bg-white p-6 rounded-full mb-4 shadow-sm">
                <Mail size={32} color="#D1D5DB" />
              </View>
              <Text className="text-center text-gray-500 text-lg font-medium">No messages found</Text>
              <Text className="text-center text-gray-400 mt-2 text-sm">
                {activeTab === 'sent' ? "You haven't applied to any listings yet." : "No one has applied to your listings yet."}
              </Text>
            </View>
          ) : (
            applications.map((app: any) => (
              <TouchableOpacity
                key={app.id}
                className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100 flex-row items-center active:bg-gray-50 transition-colors"
                onPress={() => router.push(`/listing/${app.listingId}`)}
              >
                <View className="flex-1">
                  <Text className="font-bold text-lg mb-1 text-gray-900" numberOfLines={1}>{app.listingTitle}</Text>
                  <Text className="text-xs text-gray-400 mb-2">Application ID: #{app.id.substring(0, 8)}</Text>
                  <View className="flex-row items-center">
                    <View className={`px-2 py-1 rounded-md mr-2 ${app.status === 'accepted' ? 'bg-green-100' :
                      app.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                      <Text className={`text-xs font-bold uppercase tracking-wide ${app.status === 'accepted' ? 'text-green-700' :
                        app.status === 'rejected' ? 'text-red-700' : 'text-yellow-700'
                        }`}>
                        {app.status}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-400 font-medium">
                      {formatDate(app.appliedAt)}
                    </Text>
                  </View>
                </View>
                <ArrowRight size={20} color="#D1D5DB" />
              </TouchableOpacity>
            ))
          )}
          <View className="h-24" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
