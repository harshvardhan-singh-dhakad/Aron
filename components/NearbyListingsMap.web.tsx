
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Listing } from '../types';

interface NearbyListingsMapProps {
    listings: Listing[];
}

export default function NearbyListingsMap({ listings }: NearbyListingsMapProps) {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
        })();
    }, []);

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Locating you...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>
                Interactive Map Available on App
            </Text>
            <Text style={{ color: '#6b7280', textAlign: 'center', paddingHorizontal: 20, marginBottom: 16 }}>
                Map integration requires Google Maps API key for web preview.
            </Text>
            {location && (
                <Text
                    style={{ color: '#2563EB', fontWeight: 'bold', cursor: 'pointer' }}
                    onPress={() => window.open(`https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`, '_blank')}
                >
                    Open in Google Maps ↗
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 300,
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 16,
        marginBottom: 16,
    },
    loadingContainer: {
        height: 300,
        width: '100%',
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    loadingText: {
        marginTop: 8,
        color: '#6b7280',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        padding: 20,
    }
});
