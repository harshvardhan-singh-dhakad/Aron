const admin = require('firebase-admin');

// Initialize with default credentials (likely available in this environment)
admin.initializeApp({
    projectId: 'aron-one'
});

const db = admin.firestore();
const uid = 'uiPu4sm4gIZuOVyb98owOYZv44l1';

async function updateAdmin() {
    try {
        await db.collection('users').doc(uid).update({
            isAdmin: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Successfully updated user ${uid} to admin.`);
    } catch (error) {
        console.error('Error updating user:', error);
        process.exit(1);
    }
}

updateAdmin();
