// User Profile Schema
export interface UserProfile {
    id: string;
    phoneNumber: string;
    name?: string;
    location?: string;
    profileCompleted: boolean;
    verificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
    isAdmin: boolean;
    isBlocked?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Listing Categories
export type ListingCategory = 'jobs' | 'services' | 'buy-sell' | 'rent' | 'business';

// Listing Sub-categories
export const SubCategories: Record<ListingCategory, string[]> = {
    jobs: ['Sales', 'Driver', 'Delivery', 'Office Assistant', 'Technician', 'Other'],
    services: ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mechanic', 'Other'],
    'buy-sell': ['Electronics', 'Furniture', 'Vehicles', 'Clothing', 'Other'],
    rent: ['House', 'Room', 'Shop', 'Godown', 'Tractor', 'JCB', 'Tempo', 'Tools', 'Other'],
    business: ['Grocery', 'Restaurant', 'Salon', 'Medical', 'Hardware', 'Clothing', 'Electronics', 'Repair', 'Other'],
};

// Base Listing Interface
export interface BaseListing {
    id: string;
    ownerId: string;
    ownerName: string;
    ownerPhone: string;
    ownerVerified: boolean;
    title: string;
    description: string;
    category: ListingCategory;
    subCategory: string;
    location: string;
    images: string[];
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

// Job Listing
export interface JobListing extends BaseListing {
    category: 'jobs';
    salary: number;
    salaryType: 'monthly' | 'daily' | 'hourly';
    jobType: 'full-time' | 'part-time' | 'contract';
    experience?: string;
}

// Service Listing
export interface ServiceListing extends BaseListing {
    category: 'services';
    ratePerHour?: number;
    availability?: string;
}

// Buy & Sell Listing
export interface BuySellListing extends BaseListing {
    category: 'buy-sell';
    price: number;
    condition: 'new' | 'like-new' | 'used' | 'for-parts';
    negotiable: boolean;
}

// Rent Listing
export interface RentListing extends BaseListing {
    category: 'rent';
    pricePerUnit: number;
    priceUnit: 'hour' | 'day' | 'week' | 'month';
    availableFrom?: Date;
}

// Business Listing
export interface BusinessListing extends BaseListing {
    category: 'business';
    businessName: string;
    businessType: string;
    openingHours?: string;
    contactNumber: string;
    website?: string;
    address: string;
}

// Union type for all listings
export type Listing = JobListing | ServiceListing | BuySellListing | RentListing | BusinessListing;

// Application Schema
export interface Application {
    id: string;
    listingId: string;
    listingTitle: string;
    listingCategory: ListingCategory;
    applicantId: string;
    applicantName: string;
    applicantPhone: string;
    ownerId: string;
    status: 'pending' | 'accepted' | 'rejected';
    message?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Admin Verification Schema
export interface AdminVerification {
    id: string;
    userId: string;
    userName: string;
    userPhone: string;
    documentUrls: string[];
    documentType: 'aadhar' | 'pan' | 'other';
    status: 'pending' | 'approved' | 'rejected';
    adminNotes?: string;
    reviewedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
