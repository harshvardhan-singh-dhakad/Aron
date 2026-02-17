
import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { DashboardHeader } from './Header';
import { MyActivity } from './MyActivity';
import { PartnerPanel } from './PartnerPanel';
import { SettingsSection } from './Settings';

export function Dashboard({ profile, onRefresh }: { profile: any, onRefresh?: () => void }) {
    return (
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
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
});
