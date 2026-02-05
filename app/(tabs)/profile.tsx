import React from 'react';
import { View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/AuthForm';
import { ProfileView } from '@/components/ProfileView';

export default function ProfileScreen() {
  const { user } = useAuth();

  if (user) {
    return <ProfileView />;
  }

  return (
    <View style={{ flex: 1 }}>
      <AuthForm />
    </View>
  );
}