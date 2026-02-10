import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Listing, ListingCategory, BaseListing } from '@/types';

// Upload images to Firebase Storage
export const uploadImages = async (
    images: string[],
    userId: string,
    listingId: string
): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
        const imageUri = images[i];

        try {
            // For web, we need to handle base64 or blob
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const imageRef = ref(storage, `listings/${userId}/${listingId}/image_${i}_${Date.now()}`);
            await uploadBytes(imageRef, blob);

            const downloadUrl = await getDownloadURL(imageRef);
            uploadedUrls.push(downloadUrl);
        } catch (error) {
            console.error(`Error uploading image ${i}:`, error);
        }
    }

    return uploadedUrls;
};

// Create a new listing
export const createListing = async (
    listingData: Omit<BaseListing, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    images: string[]
): Promise<string | null> => {
    try {
        // First create the listing document to get ID
        const listingsRef = collection(db, 'listings');
        const docRef = await addDoc(listingsRef, {
            ...listingData,
            images: [],
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        // Upload images if any
        if (images.length > 0) {
            const imageUrls = await uploadImages(images, listingData.ownerId, docRef.id);
            await updateDoc(docRef, { images: imageUrls });
        }

        return docRef.id;
    } catch (error) {
        console.error('Error creating listing:', error);
        return null;
    }
};

// Get listings by category
export const getListingsByCategory = async (
    category: ListingCategory,
    limitCount: number = 20
): Promise<Listing[]> => {
    try {
        const listingsRef = collection(db, 'listings');
        const q = query(
            listingsRef,
            where('category', '==', category),
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
            updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() || new Date(),
        })) as Listing[];
    } catch (error) {
        console.error('Error getting listings:', error);
        return [];
    }
};

// Get all approved listings
export const getAllListings = async (limitCount: number = 50): Promise<Listing[]> => {
    try {
        const listingsRef = collection(db, 'listings');
        const q = query(
            listingsRef,
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
            updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() || new Date(),
        })) as Listing[];
    } catch (error) {
        console.error('Error getting all listings:', error);
        return [];
    }
};

// Get user's own listings
export const getUserListings = async (userId: string): Promise<Listing[]> => {
    try {
        const listingsRef = collection(db, 'listings');
        const q = query(
            listingsRef,
            where('ownerId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
            updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() || new Date(),
        })) as Listing[];
    } catch (error) {
        console.error('Error getting user listings:', error);
        return [];
    }
};

// Get single listing by ID
export const getListingById = async (listingId: string): Promise<Listing | null> => {
    try {
        const listingRef = doc(db, 'listings', listingId);
        const listingSnap = await getDoc(listingRef);

        if (listingSnap.exists()) {
            const data = listingSnap.data();
            return {
                id: listingSnap.id,
                ...data,
                createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
                updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
            } as Listing;
        }
        return null;
    } catch (error) {
        console.error('Error getting listing:', error);
        return null;
    }
};

// Update listing status (for admin)
export const updateListingStatus = async (
    listingId: string,
    status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> => {
    try {
        const listingRef = doc(db, 'listings', listingId);
        await updateDoc(listingRef, {
            status,
            updatedAt: serverTimestamp(),
        });
        return true;
    } catch (error) {
        console.error('Error updating listing status:', error);
        return false;
    }
};

// Delete listing
export const deleteListing = async (listingId: string): Promise<boolean> => {
    try {
        const listingRef = doc(db, 'listings', listingId);
        await deleteDoc(listingRef);
        return true;
    } catch (error) {
        console.error('Error deleting listing:', error);
        return false;
    }
};

// Search listings
export const searchListings = async (searchTerm: string): Promise<Listing[]> => {
    try {
        // Note: Firestore doesn't support full-text search natively
        // For production, consider using Algolia or ElasticSearch
        // This is a basic implementation that gets all approved listings
        const listings = await getAllListings(100);

        const lowerSearchTerm = searchTerm.toLowerCase();
        return listings.filter(listing =>
            listing.title.toLowerCase().includes(lowerSearchTerm) ||
            listing.description.toLowerCase().includes(lowerSearchTerm) ||
            listing.location.toLowerCase().includes(lowerSearchTerm)
        );
    } catch (error) {
        console.error('Error searching listings:', error);
        return [];
    }
};

// Get pending listings (for admin)
export const getPendingListings = async (): Promise<Listing[]> => {
    try {
        const listingsRef = collection(db, 'listings');
        const q = query(
            listingsRef,
            where('status', '==', 'pending'),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
            updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() || new Date(),
        })) as Listing[];
    } catch (error) {
        console.error('Error getting pending listings:', error);
        return [];
    }
};
