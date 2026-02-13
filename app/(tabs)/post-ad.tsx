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
    ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ListingCategory, SubCategories } from '@/types';
import { Camera, X, ChevronDown, AlertCircle, CheckCircle, MapPin, IndianRupee } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { createListing, getListingById, updateListing } from '@/lib/services/listings';

type SalaryType = 'monthly' | 'daily' | 'hourly';
type PriceUnit = 'hour' | 'day' | 'week' | 'month';
type Condition = 'new' | 'like-new' | 'used' | 'for-parts';
type JobType = 'full-time' | 'part-time' | 'contract';

// =====================================================
// These components MUST be outside the main component
// to avoid re-mounting on every keystroke (keyboard dismiss bug)
// =====================================================

const FormInput = ({
    label: inputLabel,
    placeholder,
    value,
    onChangeText,
    error,
    keyboardType = 'default',
    multiline = false,
    icon,
    maxLength,
    colors,
}: {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    keyboardType?: 'default' | 'numeric' | 'phone-pad';
    multiline?: boolean;
    icon?: React.ReactNode;
    maxLength?: number;
    colors: any;
}) => (
    <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>{inputLabel}</Text>
        <View style={{ position: 'relative' }}>
            {icon && <View style={styles.inputIcon}>{icon}</View>}
            <TextInput
                style={[
                    multiline ? styles.textArea : styles.input,
                    {
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderColor: error ? colors.destructive : colors.border,
                        paddingLeft: icon ? 44 : 14,
                    },
                ]}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                textAlignVertical={multiline ? 'top' : 'center'}
                maxLength={maxLength}
            />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
);

