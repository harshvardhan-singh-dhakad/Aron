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
            console.log(`Uploading image ${i + 1}/${images.length}...`);
            let blob: Blob;

            // Handle fetch for blob, with specific handling for different URI types if needed
            const response = await fetch(imageUri);
            blob = await response.blob();

            const imageRef = ref(storage, `listings/${userId}/${listingId}/image_${i}_${Date.now()}`);

            // Upload with metadata
            const metadata = {
                contentType: blob.type || 'image/jpeg',
            };

            await uploadBytes(imageRef, blob, metadata);

            const downloadUrl = await getDownloadURL(imageRef);
            console.log(`Image ${i + 1} uploaded:`, downloadUrl);
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
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
            updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() || new Date(),
        })) as Listing[];

        return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
        console.error('Error getting listings:', error);
        return [];
    }
};

// Get all approved listings (Public)
export const getAllListings = async (): Promise<Listing[]> => {
    try {
        const q = query(collection(db, 'listings'), where('status', '==', 'approved'));
        const snapshot = await getDocs(q);

        const listings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Listing[];

        // Sort by date desc (client-side)
        return listings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
        console.error('Error getting listings:', error);
        return [];
    }
};

// Get user's own listings
export const getUserListings = async (userId: string): Promise<Listing[]> => {
    try {
        const listingsRef = collection(db, 'listings');
        const q = query(
            listingsRef,
            where('ownerId', '==', userId)
        );

        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
            updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() || new Date(),
        })) as Listing[];

        return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
        const listings = await getAllListings();

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
            where('status', '==', 'pending')
        );

        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
            updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() || new Date(),
        })) as Listing[];

        return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
        console.error('Error getting pending listings:', error);
        return [];
    }
};

// Update listing details
export const updateListing = async (
    listingId: string,
    listingData: Partial<BaseListing>,
    newImages: string[],
    existingImages: string[]
): Promise<boolean> => {
    try {
        const listingRef = doc(db, 'listings', listingId);

        // Upload new images if any
        let finalImages = [...existingImages];
        if (newImages.length > 0) {
            // Check if we need to get userId from the listing or passed data
            // Assuming listingData.ownerId is present or we can fetch it
            const snap = await getDoc(listingRef);
            const ownerId = snap.exists() ? snap.data().ownerId : 'unknown';

            const uploadedUrls = await uploadImages(newImages, ownerId, listingId);
            finalImages = [...finalImages, ...uploadedUrls];
        }

        await updateDoc(listingRef, {
            ...listingData,
            images: finalImages,
            updatedAt: serverTimestamp(),
            status: 'pending' // Re-verify on edit
        });

        return true;
    } catch (error) {
        console.error('Error updating listing:', error);
        return false;
    }
};
