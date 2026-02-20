// Seed Firestore data via REST API using Firebase CLI auth token
// Run: node scripts/seed-rest.mjs

import { execSync } from 'child_process';

const PROJECT_ID = 'aron-one';
const HARSHVARDHAN_UID = 'QKGQAbLjw2aQijv2mYfGQlSIed72';
const ANSH_UID = '6hmZFBVVGRRXv7jqDjzYY2CO7GI2';

// Get access token from Firebase CLI
function getToken() {
    try {
        const result = execSync('npx firebase-tools login:ci --no-localhost 2>&1', { encoding: 'utf-8', timeout: 5000 });
        return result.trim();
    } catch (e) {
        // Try alternate: use stored token
        try {
            const tokenResult = execSync('npx firebase-tools --json login:list 2>&1', { encoding: 'utf-8', timeout: 5000 });
            // Parse token from login list
        } catch (e2) { }
    }
    return null;
}

const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Convert JS value to Firestore REST API format
function toFirestoreValue(val) {
    if (val === null || val === undefined) return { nullValue: null };
    if (typeof val === 'string') return { stringValue: val };
    if (typeof val === 'number') {
        if (Number.isInteger(val)) return { integerValue: String(val) };
        return { doubleValue: val };
    }
    if (typeof val === 'boolean') return { booleanValue: val };
    if (val instanceof Date) return { timestampValue: val.toISOString() };
    if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
    if (typeof val === 'object') {
        const fields = {};
        for (const [k, v] of Object.entries(val)) {
            fields[k] = toFirestoreValue(v);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(val) };
}

// Create a document body
function createDocBody(data) {
    const fields = {};
    for (const [key, value] of Object.entries(data)) {
        fields[key] = toFirestoreValue(value);
    }
    return { fields };
}

// Write a document
async function setDoc(path, data, token) {
    const url = `${BASE_URL}/${path}?updateMask.fieldPaths=${Object.keys(data).join('&updateMask.fieldPaths=')}`;

    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(createDocBody(data)),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to write ${path}: ${res.status} ${err}`);
    }
    return await res.json();
}

// Add a document (auto-ID)
async function addDoc(collectionPath, data, token) {
    const url = `${BASE_URL}/${collectionPath}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(createDocBody(data)),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to add to ${collectionPath}: ${res.status} ${err}`);
    }
    return await res.json();
}

async function seedData(token) {
    console.log('🚀 Seeding test data via REST API...\n');

    // 1. BOOKINGS
    console.log('📋 Adding bookings...');
    const bookings = [
        { userId: ANSH_UID, service: "AC Repair", provider: "Suresh Kumar", date: "15 Feb 2026", amount: 800, status: "completed", myRating: 4, createdAt: new Date('2026-02-15') },
        { userId: ANSH_UID, service: "Plumber", provider: "Ramesh Plumbing", date: "10 Feb 2026", amount: 500, status: "completed", myRating: 0, createdAt: new Date('2026-02-10') },
        { userId: ANSH_UID, service: "Room Rental", provider: "Vijay Nagar Society", date: "1 Feb 2026", amount: 8000, status: "active", myRating: 0, createdAt: new Date('2026-02-01') },
        { userId: ANSH_UID, service: "Movers & Packers", provider: "City Packers", date: "28 Jan 2026", amount: 3500, status: "cancelled", myRating: 0, createdAt: new Date('2026-01-28') },
        { userId: HARSHVARDHAN_UID, service: "Electrician", provider: "Ansh Electricals", date: "18 Feb 2026", amount: 1200, status: "completed", myRating: 5, createdAt: new Date('2026-02-18') },
        { userId: HARSHVARDHAN_UID, service: "Car Wash", provider: "Shine Auto", date: "5 Feb 2026", amount: 300, status: "active", myRating: 0, createdAt: new Date('2026-02-05') },
    ];
    for (const b of bookings) {
        await addDoc('bookings', b, token);
    }
    console.log(`  ✅ ${bookings.length} bookings added\n`);

    // 2. WALLETS
    console.log('💰 Adding wallets...');
    await setDoc(`wallets/${ANSH_UID}`, { balance: 1250, pending: 300, updatedAt: new Date() }, token);
    await setDoc(`wallets/${HARSHVARDHAN_UID}`, { balance: 12400, pending: 1500, updatedAt: new Date() }, token);

    const anshTx = [
        { title: "Wallet Top-up", date: "15 Feb", amount: 500, type: "cr", icon: "💳", createdAt: new Date('2026-02-15') },
        { title: "AC Repair Payment", date: "15 Feb", amount: -800, type: "dr", icon: "🔧", createdAt: new Date('2026-02-15T10:00:00') },
        { title: "Refund — Cancelled Movers", date: "29 Jan", amount: 350, type: "cr", icon: "↩️", createdAt: new Date('2026-01-29') },
        { title: "Room Rental Payment", date: "1 Feb", amount: -8000, type: "dr", icon: "🏠", createdAt: new Date('2026-02-01') },
        { title: "Cashback Reward", date: "5 Feb", amount: 100, type: "cr", icon: "🎁", createdAt: new Date('2026-02-05') },
    ];
    for (const tx of anshTx) await addDoc(`wallets/${ANSH_UID}/transactions`, tx, token);

    const harshTx = [
        { title: "Service Payment Received", date: "18 Feb", amount: 1200, type: "cr", icon: "⚡", createdAt: new Date('2026-02-18') },
        { title: "Boost Listing Fee", date: "12 Feb", amount: -49, type: "dr", icon: "🚀", createdAt: new Date('2026-02-12') },
        { title: "Withdrawal to Bank", date: "10 Feb", amount: -5000, type: "dr", icon: "🏦", createdAt: new Date('2026-02-10') },
        { title: "Service Payment Received", date: "8 Feb", amount: 3500, type: "cr", icon: "⚡", createdAt: new Date('2026-02-08') },
    ];
    for (const tx of harshTx) await addDoc(`wallets/${HARSHVARDHAN_UID}/transactions`, tx, token);
    console.log('  ✅ Wallets + 9 transactions\n');

    // 3. LEADS
    console.log('🔔 Adding leads...');
    const leads = [
        { partnerId: HARSHVARDHAN_UID, name: "Priya Joshi", time: "2 min ago", msg: "Mujhe aaj electrician chahiye ghar pe, AC wiring ka kaam hai.", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=priya&backgroundColor=ffdfbf", createdAt: new Date() },
        { partnerId: HARSHVARDHAN_UID, name: "Amit Verma", time: "1 hr ago", msg: "Mere shop mein 5 extra points lagate ho kya? Rate batao.", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=amit&backgroundColor=c0aede", createdAt: new Date('2026-02-20T07:00:00') },
        { partnerId: HARSHVARDHAN_UID, name: "Deepak Sharma", time: "3 hr ago", msg: "MCB trip ho raha hai baar baar, aaj aa sakte ho kya?", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=deepak&backgroundColor=b6e3f4", createdAt: new Date('2026-02-20T05:00:00') },
        { partnerId: HARSHVARDHAN_UID, name: "Sunita Devi", time: "Yesterday", msg: "Purane fan ka wiring change karwana hai, kitna kharcha?", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=sunita&backgroundColor=ffd5dc", createdAt: new Date('2026-02-19T14:00:00') },
    ];
    for (const l of leads) await addDoc('leads', l, token);
    console.log(`  ✅ ${leads.length} leads\n`);

    // 4. UPDATE LISTINGS
    console.log('📌 Updating listings...');
    await setDoc('listings/CIhbVKlt5eO952TQH3ks', { views: 156, calls: 9, revenue: 3500 }, token);
    await setDoc('listings/N5l5d8OIT5R4KcyL2BNz', { views: 284, calls: 18, revenue: 8900 }, token);
    console.log('  ✅ Listings updated\n');

    // 5. SAVED ITEMS
    console.log('💾 Adding saved items...');
    await setDoc(`users/${ANSH_UID}/saved/CIhbVKlt5eO952TQH3ks`, { listingId: 'CIhbVKlt5eO952TQH3ks', savedAt: new Date() }, token);
    await setDoc(`users/${ANSH_UID}/saved/N5l5d8OIT5R4KcyL2BNz`, { listingId: 'N5l5d8OIT5R4KcyL2BNz', savedAt: new Date() }, token);
    console.log('  ✅ 2 saved items\n');

    // 6. USER RATINGS
    console.log('⭐ Updating ratings...');
    await setDoc(`users/${HARSHVARDHAN_UID}`, { rating: 4.2, reviewCount: 38 }, token);
    await setDoc(`users/${ANSH_UID}`, { rating: 3.8, reviewCount: 12 }, token);
    console.log('  ✅ Ratings updated\n');

    console.log('🎉 All test data seeded successfully!');
}

// Get token from Firebase CLI
async function main() {
    console.log('🔑 Getting access token from Firebase CLI...');
    let token;
    try {
        token = execSync('npx firebase-tools login:ci --no-localhost --token 2>&1', { encoding: 'utf-8', timeout: 10000 }).trim();
    } catch (e) { }

    // Try to extract access token from firebase internals
    if (!token) {
        try {
            const homeDir = process.env.USERPROFILE || process.env.HOME;
            const fs = await import('fs');
            const configPath = `${homeDir}/.config/configstore/firebase-tools.json`;
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            token = config.tokens?.access_token;
            if (!token && config.tokens?.refresh_token) {
                // Use refresh token to get access token
                const refreshToken = config.tokens.refresh_token;
                const clientId = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
                const clientSecret = 'j9iVZfS8kkCEFUPaAeJV0sAi'; // Firebase CLI public secret

                const resp = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`,
                });
                const tokenData = await resp.json();
                token = tokenData.access_token;
            }
            console.log(`  ✅ Got token from Firebase CLI config\n`);
        } catch (e) {
            console.error('❌ Cannot get token:', e.message);
            console.log('Please login with: npx firebase-tools login');
            process.exit(1);
        }
    }

    await seedData(token);
}

main().catch(err => { console.error('❌:', err.message); process.exit(1); });
