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
    Platform,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { ListingCategory, SubCategories } from '@/types';
import { Camera, X, ChevronDown, AlertCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PostAdScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { userProfile, user } = useAuth();
    const router = useRouter();

    const [category, setCategory] = useState<ListingCategory | null>(null);
    const [subCategory, setSubCategory] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState<string[]>([]);

    // Category-specific fields
    const [salary, setSalary] = useState('');
    const [salaryType, setSalaryType] = useState<'monthly' | 'daily' | 'hourly'>('monthly');
    const [price, setPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState<'hour' | 'day' | 'week' | 'month'>('day');
    const [condition, setCondition] = useState<'new' | 'like-new' | 'used'>('used');
    const [negotiable, setNegotiable] = useState(false);

    // Business-specific fields
    const [businessName, setBusinessName] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');

    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showSubCategoryPicker, setShowSubCategoryPicker] = useState(false);

    // Check if user is verified
    const isVerified = userProfile?.verificationStatus === 'approved';

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: 5 - images.length,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            setImages([...images, ...newImages].slice(0, 5));
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!category || !title || !description || !location) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        // In real app, this would save to Firestore
        Alert.alert(
            'Success',
            'Your listing has been submitted for review. It will be visible once approved.',
            [{ text: 'OK', onPress: () => router.back() }]
        );
    };

    // If user not logged in
    if (!user) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                <AlertCircle size={64} color={colors.primary} />
                <Text style={[styles.warningTitle, { color: colors.text }]}>Login Required</Text>
                <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                    Please login to post an ad
                </Text>
                <TouchableOpacity
                    style={[styles.loginButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // If user not verified
    if (!isVerified) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                <AlertCircle size={64} color={colors.destructive} />
                <Text style={[styles.warningTitle, { color: colors.text }]}>Verification Required</Text>
                <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                    Only verified users can post listings. Please complete your verification from your profile.
                </Text>
                <TouchableOpacity
                    style={[styles.loginButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/profile')}
                >
                    <Text style={styles.loginButtonText}>Go to Profile</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const categories: { id: ListingCategory; label: string }[] = [
        { id: 'jobs', label: 'Jobs' },
        { id: 'services', label: 'Services' },
        { id: 'buy-sell', label: 'Buy & Sell' },
        { id: 'rent', label: 'Rent' },
        { id: 'business', label: 'Business' },
    ];

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.form}>
                {/* Category Selector */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
                    <TouchableOpacity
                        style={[styles.picker, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                    >
                        <Text style={{ color: category ? colors.text : colors.textSecondary }}>
                            {category ? categories.find(c => c.id === category)?.label : 'Select category'}
                        </Text>
                        <ChevronDown size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                    {showCategoryPicker && (
                        <View style={[styles.pickerOptions, { backgroundColor: colors.card }]}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={styles.pickerOption}
                                    onPress={() => {
                                        setCategory(cat.id);
                                        setSubCategory('');
                                        setShowCategoryPicker(false);
                                    }}
                                >
                                    <Text style={{ color: colors.text }}>{cat.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Sub-Category Selector */}
                {category && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Sub-Category *</Text>
                        <TouchableOpacity
                            style={[styles.picker, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => setShowSubCategoryPicker(!showSubCategoryPicker)}
                        >
                            <Text style={{ color: subCategory ? colors.text : colors.textSecondary }}>
                                {subCategory || 'Select sub-category'}
                            </Text>
                            <ChevronDown size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                        {showSubCategoryPicker && (
                            <View style={[styles.pickerOptions, { backgroundColor: colors.card }]}>
                                {SubCategories[category].map((sub) => (
                                    <TouchableOpacity
                                        key={sub}
                                        style={styles.pickerOption}
                                        onPress={() => {
                                            setSubCategory(sub);
                                            setShowSubCategoryPicker(false);
                                        }}
                                    >
                                        <Text style={{ color: colors.text }}>{sub}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* Title */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                        placeholder="Enter a descriptive title"
                        placeholderTextColor={colors.textSecondary}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Description */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
                    <TextInput
                        style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                        placeholder="Describe your listing in detail"
                        placeholderTextColor={colors.textSecondary}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {/* Location */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Location *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                        placeholder="e.g., Jaipur, Rajasthan"
                        placeholderTextColor={colors.textSecondary}
                        value={location}
                        onChangeText={setLocation}
                    />
                </View>

                {/* Category-specific fields */}
                {category === 'jobs' && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Salary *</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                            placeholder="e.g., 15000"
                            placeholderTextColor={colors.textSecondary}
                            value={salary}
                            onChangeText={setSalary}
                            keyboardType="numeric"
                        />
                    </View>
                )}

                {category === 'rent' && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Price per Day *</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                            placeholder="e.g., 2000"
                            placeholderTextColor={colors.textSecondary}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                        />
                    </View>
                )}

                {category === 'buy-sell' && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Price *</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                            placeholder="e.g., 5000"
                            placeholderTextColor={colors.textSecondary}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                        />
                    </View>
                )}

                {category === 'services' && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Rate per Hour</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                            placeholder="e.g., 500"
                            placeholderTextColor={colors.textSecondary}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                        />
                    </View>
                )}

                {category === 'business' && (
                    <>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Business Name *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                placeholder="e.g., Sharma General Store"
                                placeholderTextColor={colors.textSecondary}
                                value={businessName}
                                onChangeText={setBusinessName}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Contact Number *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                placeholder="e.g., 9876543210"
                                placeholderTextColor={colors.textSecondary}
                                value={contactNumber}
                                onChangeText={setContactNumber}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Full Address *</Text>
                            <TextInput
                                style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                placeholder="Shop address with landmark"
                                placeholderTextColor={colors.textSecondary}
                                value={address}
                                onChangeText={setAddress}
                                multiline
                                numberOfLines={2}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Opening Hours</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                placeholder="e.g., 9 AM - 9 PM"
                                placeholderTextColor={colors.textSecondary}
                                value={openingHours}
                                onChangeText={setOpeningHours}
                            />
                        </View>
                    </>
                )}

                {/* Images */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Images (up to 5)</Text>
                    <View style={styles.imagesContainer}>
                        {images.map((uri, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri }} style={styles.imagePreview} />
                                <TouchableOpacity
                                    style={[styles.removeImageBtn, { backgroundColor: colors.destructive }]}
                                    onPress={() => removeImage(index)}
                                >
                                    <X size={14} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        {images.length < 5 && (
                            <TouchableOpacity
                                style={[styles.addImageBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
                                onPress={pickImage}
                            >
                                <Camera size={24} color={colors.textSecondary} />
                                <Text style={[styles.addImageText, { color: colors.textSecondary }]}>Add</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: colors.primary }]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Submit for Review</Text>
                </TouchableOpacity>
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
    warningTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    warningText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    loginButton: {
        marginTop: 24,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    form: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    textArea: {
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        minHeight: 100,
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
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    pickerOption: {
        padding: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    imageWrapper: {
        position: 'relative',
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeImageBtn: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageBtn: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageText: {
        fontSize: 12,
        marginTop: 4,
    },
    submitButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 32,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