const ChipSelector = ({
    options,
    selected,
    onSelect,
    label,
    colors,
}: {
    options: { value: string; label: string }[];
    selected: string;
    onSelect: (val: any) => void;
    label: string;
    colors: any;
}) => (
    <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <View style={styles.chipRow}>
            {options.map(opt => (
                <TouchableOpacity
                    key={opt.value}
                    style={[
                        styles.chip,
                        {
                            backgroundColor: selected === opt.value ? colors.primary : colors.card,
                            borderColor: selected === opt.value ? colors.primary : colors.border,
                        },
                    ]}
                    onPress={() => onSelect(opt.value)}
                >
                    <Text
                        style={[
                            styles.chipText,
                            { color: selected === opt.value ? '#FFF' : colors.text },
                        ]}
                    >
                        {opt.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

// =====================================================
// Main component
// =====================================================

export default function PostAdScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { userProfile, user } = useAuth();
    const router = useRouter();
    const { editId } = useLocalSearchParams<{ editId: string }>();

    // Common fields
    const [category, setCategory] = useState<ListingCategory | null>(null);
    const [subCategory, setSubCategory] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState(userProfile?.location || '');
    const [images, setImages] = useState<string[]>([]);

    // Jobs fields
    const [salary, setSalary] = useState('');
    const [salaryType, setSalaryType] = useState<SalaryType>('monthly');
    const [jobType, setJobType] = useState<JobType>('full-time');
    const [experience, setExperience] = useState('');

    // Buy-Sell fields
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState<Condition>('used');
    const [negotiable, setNegotiable] = useState(false);

    // Rent fields
    const [rentPrice, setRentPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState<PriceUnit>('day');

    // Services fields
    const [ratePerHour, setRatePerHour] = useState('');
    const [availability, setAvailability] = useState('');

    // Business fields
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [contactNumber, setContactNumber] = useState(userProfile?.phoneNumber?.replace('+91', '') || '');
    const [website, setWebsite] = useState('');
    const [address, setAddress] = useState('');

    // UI state
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showSubCategoryPicker, setShowSubCategoryPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load listing for edit
    React.useEffect(() => {
        if (editId) {
            loadListingForEdit(editId);
        }
    }, [editId]);

    const loadListingForEdit = async (id: string) => {
        setLoading(true);
        try {
            const data = await getListingById(id);
            if (data) {
                if (data.ownerId !== user?.uid) {
                    showAlert('Error', 'You do not have permission to edit this listing');
                    router.back();
                    return;
                }

                // Populate fields
                setCategory(data.category);
                setSubCategory(data.subCategory);
                setTitle(data.title);
                setDescription(data.description);
                setLocation(data.location);
                setImages(data.images || []);

                // Category specific
                if (data.category === 'jobs') {
                    setSalary(data.salary?.toString() || '');
                    setSalaryType(data.salaryType as SalaryType || 'monthly');
                    setJobType(data.jobType as JobType || 'full-time');
                    setExperience(data.experience || '');
                } else if (data.category === 'buy-sell') {
                    setPrice(data.price?.toString() || '');
                    setCondition(data.condition as Condition || 'used');
                    setNegotiable(data.negotiable || false);
                } else if (data.category === 'rent') {
                    setRentPrice(data.pricePerUnit?.toString() || '');
                    setPriceUnit(data.priceUnit as PriceUnit || 'day');
                } else if (data.category === 'services') {
                    setRatePerHour(data.ratePerHour?.toString() || '');
                    setAvailability(data.availability || '');
                } else if (data.category === 'business') {
                    setBusinessName(data.businessName || '');
                    setBusinessType(data.businessType || ''); // Note: listing type has businessType? baseListing doesn't explicitly have it in some versions, check types. Assuming it's subCategory or separate
                    setOpeningHours(data.openingHours || '');
                    setContactNumber(data.contactNumber || '');
                    setWebsite(data.website || '');
                    setAddress(data.address || '');
                }
            }
        } catch (error) {
            console.error('Error loading listing:', error);
            showAlert('Error', 'Failed to load listing for editing');
        } finally {
            setLoading(false);
        }
    };

    const isVerified = userProfile?.verificationStatus === 'approved';

    const showAlert = (titleText: string, message: string, onOk?: () => void) => {
        if (Platform.OS === 'web') {
            window.alert(`${titleText}\n\n${message}`);
            onOk?.();
        } else {
            Alert.alert(titleText, message, [{ text: 'OK', onPress: onOk }]);
        }
    };

    const clearError = (key: string) => {
        if (errors[key]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsMultipleSelection: true,
                quality: 0.7,
                selectionLimit: 5 - images.length,
            });

            if (!result.canceled) {
                const newImages = result.assets.map(asset => asset.uri);
                setImages(prev => [...prev, ...newImages].slice(0, 5));
                clearError('images');
            }
        } catch (error) {
            console.error('Image picker error:', error);
            showAlert('Error', 'Failed to pick images. Please try again.');
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!category) newErrors.category = 'Category select karein';
        if (!subCategory) newErrors.subCategory = 'Sub-category select karein';
        if (!title.trim()) newErrors.title = 'Title likhein';
        else if (title.trim().length < 5) newErrors.title = 'Title kam se kam 5 characters ka hona chahiye';
        if (!description.trim()) newErrors.description = 'Description likhein';
        else if (description.trim().length < 10) newErrors.description = 'Description kam se kam 10 characters ki honi chahiye';
        if (!location.trim()) newErrors.location = 'Location daalo';
        if (images.length === 0) newErrors.images = 'Kam se kam ek image lagao';

        if (category === 'jobs') {
            if (!salary.trim()) newErrors.salary = 'Salary amount daalo';
        }
        if (category === 'buy-sell') {
            if (!price.trim()) newErrors.price = 'Price daalo';
        }
        if (category === 'rent') {
            if (!rentPrice.trim()) newErrors.rentPrice = 'Rent price daalo';
        }
        if (category === 'business') {
            if (!businessName.trim()) newErrors.businessName = 'Business name daalo';
            if (!contactNumber.trim()) newErrors.contactNumber = 'Contact number daalo';
            if (!address.trim()) newErrors.address = 'Address daalo';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            showAlert('Form Incomplete', 'Please fill all required fields marked with *');
            return;
        }

        const userId = user?.uid || userProfile?.id;
        if (!userId) {
            showAlert('Error', 'You must be logged in');
            return;
        }

        setLoading(true);
        try {
            const baseData: any = {
                title: title.trim(),
                description: description.trim(),
                category: category!,
                subCategory,
                location: location.trim(),
                ownerId: userId,
                ownerName: userProfile?.name || '',
                ownerPhone: userProfile?.phoneNumber || '',
                ownerVerified: isVerified,
            };

            if (category === 'jobs') {
                baseData.salary = parseInt(salary) || 0;
                baseData.salaryType = salaryType;
                baseData.jobType = jobType;
                baseData.experience = experience.trim();
            } else if (category === 'buy-sell') {
                baseData.price = parseInt(price) || 0;
                baseData.condition = condition;
                baseData.negotiable = negotiable;
            } else if (category === 'rent') {
                baseData.pricePerUnit = parseInt(rentPrice) || 0;
                baseData.priceUnit = priceUnit;
            } else if (category === 'services') {
                baseData.ratePerHour = parseInt(ratePerHour) || 0;
                baseData.availability = availability.trim();
            } else if (category === 'business') {
                baseData.businessName = businessName.trim();
                baseData.businessType = subCategory;
                baseData.openingHours = openingHours.trim();
                baseData.contactNumber = contactNumber.trim();
                baseData.website = website.trim();
                baseData.address = address.trim();
            }



            let resultId: string | boolean | null;
            if (editId) {
                // Filter images
                const existingImages = images.filter(img => img.startsWith('http') || img.startsWith('https'));
                const newImages = images.filter(img => !img.startsWith('http') && !img.startsWith('https'));

                resultId = await updateListing(editId, baseData, newImages, existingImages);
            } else {
                resultId = await createListing(baseData, images);
            }

            if (resultId) {
                setSubmitted(true);
            } else {
                showAlert('Error', `Listing ${editId ? 'update' : 'submit'} karne mein error aaya. Please try again.`);
            }
        } catch (error) {
            console.error('Error submitting listing:', error);
            showAlert('Error', 'Failed to submit listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCategory(null);
        setSubCategory('');
        setTitle('');
        setDescription('');
        setLocation(userProfile?.location || '');
        setImages([]);
        setSalary('');
        setSalaryType('monthly');
        setJobType('full-time');
        setExperience('');
        setPrice('');
        setCondition('used');
        setNegotiable(false);
        setRentPrice('');
        setPriceUnit('day');
        setRatePerHour('');
        setAvailability('');
        setBusinessName('');
        setBusinessType('');
        setOpeningHours('');
        setContactNumber(userProfile?.phoneNumber?.replace('+91', '') || '');
        setWebsite('');
        setAddress('');
        setErrors({});
        setSubmitted(false);
    };

    // ---- Not logged in ----
    const isLoggedIn = user || userProfile;
    if (!isLoggedIn) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                <AlertCircle size={64} color={colors.primary} />
                <Text style={[styles.warningTitle, { color: colors.text }]}>Login Required</Text>
                <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                    Please login to post an ad
                </Text>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={styles.actionButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ---- Not verified ----
    if (!isVerified) {
        const isPending = userProfile?.verificationStatus === 'pending';
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                <AlertCircle size={64} color={isPending ? colors.warning : colors.destructive} />
                <Text style={[styles.warningTitle, { color: colors.text }]}>
                    {isPending ? 'Verification Pending' : 'Verification Required'}
                </Text>
                <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                    {isPending
                        ? 'Your documents are being reviewed. We will notify you once approved.'
                        : 'Listing post karne ke liye pehle PAN Card aur Aadhar Card verify karwao.'}
                </Text>
                {!isPending && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={() => router.push('/verification')}
                    >
                        <Text style={styles.actionButtonText}>Get Verified</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.muted, marginTop: 12 }]}
                    onPress={() => router.back()}
                >
                    <Text style={[styles.actionButtonText, { color: colors.text }]}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ---- Success screen ----
    if (submitted) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
                <View style={[styles.successCircle, { backgroundColor: colors.success + '20' }]}>
                    <CheckCircle size={72} color={colors.success} />
                </View>
                <Text style={[styles.successTitle, { color: colors.text }]}>Listing Submitted! 🎉</Text>
                <Text style={[styles.successText, { color: colors.textSecondary }]}>
                    Aapki listing review ke liye submit ho gayi hai.{'\n'}
                    Approve hone ke baad sabko dikhegi.
                </Text>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary, marginTop: 24 }]}
                    onPress={resetForm}
                >
                    <Text style={styles.actionButtonText}>Post Another Ad</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.muted, marginTop: 12 }]}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Text style={[styles.actionButtonText, { color: colors.text }]}>Go Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ---- Category list ----
    const categories: { id: ListingCategory; label: string }[] = [
        { id: 'jobs', label: 'Jobs / Naukri' },
        { id: 'services', label: 'Services / Seva' },
        { id: 'buy-sell', label: 'Buy & Sell / Kharid-Bech' },
        { id: 'rent', label: 'Rent / Kiraya' },
        { id: 'business', label: 'Business / Vyapaar' },
    ];

    // ==== MAIN FORM ====
    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.form}>
                {/* Header */}
                <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.formTitle, { color: colors.text }]}>{editId ? 'Edit Your Ad' : 'Post Your Ad'}</Text>
                    <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
                        Fill the details below to post your listing
                    </Text>
                </View>

                {/* ===== CATEGORY SELECTOR ===== */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
                    <TouchableOpacity
                        style={[
                            styles.picker,
                            {
                                backgroundColor: colors.card,
                                borderColor: errors.category ? colors.destructive : colors.border,
                            },
                        ]}
                        onPress={() => {
                            setShowCategoryPicker(!showCategoryPicker);
                            setShowSubCategoryPicker(false);
                        }}
                    >
                        <Text style={{ color: category ? colors.text : colors.textSecondary, fontSize: 16 }}>
                            {category
                                ? categories.find(c => c.id === category)?.label
                                : 'Select category'}
                        </Text>
                        <ChevronDown size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                    {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
                    {showCategoryPicker && (
                        <View style={[styles.pickerOptions, { backgroundColor: colors.card }]}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.pickerOption,
                                        category === cat.id && { backgroundColor: colors.primary + '15' },
                                    ]}
                                    onPress={() => {
                                        setCategory(cat.id);
                                        setSubCategory('');
                                        setShowCategoryPicker(false);
                                        clearError('category');
                                    }}
                                >
                                    <Text style={{ color: colors.text, fontSize: 15 }}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* ===== SUB-CATEGORY SELECTOR ===== */}
                {category && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Sub-Category *</Text>
                        <TouchableOpacity
                            style={[
                                styles.picker,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: errors.subCategory ? colors.destructive : colors.border,
                                },
                            ]}
                            onPress={() => {
                                setShowSubCategoryPicker(!showSubCategoryPicker);
                                setShowCategoryPicker(false);
                            }}
                        >
                            <Text style={{ color: subCategory ? colors.text : colors.textSecondary, fontSize: 16 }}>
                                {subCategory || 'Select sub-category'}
                            </Text>
                            <ChevronDown size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                        {errors.subCategory ? <Text style={styles.errorText}>{errors.subCategory}</Text> : null}
                        {showSubCategoryPicker && (
                            <View style={[styles.pickerOptions, { backgroundColor: colors.card }]}>
                                {SubCategories[category].map((sub) => (
                                    <TouchableOpacity
                                        key={sub}
                                        style={[
                                            styles.pickerOption,
                                            subCategory === sub && { backgroundColor: colors.primary + '15' },
                                        ]}
                                        onPress={() => {
                                            setSubCategory(sub);
                                            setShowSubCategoryPicker(false);
                                            clearError('subCategory');
                                        }}
                                    >
                                        <Text style={{ color: colors.text, fontSize: 15 }}>{sub}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* ===== COMMON FIELDS ===== */}
                <FormInput
                    label="Title *"
                    placeholder="e.g., Experienced Driver Needed"
                    value={title}
                    onChangeText={(text) => { setTitle(text); clearError('title'); }}
                    error={errors.title}
                    maxLength={80}
                    colors={colors}
                />

                <FormInput
                    label="Description *"
                    placeholder="Apne listing ke baare mein detail mein likhein..."
                    value={description}
                    onChangeText={(text) => { setDescription(text); clearError('description'); }}
                    error={errors.description}
                    multiline
                    colors={colors}
                />

                <FormInput
                    label="Location *"
                    placeholder="e.g., Indore, Madhya Pradesh"
                    value={location}
                    onChangeText={(text) => { setLocation(text); clearError('location'); }}
                    error={errors.location}
                    icon={<MapPin size={18} color={colors.textSecondary} />}
                    colors={colors}
                />

                {/* ===== JOBS FIELDS ===== */}
                {category === 'jobs' && (
                    <>
                        <View style={[styles.sectionDivider, { borderColor: colors.border }]}>
                            <Text style={[styles.sectionLabel, { color: colors.primary }]}>💼 Job Details</Text>
                        </View>

                        <FormInput
                            label="Salary (₹) *"
                            placeholder="e.g., 15000"
                            value={salary}
                            onChangeText={(text) => { setSalary(text.replace(/[^0-9]/g, '')); clearError('salary'); }}
                            error={errors.salary}
                            keyboardType="numeric"
                            icon={<IndianRupee size={18} color={colors.textSecondary} />}
                            colors={colors}
                        />

                        <ChipSelector
                            label="Salary Type"
                            options={[
                                { value: 'monthly', label: '📅 Monthly' },
                                { value: 'daily', label: '📆 Daily' },
                                { value: 'hourly', label: '⏰ Hourly' },
                            ]}
                            selected={salaryType}
                            onSelect={setSalaryType}
                            colors={colors}
                        />

                        <ChipSelector
                            label="Job Type"
                            options={[
                                { value: 'full-time', label: 'Full Time' },
                                { value: 'part-time', label: 'Part Time' },
                                { value: 'contract', label: 'Contract' },
                            ]}
                            selected={jobType}
                            onSelect={setJobType}
                            colors={colors}
                        />

                        <FormInput
                            label="Experience Required"
                            placeholder="e.g., 2 years or Fresher"
                            value={experience}
                            onChangeText={setExperience}
                            colors={colors}
                        />
                    </>
                )}

                {/* ===== BUY-SELL FIELDS ===== */}
                {category === 'buy-sell' && (
                    <>
                        <View style={[styles.sectionDivider, { borderColor: colors.border }]}>
                            <Text style={[styles.sectionLabel, { color: colors.primary }]}>🛒 Product Details</Text>
                        </View>

                        <FormInput
                            label="Price (₹) *"
                            placeholder="e.g., 5000"
                            value={price}
                            onChangeText={(text) => { setPrice(text.replace(/[^0-9]/g, '')); clearError('price'); }}
                            error={errors.price}
                            keyboardType="numeric"
                            icon={<IndianRupee size={18} color={colors.textSecondary} />}
                            colors={colors}
                        />

                        <ChipSelector
                            label="Condition"
                            options={[
                                { value: 'new', label: '✨ New' },
                                { value: 'like-new', label: '👍 Like New' },
                                { value: 'used', label: '📦 Used' },
                                { value: 'for-parts', label: '🔩 For Parts' },
                            ]}
                            selected={condition}
                            onSelect={setCondition}
                            colors={colors}
                        />

                        <View style={styles.inputGroup}>
                            <TouchableOpacity
                                style={[styles.toggleRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                                onPress={() => setNegotiable(!negotiable)}
                            >
                                <Text style={[styles.toggleLabel, { color: colors.text }]}>
                                    Price Negotiable?
                                </Text>
                                <View style={[
                                    styles.toggleSwitch,
                                    { backgroundColor: negotiable ? colors.success : colors.muted },
                                ]}>
                                    <View style={[
                                        styles.toggleKnob,
                                        { transform: [{ translateX: negotiable ? 20 : 2 }] },
                                    ]} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* ===== RENT FIELDS ===== */}
                {category === 'rent' && (
                    <>
                        <View style={[styles.sectionDivider, { borderColor: colors.border }]}>
                            <Text style={[styles.sectionLabel, { color: colors.primary }]}>🚜 Rent Details</Text>
                        </View>

                        <FormInput
                            label="Rent Price (₹) *"
                            placeholder="e.g., 2000"
                            value={rentPrice}
                            onChangeText={(text) => { setRentPrice(text.replace(/[^0-9]/g, '')); clearError('rentPrice'); }}
                            error={errors.rentPrice}
                            keyboardType="numeric"
                            icon={<IndianRupee size={18} color={colors.textSecondary} />}
                            colors={colors}
                        />

                        <ChipSelector
                            label="Price Per"
                            options={[
                                { value: 'hour', label: '⏰ Hour' },
                                { value: 'day', label: '📅 Day' },
                                { value: 'week', label: '📆 Week' },
                                { value: 'month', label: '🗓️ Month' },
                            ]}
                            selected={priceUnit}
                            onSelect={setPriceUnit}
                            colors={colors}
                        />
                    </>
                )}

                {/* ===== SERVICES FIELDS ===== */}
                {category === 'services' && (
                    <>
                        <View style={[styles.sectionDivider, { borderColor: colors.border }]}>
                            <Text style={[styles.sectionLabel, { color: colors.primary }]}>🔧 Service Details</Text>
                        </View>

                        <FormInput
                            label="Rate per Hour (₹)"
                            placeholder="e.g., 500"
                            value={ratePerHour}
                            onChangeText={(text) => setRatePerHour(text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            icon={<IndianRupee size={18} color={colors.textSecondary} />}
                            colors={colors}
                        />

                        <FormInput
                            label="Availability"
                            placeholder="e.g., Monday to Saturday, 9 AM - 6 PM"
                            value={availability}
                            onChangeText={setAvailability}
                            colors={colors}
                        />
                    </>
                )}

                {/* ===== BUSINESS FIELDS ===== */}
                {category === 'business' && (
                    <>
                        <View style={[styles.sectionDivider, { borderColor: colors.border }]}>
                            <Text style={[styles.sectionLabel, { color: colors.primary }]}>🏪 Business Details</Text>
                        </View>

                        <FormInput
                            label="Business Name *"
                            placeholder="e.g., Sharma General Store"
                            value={businessName}
                            onChangeText={(text) => { setBusinessName(text); clearError('businessName'); }}
                            error={errors.businessName}
                            colors={colors}
                        />

                        <FormInput
                            label="Contact Number *"
                            placeholder="e.g., 9876543210"
                            value={contactNumber}
                            onChangeText={(text) => { setContactNumber(text.replace(/[^0-9]/g, '')); clearError('contactNumber'); }}
                            error={errors.contactNumber}
                            keyboardType="phone-pad"
                            maxLength={10}
                            colors={colors}
                        />

                        <FormInput
                            label="Full Address *"
                            placeholder="Shop address with landmark"
                            value={address}
                            onChangeText={(text) => { setAddress(text); clearError('address'); }}
                            error={errors.address}
                            multiline
                            colors={colors}
                        />

                        <FormInput
                            label="Opening Hours"
                            placeholder="e.g., 9 AM - 9 PM"
                            value={openingHours}
                            onChangeText={setOpeningHours}
                            colors={colors}
                        />

                        <FormInput
                            label="Website (optional)"
                            placeholder="e.g., www.example.com"
                            value={website}
                            onChangeText={setWebsite}
                            colors={colors}
                        />
                    </>
                )}

                {/* ===== IMAGES ===== */}
                <View style={[styles.sectionDivider, { borderColor: colors.border }]}>
                    <Text style={[styles.sectionLabel, { color: colors.primary }]}>📸 Photos</Text>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Images * ({images.length}/5)
                    </Text>
                    <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                        Achhi quality ki photos lagane se listing jaldi sell hoti hai
                    </Text>
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
                                style={[
                                    styles.addImageBtn,
                                    {
                                        backgroundColor: colors.muted,
                                        borderColor: errors.images ? colors.destructive : colors.border,
                                    },
                                ]}
                                onPress={pickImage}
                            >
                                <Camera size={28} color={colors.textSecondary} />
                                <Text style={[styles.addImageText, { color: colors.textSecondary }]}>
                                    Add Photo
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {errors.images ? <Text style={styles.errorText}>{errors.images}</Text> : null}
                </View>

                {/* ===== SUBMIT ===== */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        {
                            backgroundColor: loading ? colors.muted : colors.accent,
                        },
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator color="#FFF" size="small" />
                            <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>
                                Submitting...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.submitButtonText}>Submit for Review</Text>
                    )}
                </TouchableOpacity>

                <Text style={[styles.noteText, { color: colors.textSecondary }]}>
                    * Review ke baad aapki listing sabko dikhegi
                </Text>
            </View>

            {/* Bottom spacing */}
            <View style={{ height: 100 }} />
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
        lineHeight: 22,
        paddingHorizontal: 16,
    },
    actionButton: {
        marginTop: 24,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        minWidth: 180,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    successCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    successText: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    form: {
        padding: 16,
    },
    formHeader: {
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    formSubtitle: {
        fontSize: 14,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    hintText: {
        fontSize: 12,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    input: {
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    inputIcon: {
        position: 'absolute',
        left: 14,
        top: 14,
        zIndex: 1,
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
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    pickerOption: {
        padding: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    toggleSwitch: {
        width: 44,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
    },
    toggleKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionDivider: {
        borderTopWidth: 1,
        marginTop: 8,
        marginBottom: 20,
        paddingTop: 16,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
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
        width: 90,
        height: 90,
        borderRadius: 12,
    },
    removeImageBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageBtn: {
        width: 90,
        height: 90,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageText: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '500',
    },
    submitButton: {
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noteText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
