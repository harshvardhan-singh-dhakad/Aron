import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { Platform } from 'react-native';

/**
 * Uploads an image to Firebase Storage and returns the download URL
 * @param uri Local file URI
 * @param path Storage path (e.g., 'verifications/userId/doc.jpg')
 */
export const uploadImage = async (uri: string, path: string): Promise<string> => {
    try {
        // Convert URI to Blob
        const response = await fetch(uri);
        const blob = await response.blob();

        // Create storage reference
        const storageRef = ref(storage, path);

        // Upload the blob
        const snapshot = await uploadBytes(storageRef, blob);

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
