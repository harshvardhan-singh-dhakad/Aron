// Seed data using Firebase CLI token for authentication
// This uses firebase-admin with the CLI token

const { execSync } = require('child_process');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

// Get token from Firebase CLI
let token;
try {
    token = execSync('npx firebase-tools login:ci --no-localhost 2>&1', { encoding: 'utf-8' });
} catch (e) {
    // Fallback: use service account approach
}

// Initialize with project ID only - will use ADC or emulator
process.env.FIRESTORE_EMULATOR_HOST = ''; // Ensure not using emulator
process.env.GCLOUD_PROJECT = 'aron-one';

initializeApp({ projectId: 'aron-one' });
const db = getFirestore();

const HARSHVARDHAN_UID = 'QKGQAbLjw2aQijv2mYfGQlSIed72';
const ANSH_UID = '6hmZFBVVGRRXv7jqDjzYY2CO7GI2';

async function main() {
    console.log('Seeding...');

    // Test write
    try {
        await db.collection('_test').doc('ping').set({ ts: new Date().toISOString() });
        console.log('✅ Connection works!');
        await db.collection('_test').doc('ping').delete();
    } catch (e) {
        console.error('❌ Cannot connect:', e.message);
        console.log('\nPlease run: gcloud auth application-default login');
        console.log('Or set GOOGLE_APPLICATION_CREDENTIALS to a service account key file.');
        process.exit(1);
    }

    // ... seed logic would go here
}

main();
