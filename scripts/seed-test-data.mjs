// Test Data Seed Script for Firestore
// Run: node scripts/seed-test-data.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCOMs85y6MOLN7tWhyME_CzSiq623pWVWo",
    authDomain: "aron-one.firebaseapp.com",
    projectId: "aron-one",
    storageBucket: "aron-one.firebasestorage.app",
    messagingSenderId: "618750765784",
    appId: "1:618750765784:web:346498128a842ace4a85ad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// User IDs from existing users
const HARSHVARDHAN_UID = 'QKGQAbLjw2aQijv2mYfGQlSIed72'; // Partner
const ANSH_UID = '6hmZFBVVGRRXv7jqDjzYY2CO7GI2'; // User

async function seedData() {
    console.log('🚀 Seeding test data...\n');

    // ───────────────────────────────────────
    // 1. BOOKINGS — for Ansh (user)
    // ───────────────────────────────────────
    console.log('📋 Adding bookings...');
    const bookingsData = [
        { userId: ANSH_UID, service: "AC Repair", provider: "Suresh Kumar", date: "15 Feb 2026", amount: 800, status: "completed", myRating: 4, createdAt: Timestamp.fromDate(new Date('2026-02-15')) },
        { userId: ANSH_UID, service: "Plumber", provider: "Ramesh Plumbing", date: "10 Feb 2026", amount: 500, status: "completed", myRating: 0, createdAt: Timestamp.fromDate(new Date('2026-02-10')) },
        { userId: ANSH_UID, service: "Room Rental", provider: "Vijay Nagar Society", date: "1 Feb 2026", amount: 8000, status: "active", myRating: 0, createdAt: Timestamp.fromDate(new Date('2026-02-01')) },
        { userId: ANSH_UID, service: "Movers & Packers", provider: "City Packers", date: "28 Jan 2026", amount: 3500, status: "cancelled", myRating: 0, createdAt: Timestamp.fromDate(new Date('2026-01-28')) },
        { userId: HARSHVARDHAN_UID, service: "Electrician", provider: "Ansh Electricals", date: "18 Feb 2026", amount: 1200, status: "completed", myRating: 5, createdAt: Timestamp.fromDate(new Date('2026-02-18')) },
        { userId: HARSHVARDHAN_UID, service: "Car Wash", provider: "Shine Auto", date: "5 Feb 2026", amount: 300, status: "active", myRating: 0, createdAt: Timestamp.fromDate(new Date('2026-02-05')) },
    ];

    for (const booking of bookingsData) {
        await addDoc(collection(db, 'bookings'), booking);
    }
    console.log(`  ✅ ${bookingsData.length} bookings added\n`);

    // ───────────────────────────────────────
    // 2. WALLETS — for both users
    // ───────────────────────────────────────
    console.log('💰 Adding wallet data...');

    // Ansh's wallet
    await setDoc(doc(db, 'wallets', ANSH_UID), {
        balance: 1250,
        pending: 300,
        updatedAt: Timestamp.now(),
    });

    // Ansh's transactions
    const anshTransactions = [
        { title: "Wallet Top-up", date: "15 Feb", amount: 500, type: "cr", icon: "💳", createdAt: Timestamp.fromDate(new Date('2026-02-15')) },
        { title: "AC Repair Payment", date: "15 Feb", amount: -800, type: "dr", icon: "🔧", createdAt: Timestamp.fromDate(new Date('2026-02-15T10:00:00')) },
        { title: "Refund — Cancelled Movers", date: "29 Jan", amount: 350, type: "cr", icon: "↩️", createdAt: Timestamp.fromDate(new Date('2026-01-29')) },
        { title: "Room Rental Payment", date: "1 Feb", amount: -8000, type: "dr", icon: "🏠", createdAt: Timestamp.fromDate(new Date('2026-02-01')) },
        { title: "Cashback Reward", date: "5 Feb", amount: 100, type: "cr", icon: "🎁", createdAt: Timestamp.fromDate(new Date('2026-02-05')) },
    ];

    for (const tx of anshTransactions) {
        await addDoc(collection(db, 'wallets', ANSH_UID, 'transactions'), tx);
    }

    // Harshvardhan's wallet
    await setDoc(doc(db, 'wallets', HARSHVARDHAN_UID), {
        balance: 12400,
        pending: 1500,
        updatedAt: Timestamp.now(),
    });

    const harshTransactions = [
        { title: "Service Payment Received", date: "18 Feb", amount: 1200, type: "cr", icon: "⚡", createdAt: Timestamp.fromDate(new Date('2026-02-18')) },
        { title: "Boost Listing Fee", date: "12 Feb", amount: -49, type: "dr", icon: "🚀", createdAt: Timestamp.fromDate(new Date('2026-02-12')) },
        { title: "Withdrawal to Bank", date: "10 Feb", amount: -5000, type: "dr", icon: "🏦", createdAt: Timestamp.fromDate(new Date('2026-02-10')) },
        { title: "Service Payment Received", date: "8 Feb", amount: 3500, type: "cr", icon: "⚡", createdAt: Timestamp.fromDate(new Date('2026-02-08')) },
    ];

    for (const tx of harshTransactions) {
        await addDoc(collection(db, 'wallets', HARSHVARDHAN_UID, 'transactions'), tx);
    }
    console.log('  ✅ Wallets & transactions added\n');

    // ───────────────────────────────────────
    // 3. LEADS — for Harshvardhan (partner)
    // ───────────────────────────────────────
    console.log('🔔 Adding leads...');
    const leadsData = [
        { partnerId: HARSHVARDHAN_UID, name: "Priya Joshi", time: "2 min ago", msg: "Mujhe aaj electrician chahiye ghar pe, AC wiring ka kaam hai.", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=priya&backgroundColor=ffdfbf", createdAt: Timestamp.now() },
        { partnerId: HARSHVARDHAN_UID, name: "Amit Verma", time: "1 hr ago", msg: "Mere shop mein 5 extra points lagate ho kya? Rate batao.", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=amit&backgroundColor=c0aede", createdAt: Timestamp.fromDate(new Date('2026-02-20T07:00:00')) },
        { partnerId: HARSHVARDHAN_UID, name: "Deepak Sharma", time: "3 hr ago", msg: "MCB trip ho raha hai baar baar, aaj aa sakte ho kya check karne?", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=deepak&backgroundColor=b6e3f4", createdAt: Timestamp.fromDate(new Date('2026-02-20T05:00:00')) },
        { partnerId: HARSHVARDHAN_UID, name: "Sunita Devi", time: "Yesterday", msg: "Purane fan ka wiring change karwana hai, kitna kharcha aayega?", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=sunita&backgroundColor=ffd5dc", createdAt: Timestamp.fromDate(new Date('2026-02-19T14:00:00')) },
    ];

    for (const lead of leadsData) {
        await addDoc(collection(db, 'leads'), lead);
    }
    console.log(`  ✅ ${leadsData.length} leads added\n`);

    // ───────────────────────────────────────
    // 4. UPDATE LISTINGS — add views/calls/revenue
    // ───────────────────────────────────────
    console.log('📌 Updating listings with stats...');

    // Update existing listings to add views, calls, revenue fields
    await setDoc(doc(db, 'listings', 'CIhbVKlt5eO952TQH3ks'), {
        views: 156,
        calls: 9,
        revenue: 3500,
    }, { merge: true });

    await setDoc(doc(db, 'listings', 'N5l5d8OIT5R4KcyL2BNz'), {
        views: 284,
        calls: 18,
        revenue: 8900,
    }, { merge: true });

    console.log('  ✅ Listings updated with stats\n');

    // ───────────────────────────────────────
    // 5. ADD SAVED ITEMS — for Ansh
    // ───────────────────────────────────────
    console.log('💾 Adding saved items...');
    await setDoc(doc(db, 'users', ANSH_UID, 'saved', 'CIhbVKlt5eO952TQH3ks'), {
        listingId: 'CIhbVKlt5eO952TQH3ks',
        savedAt: Timestamp.now(),
    });
    await setDoc(doc(db, 'users', ANSH_UID, 'saved', 'N5l5d8OIT5R4KcyL2BNz'), {
        listingId: 'N5l5d8OIT5R4KcyL2BNz',
        savedAt: Timestamp.now(),
    });
    console.log('  ✅ 2 saved items added\n');

    // ───────────────────────────────────────
    // 6. UPDATE USER PROFILES — add rating/reviewCount
    // ───────────────────────────────────────
    console.log('⭐ Updating user profiles with ratings...');
    await setDoc(doc(db, 'users', HARSHVARDHAN_UID), {
        rating: 4.2,
        reviewCount: 38,
    }, { merge: true });

    await setDoc(doc(db, 'users', ANSH_UID), {
        rating: 3.8,
        reviewCount: 12,
    }, { merge: true });
    console.log('  ✅ User ratings updated\n');

    console.log('🎉 All test data seeded successfully!');
    console.log('──────────────────────────────────');
    console.log('Collections created/updated:');
    console.log('  📋 bookings     — 6 documents');
    console.log('  💰 wallets      — 2 wallets + 9 transactions');
    console.log('  🔔 leads        — 4 documents');
    console.log('  📌 listings     — 2 updated with stats');
    console.log('  💾 users/saved  — 2 saved items');
    console.log('  ⭐ users        — 2 updated with ratings');
    console.log('──────────────────────────────────');

    process.exit(0);
}

seedData().catch((err) => {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
});
