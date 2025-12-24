import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/hooks/useCollection';
import { where } from 'firebase/firestore';

export default function InboxScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received');

  const { data: receivedApplications, loading: loadingReceived } = useCollection(
    'applications',
    where('recipientId', '==', user?.uid || ''),
    where('status', '==', 'pending')
  );

  const { data: sentApplications, loading: loadingSent } = useCollection(
    'applications',
    where('senderId', '==', user?.uid || ''),
    where('status', '==', 'pending')
  );

  const applications = activeTab === 'received' ? receivedApplications : sentApplications;
  const loading = activeTab === 'received' ? loadingReceived : loadingSent;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'received' && styles.activeTab]}
          onPress={() => setActiveTab('received')}
        >
          <Text>Received</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text>Sent</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.applicationCard}>
              <Text>Application for: {item.listingTitle}</Text>
              <Text>Message: {item.message}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  activeTab: {
    borderBottomColor: '#007bff',
  },
  applicationCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
});