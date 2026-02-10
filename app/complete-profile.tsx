import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MapPin, User as UserIcon } from 'lucide-react-native';

export default function CompleteProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const { user, userProfile, refreshUserProfile, setUserProfile } = useAuth();

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim() || !location.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Get user ID from either user (Firebase) or userProfile (test mode)
        const userId = user?.uid || userProfile?.id;

        if (!userId) {
            Alert.alert('Error', 'You must be logged in');
            return;
        }

        setLoading(true);

        // STEP 1: Update local state IMMEDIATELY (instant UI update)
        if (userProfile) {
            setUserProfile({
                ...userProfile,
                name: name.trim(),
                location: location.trim(),
                profileCompleted: true,
            });
        }

        // STEP 2: Navigate IMMEDIATELY (don't wait for Firestore)
        router.replace('/(tabs)');

        // STEP 3: Save to Firestore in background (fire-and-forget)
        try {
            const userRef = doc(db, 'users', userId);
            const updateData = {
                name: name.trim(),
                location: location.trim(),
                profileCompleted: true,
                updatedAt: serverTimestamp(),
            };

            // Use setDoc with merge to handle both create and update
            setDoc(userRef, {
                ...updateData,
                phoneNumber: userProfile?.phoneNumber || '',
                verificationStatus: userProfile?.verificationStatus || 'none',
                isAdmin: userProfile?.isAdmin || false,
                createdAt: serverTimestamp(),
            }, { merge: true }).catch((err) => {
                console.log('Background profile save error:', err);
            });
        } catch (error) {
            console.error('Error preparing profile update:', error);
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <View style={[styles.avatarContainer, { backgroundColor: colors.card }]}>
                    <UserIcon size={48} color={colors.primary} />
                </View>
                <Text style={styles.headerTitle}>Complete Your Profile</Text>
                <Text style={styles.headerSubtitle}>
                    Add your details to get started
                </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                    <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <UserIcon size={20} color={colors.textSecondary} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Enter your full name"
                            placeholderTextColor={colors.textSecondary}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Location</Text>
                    <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <MapPin size={20} color={colors.textSecondary} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="e.g., Jaipur, Rajasthan"
                            placeholderTextColor={colors.textSecondary}
                            value={location}
                            onChangeText={setLocation}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Saving...' : 'Continue'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
    },
    header: {
        padding: 32,
        paddingTop: 80,
        alignItems: 'center',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    avatarContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    form: {
        padding: 24,
        paddingTop: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
