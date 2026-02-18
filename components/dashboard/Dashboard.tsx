
import React from 'react';
import { ScrollView, StyleSheet, RefreshControl, View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { DashboardHeader } from './Header';
import { MyActivity } from './MyActivity';
import { PartnerPanel } from './PartnerPanel';
import { SettingsSection } from './Settings';

export function Dashboard({ profile, onRefresh }: { profile: any, onRefresh?: () => void }) {
    const router = useRouter();

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onRefresh} />
                }
            >
                <DashboardHeader profile={profile} />
                <MyActivity />
                <PartnerPanel profile={profile} />
                <SettingsSection />
            </ScrollView>

            <Pressable
                onPress={() => router.push('/post-ad')}
                className="absolute bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full items-center justify-center shadow-2xl z-50 active:scale-95 transition-transform"
            >
                <Text className="text-white text-4xl pb-1 font-light">+</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
});
