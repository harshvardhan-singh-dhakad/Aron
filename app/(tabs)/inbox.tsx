import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/hooks/useCollection';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { router } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';

type Application = {
  id: string;
  listingId: string;
  listingTitle: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
  applicantName: string;
  ownerId: string;
  applicantId: string;
};

const mockReceived = [
  {
    id: '1',
    listingId: '1',
    listingTitle: 'Plumber Needed',
    status: 'pending' as const,
    createdAt: new Date(),
    applicantName: 'John Doe',
    ownerId: 'user1',
    applicantId: 'user2',
  },
  {
    id: '2',
    listingId: '2',
    listingTitle: 'Software Developer Job',
    status: 'accepted' as const,
    createdAt: new Date(),
    applicantName: 'Jane Smith',
    ownerId: 'user1',
    applicantId: 'user3',
  },
];

const mockSent = [
  {
    id: '3',
    listingId: '3',
    listingTitle: 'Apartment for Rent',
    status: 'pending' as const,
    createdAt: new Date(),
    applicantName: 'Current User',
    ownerId: 'user3',
    applicantId: 'user1',
  },
];

function ApplicationCard({ application }: { application: Application }) {
  const postedAt = application.createdAt ? formatDistanceToNow(application.createdAt.toDate(), { addSuffix: true }) : '...';

  const statusClasses = {
    pending: styles.pending,
    accepted: styles.accepted,
    rejected: styles.rejected,
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.label}>Application for:</Text>
          <TouchableOpacity onPress={() => router.push(`/listing/${application.listingId}`)}>
            <Text style={styles.cardTitle}>{application.listingTitle}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.status, statusClasses[application.status]]}>
          <Text style={styles.statusText}>{application.status}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>Applied by: {application.applicantName}</Text>
        <Text style={styles.footerText}>{postedAt}</Text>
      </View>
    </View>
  );
}

function SentApplicationCard({ application }: { application: Application }) {
  const postedAt = application.createdAt ? formatDistanceToNow(application.createdAt.toDate(), { addSuffix: true }) : '...';

  const statusClasses = {
    pending: styles.pending,
    accepted: styles.accepted,
    rejected: styles.rejected,
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.label}>Your application for:</Text>
          <TouchableOpacity onPress={() => router.push(`/listing/${application.listingId}`)}>
            <Text style={styles.cardTitle}>{application.listingTitle}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.status, statusClasses[application.status]]}>
          <Text style={styles.statusText}>{application.status}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>Status updated {postedAt}</Text>
        <TouchableOpacity onPress={() => router.push(`/listing/${application.listingId}`)} style={styles.viewLink}>
          <Text style={styles.viewText}>View Listing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function InboxScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received');

  const receivedQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(db, 'applications'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [user]);

  const sentQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(db, 'applications'),
      where('applicantId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [user]);

  const { data: receivedApps, loading: isLoadingReceived } = useCollection<Application>(receivedQuery);
  const { data: sentApps, loading: isLoadingSent } = useCollection<Application>(sentQuery);

  const displayReceived = receivedApps && receivedApps.length > 0 ? receivedApps : mockReceived;
  const displaySent = sentApps && sentApps.length > 0 ? sentApps : mockSent;

  const applications = activeTab === 'received' ? displayReceived : displaySent;
  const loading = activeTab === 'received' ? isLoadingReceived : isLoadingSent;

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Please log in to view your inbox.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>📬</Text>
        <Text style={styles.title}>Inbox</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'received' && styles.activeTab]}
          onPress={() => setActiveTab('received')}
        >
          <Text style={[styles.tabText, activeTab === 'received' && styles.activeTabText]}>Received</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>Sent</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {applications && applications.length > 0 ? (
            applications.map(app => activeTab === 'received' ? <ApplicationCard key={app.id} application={app} /> : <SentApplicationCard key={app.id} application={app} />)
          ) : (
            <Text style={styles.empty}>You have not {activeTab === 'received' ? 'received' : 'sent'} any applications yet.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  activeTab: {
    borderBottomColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pending: {
    backgroundColor: '#fff3cd',
  },
  accepted: {
    backgroundColor: '#d4edda',
  },
  rejected: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
  viewLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    paddingTop: 32,
  },
});