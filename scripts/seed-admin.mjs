// Seed script using Firebase Admin SDK
// Run: node scripts/seed-admin.mjs

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

// Initialize with default credentials (uses gcloud auth)
initializeApp({ projectId: 'aron-one' });
const db = getFirestore();

const HARSHVARDHAN_UID = 'QKGQAbLjw2aQijv2mYfGQlSIed72';
const ANSH_UID = '6hmZFBVVGRRXv7jqDjzYY2CO7GI2';

async function seedData() {
    console.log('🚀 Seeding test data with Admin SDK...\n');

    // 1. BOOKINGS
    console.log('📋 Adding bookings...');
    const bookings = [
        { userId: ANSH_UID, service: "AC Repair", provider: "Suresh Kumar", date: "15 Feb 2026", amount: 800, status: "completed", myRating: 4, createdAt: Timestamp.fromDate(new Date('2026-02-15')) },
        { userId: ANSH_UID, service: "Plumber", provider: "Ramesh Plumbing", date: "10 Feb 2026", amount: 500, status: "completed", myRating: 0, createdAt: Timestamp.fromDate(new Date('2026-02-10')) },
        { userId: ANSH_UID, service: "Room Rental", provider: "Vijay Nagar Society", date: "1 Feb 2026", amount: 8000, status: "active", myRating: 0, createdAt: Timestamp.fromDate(new Date('2026-02-01')) },
        { userId: ANSH_UID, service: "Movers & Packers", provider: "City Packers", date: "28 Jan 2026", amount: 3500, status: "cancelled", myRating: 0, createdAt: Timestamp.fromDate(new Date('2026-01-28')) },
        { userId: HARSHVARDHAN_UID, service: "Electrician", provider: "Ansh Electricals", date: "18 Feb 2026", amount: 1200, status: "completed", myRating: 5, createdAt: Timestamp.fromDate(new Date('2026-02-18')) },
        { userId: HARSHVARDHAN_UID, service: "Car Wash", provider: "Shine Auto", date: "5 Feb 2026", amount: 300, status: "active", myRating: 0, createdAt: Timestamp.fromDate(new Date('2026-02-05')) },
    ];
    for (const b of bookings) await db.collection('bookings').add(b);
    console.log(`  ✅ ${bookings.length} bookings\n`);

    // 2. WALLETS
    console.log('💰 Adding wallets...');
    await db.doc(`wallets/${ANSH_UID}`).set({ balance: 1250, pending: 300, updatedAt: Timestamp.now() });
    await db.doc(`wallets/${HARSHVARDHAN_UID}`).set({ balance: 12400, pending: 1500, updatedAt: Timestamp.now() });

    const anshTx = [
        { title: "Wallet Top-up", date: "15 Feb", amount: 500, type: "cr", icon: "💳", createdAt: Timestamp.fromDate(new Date('2026-02-15')) },
        { title: "AC Repair Payment", date: "15 Feb", amount: -800, type: "dr", icon: "🔧", createdAt: Timestamp.fromDate(new Date('2026-02-15T10:00:00')) },
        { title: "Refund — Cancelled Movers", date: "29 Jan", amount: 350, type: "cr", icon: "↩️", createdAt: Timestamp.fromDate(new Date('2026-01-29')) },
        { title: "Room Rental Payment", date: "1 Feb", amount: -8000, type: "dr", icon: "🏠", createdAt: Timestamp.fromDate(new Date('2026-02-01')) },
        { title: "Cashback Reward", date: "5 Feb", amount: 100, type: "cr", icon: "🎁", createdAt: Timestamp.fromDate(new Date('2026-02-05')) },
    ];
    for (const tx of anshTx) await db.collection(`wallets/${ANSH_UID}/transactions`).add(tx);

    const harshTx = [
        { title: "Service Payment Received", date: "18 Feb", amount: 1200, type: "cr", icon: "⚡", createdAt: Timestamp.fromDate(new Date('2026-02-18')) },
        { title: "Boost Listing Fee", date: "12 Feb", amount: -49, type: "dr", icon: "🚀", createdAt: Timestamp.fromDate(new Date('2026-02-12')) },
        { title: "Withdrawal to Bank", date: "10 Feb", amount: -5000, type: "dr", icon: "🏦", createdAt: Timestamp.fromDate(new Date('2026-02-10')) },
        { title: "Service Payment Received", date: "8 Feb", amount: 3500, type: "cr", icon: "⚡", createdAt: Timestamp.fromDate(new Date('2026-02-08')) },
    ];
    for (const tx of harshTx) await db.collection(`wallets/${HARSHVARDHAN_UID}/transactions`).add(tx);
    console.log('  ✅ Wallets + 9 transactions\n');

    // 3. LEADS
    console.log('🔔 Adding leads...');
    const leads = [
        { partnerId: HARSHVARDHAN_UID, name: "Priya Joshi", time: "2 min ago", msg: "Mujhe aaj electrician chahiye ghar pe, AC wiring ka kaam hai.", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=priya&backgroundColor=ffdfbf", createdAt: Timestamp.now() },
        { partnerId: HARSHVARDHAN_UID, name: "Amit Verma", time: "1 hr ago", msg: "Mere shop mein 5 extra points lagate ho kya? Rate batao.", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=amit&backgroundColor=c0aede", createdAt: Timestamp.fromDate(new Date('2026-02-20T07:00:00')) },
        { partnerId: HARSHVARDHAN_UID, name: "Deepak Sharma", time: "3 hr ago", msg: "MCB trip ho raha hai baar baar, aaj aa sakte ho kya?", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=deepak&backgroundColor=b6e3f4", createdAt: Timestamp.fromDate(new Date('2026-02-20T05:00:00')) },
        { partnerId: HARSHVARDHAN_UID, name: "Sunita Devi", time: "Yesterday", msg: "Purane fan ka wiring change karwana hai, kitna kharcha?", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=sunita&backgroundColor=ffd5dc", createdAt: Timestamp.fromDate(new Date('2026-02-19T14:00:00')) },
    ];
    for (const l of leads) await db.collection('leads').add(l);
    console.log(`  ✅ ${leads.length} leads\n`);

    // 4. UPDATE LISTINGS with views/calls/revenue
    console.log('📌 Updating listings...');
    await db.doc('listings/CIhbVKlt5eO952TQH3ks').update({ views: 156, calls: 9, revenue: 3500 });
    await db.doc('listings/N5l5d8OIT5R4KcyL2BNz').update({ views: 284, calls: 18, revenue: 8900 });
    console.log('  ✅ Listings updated\n');

    // 5. SAVED ITEMS for Ansh
    console.log('💾 Adding saved items...');
    await db.doc(`users/${ANSH_UID}/saved/CIhbVKlt5eO952TQH3ks`).set({ listingId: 'CIhbVKlt5eO952TQH3ks', savedAt: Timestamp.now() });
    await db.doc(`users/${ANSH_UID}/saved/N5l5d8OIT5R4KcyL2BNz`).set({ listingId: 'N5l5d8OIT5R4KcyL2BNz', savedAt: Timestamp.now() });
    console.log('  ✅ 2 saved items\n');

    // 6. UPDATE USER PROFILES with ratings
    console.log('⭐ Updating user ratings...');
    await db.doc(`users/${HARSHVARDHAN_UID}`).update({ rating: 4.2, reviewCount: 38 });
    await db.doc(`users/${ANSH_UID}`).update({ rating: 3.8, reviewCount: 12 });
    console.log('  ✅ Ratings updated\n');

    console.log('🎉 All test data seeded!');
    process.exit(0);
}

seedData().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
