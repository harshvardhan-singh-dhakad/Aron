
import React, { useEffect, useState } from 'react';
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

    // On web, we want to run the location logic but hide the map UI for now.
    // The user explicitly requested to remove the map portion but keep the background logic.
    return null;
}
