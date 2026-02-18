
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Listing } from '../types';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface NearbyListingsMapProps {
    listings: Listing[];
}

export default function NearbyListingsMap({ listings }: NearbyListingsMapProps) {
    const router = useRouter();
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



    const mapListings = listings.map((listing, index) => {
        if (listing.latitude && listing.longitude) return listing;

        // spread listings around user location approx within 5km
        const randomLat = location.coords.latitude + (Math.random() - 0.5) * 0.05;
        const randomLng = location.coords.longitude + (Math.random() - 0.5) * 0.05;

        return {
            ...listing,
            latitude: randomLat,
            longitude: randomLng
        };
    });

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                // provider={PROVIDER_GOOGLE} native only, web defaults to standard
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
            >
                {mapListings.map((listing) => (
                    <Marker
                        key={listing.id}
                        coordinate={{
                            latitude: listing.latitude || 0,
                            longitude: listing.longitude || 0,
                        }}
                        title={listing.title}
                        description={listing.price ? `Rs. ${listing.price}` : listing.category}
                        onCalloutPress={() => router.push(`/listing/${listing.id}`)}
                    />
                ))}
            </MapView>
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
    map: {
        width: '100%',
        height: '100%',
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
