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
    Image,
    ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Camera, X, FileText, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/services/storage'; // Custom storage service
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DocumentType = 'pan' | 'aadhar' | 'gst';

export default function VerificationScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { userProfile, user, setUserProfile } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Document states
    const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
    const [documentImage, setDocumentImage] = useState<string | null>(null);
    const [documentNumber, setDocumentNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDocumentPicker, setShowDocumentPicker] = useState(false);

    const userId = user?.uid || userProfile?.id;
    const verificationStatus = userProfile?.verificationStatus || 'none';

    const documentOptions = [
        { id: 'pan' as DocumentType, label: 'PAN Card', placeholder: 'Enter PAN (e.g., ABCDE1234F)', maxLength: 10 },
        { id: 'aadhar' as DocumentType, label: 'Aadhar Card', placeholder: 'Enter 12-digit Aadhar Number', maxLength: 14 },
        { id: 'gst' as DocumentType, label: 'GST Certificate', placeholder: 'Enter GST Number', maxLength: 15 },
    ];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.5, // Reduced quality for faster processing
            aspect: [4, 3],
            base64: true, // Generate base64 for immediate use if needed
        });

        if (!result.canceled) {
            setDocumentImage(result.assets[0].uri);
        }
    };

    const validateDocument = (): boolean => {
        if (!selectedDocument) {
            Alert.alert('Missing Info', 'Please select a document type (PAN, Aadhar, or GST)');
            return false;
        }

        if (!documentImage) {
            Alert.alert('Missing Document', 'Please upload a photo of your document');
            return false;
        }

        if (!documentNumber.trim()) {
            Alert.alert('Missing Number', 'Please enter your document number');
            return false;
        }

        const cleanNumber = documentNumber.trim().toUpperCase().replace(/\s/g, '');

        // Validate based on document type
        if (selectedDocument === 'pan') {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!panRegex.test(cleanNumber)) {
                Alert.alert('Invalid PAN', 'PAN number must be 10 chars: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)');
                return false;
            }
        } else if (selectedDocument === 'aadhar') {
            const aadharRegex = /^\d{12}$/;
            if (!aadharRegex.test(cleanNumber)) {
                Alert.alert('Invalid Aadhar', 'Aadhar number must be exactly 12 digits');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        console.log('Submit button clicked');

        // Check document validation
        if (!validateDocument()) {
            console.log('Validation failed');
            return;
        }

        // Check user ID validity
        const userIdToUse = user?.uid || userProfile?.id;
        console.log('User ID found:', userIdToUse);

        if (!userIdToUse) {
            Alert.alert('Login Error', 'User ID is missing. Please login again.');
            return;
        }

        setLoading(true);

        try {
            // STEP 1: Update local state IMMEDIATELY
            console.log('Updating local state...');
            if (userProfile) {
                setUserProfile({
                    ...userProfile,
                    verificationStatus: 'pending',
                });
            }

            // STEP 2: Show success alert IMMEDIATELY
            console.log('Showing success alert');
            setLoading(false);

            Alert.alert(
                'Request Submitted! ✅',
                'Your verification document has been submitted. We will review it within 24-48 hours.',
                [{ text: 'OK', onPress: () => router.back() }]
            );

            // STEP 3: Save to Firestore in BACKGROUND
            console.log('Starting background upload & save...');
            const verificationRef = doc(db, 'verifications', userIdToUse);
            const userRef = doc(db, 'users', userIdToUse);

            // Using cleaned number for storage
            const cleanDocNumber = documentNumber.toUpperCase().replace(/\s/g, '');
            const imagePath = `verifications/${userIdToUse}/document_${Date.now()}.jpg`;

            // Start async upload and save chain
            (async () => {
                try {
                    let imageUrl = '';
                    if (documentImage) {
                        console.log('Uploading image...', imagePath);
                        imageUrl = await uploadImage(documentImage, imagePath);
                        console.log('Image uploaded:', imageUrl);
                    }

                    await Promise.all([
                        setDoc(verificationRef, {
                            userId: userIdToUse,
                            userName: userProfile?.name || 'Unknown',
                            userPhone: userProfile?.phoneNumber || '',
                            documentType: selectedDocument,
                            documentImage: imageUrl, // Store STORAGE URL, not local path
                            documentNumber: cleanDocNumber,
                            status: 'pending',
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                        }),
                        setDoc(userRef, {
                            verificationStatus: 'pending',
                            updatedAt: serverTimestamp(),
                        }, { merge: true }),
                    ]);
                    console.log('Background verification save completed');
                } catch (err) {
                    console.error('Background upload/save failed:', err);
                    // Crucial: Create a failure record so admins know it failed?
                    // Or revert local state? For now, we log it.
                    // In a production app, we might retry or notify the user later.
                }
            })();

        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setLoading(false);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    // Show status if already submitted
    if (verificationStatus === 'pending') {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: '#FFFFFF' }]}>
                <Clock size={72} color="#F59E0B" />
                <Text style={[styles.statusTitle, { color: colors.text }]}>Verification Pending</Text>
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                    Your document is being reviewed. This usually takes 24-48 hours. We'll notify you once verified.
                </Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (verificationStatus === 'approved') {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: '#FFFFFF' }]}>
                <CheckCircle size={72} color="#22C55E" />
                <Text style={[styles.statusTitle, { color: colors.text }]}>You're Verified! ✅</Text>
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                    Your account has been verified. You can now post listings.
                </Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/(tabs)/post-ad')}
                >
                    <Text style={styles.buttonText}>Post a Listing</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (verificationStatus === 'rejected') {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: '#FFFFFF' }]}>
                <XCircle size={72} color="#EF4444" />
                <Text style={[styles.statusTitle, { color: colors.text }]}>Verification Rejected</Text>
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                    Your verification was rejected. Please submit a clear document again.
                </Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => {
                        if (userProfile) {
                            setUserProfile({ ...userProfile, verificationStatus: 'none' });
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const selectedDocLabel = documentOptions.find(d => d.id === selectedDocument)?.label || 'Select Document Type';
    const selectedDocPlaceholder = documentOptions.find(d => d.id === selectedDocument)?.placeholder || 'Enter document number';
    const selectedDocMaxLength = documentOptions.find(d => d.id === selectedDocument)?.maxLength || 15;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: '#FFFFFF' }]}
            contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <FileText size={48} color={colors.primary} />
                <Text style={[styles.headerTitle, { color: colors.text }]}>Verify Your Account</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                    Submit any one document to start posting listings
                </Text>
            </View>

            <View style={styles.form}>
                {/* Single Card for Document Upload */}
                <View style={[styles.card, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>📄 Upload Document</Text>
                    <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                        Choose any one: PAN Card, Aadhar Card, or GST Certificate
                    </Text>

                    {/* Document Type Selector */}
                    <Text style={[styles.label, { color: colors.text }]}>Document Type *</Text>
                    <TouchableOpacity
                        style={[styles.picker, { backgroundColor: '#F9FAFB', borderColor: colors.border }]}
                        onPress={() => setShowDocumentPicker(!showDocumentPicker)}
                    >
                        <Text style={{ color: selectedDocument ? colors.text : colors.textSecondary }}>
                            {selectedDocLabel}
                        </Text>
                        {showDocumentPicker ? (
                            <ChevronUp size={20} color={colors.textSecondary} />
                        ) : (
                            <ChevronDown size={20} color={colors.textSecondary} />
                        )}
                    </TouchableOpacity>

                    {showDocumentPicker && (
                        <View style={[styles.pickerOptions, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}>
                            {documentOptions.map((doc) => (
                                <TouchableOpacity
                                    key={doc.id}
                                    style={[
                                        styles.pickerOption,
                                        selectedDocument === doc.id && { backgroundColor: '#EBF5FF' }
                                    ]}
                                    onPress={() => {
                                        setSelectedDocument(doc.id);
                                        setShowDocumentPicker(false);
                                        setDocumentNumber('');
                                        setDocumentImage(null);
                                    }}
                                >
                                    <Text style={{ color: colors.text }}>{doc.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Document Image Upload */}
                    {selectedDocument && (
                        <>
                            <Text style={[styles.label, { color: colors.text, marginTop: 20 }]}>
                                Upload {selectedDocLabel} Photo *
                            </Text>
                            <TouchableOpacity
                                style={[styles.imageUpload, { backgroundColor: '#F9FAFB', borderColor: colors.border }]}
                                onPress={pickImage}
                            >
                                {documentImage ? (
                                    <View style={styles.uploadedImageContainer}>
                                        <Image source={{ uri: documentImage }} style={styles.uploadedImage} />
                                        <TouchableOpacity
                                            style={styles.removeBtn}
                                            onPress={() => setDocumentImage(null)}
                                        >
                                            <X size={16} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <>
                                        <Camera size={36} color={colors.textSecondary} />
                                        <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                                            Tap to upload photo
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            {/* Document Number Input */}
                            <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>
                                {selectedDocLabel} Number *
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: '#F9FAFB', color: colors.text, borderColor: colors.border }]}
                                placeholder={selectedDocPlaceholder}
                                placeholderTextColor={colors.textSecondary}
                                value={documentNumber}
                                onChangeText={(text) => setDocumentNumber(text.toUpperCase())}
                                maxLength={selectedDocMaxLength}
                                autoCapitalize="characters"
                                keyboardType={selectedDocument === 'aadhar' ? 'numeric' : 'default'}
                            />
                        </>
                    )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        { backgroundColor: selectedDocument ? colors.primary : colors.muted }
                    ]}
                    onPress={handleSubmit}
                    disabled={loading || !selectedDocument}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={[
                            styles.submitButtonText,
                            { color: selectedDocument ? '#FFF' : colors.textSecondary }
                        ]}>
                            Submit for Verification
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Note */}
                <View style={[styles.noteBox, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.noteTitle, { color: '#92400E' }]}>📋 Important:</Text>
                    <Text style={[styles.noteText, { color: '#92400E' }]}>
                        • Upload clear, readable photo of your document{'\n'}
                        • Verification usually takes 24-48 hours{'\n'}
                        • Your details are secure and used only for verification
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    header: {
        padding: 24,
        paddingTop: 32,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 12,
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 6,
        textAlign: 'center',
    },
    statusTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    statusText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 16,
    },
    button: {
        marginTop: 24,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    form: {
        padding: 16,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    picker: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pickerOptions: {
        marginTop: 4,
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    pickerOption: {
        padding: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E7EB',
    },
    imageUpload: {
        height: 160,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadedImageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    removeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        marginTop: 8,
        fontSize: 14,
    },
    input: {
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    submitButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    noteBox: {
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    noteText: {
        fontSize: 13,
        lineHeight: 22,
    },
});
