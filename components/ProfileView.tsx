
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useDoc } from '../hooks/useDoc';
import { OnboardingFlow } from './onboarding/OnboardingFlow';
import { Dashboard } from './dashboard/Dashboard';

export function ProfileView() {
  const { user } = useAuth();
  const { data: profile, loading: profileLoading } = useDoc('users', user!.uid);

  if (profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // If no profile data or not verified/onboarded completely, show onboarding
  // Assuming 'onboardingCompleted' flag is set in Step 4
  if (!profile || !profile.onboardingCompleted) {
    return <OnboardingFlow onComplete={() => { }} />;
  }

  return <Dashboard profile={profile} />;
}