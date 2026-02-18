
export interface Listing {
    id: string;
    title: string;
    category: string;
    subCategory?: string;
    price?: number;
    rent?: number;
    salary?: number;
    location: string;
    createdAt: Date;
    images: string[];
    ownerId: string;
    ownerName: string;
    ownerImage?: string;
    description: string;
    createdBy?: string;
    isVerifiedPost?: boolean;
    condition?: string;
    jobType?: string;
    period?: string;
}

export interface Application {
    id: string;
    listingId: string;
    applicantId: string;
    listingTitle?: string;
    ownerId: string;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: Date;
}


export interface User {
    uid: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    profileImage?: string;
    location?: string;
    walletBalance?: number;
    onboardingCompleted?: boolean;
}
