# Aron - Hyperlocal Classified App

A React Native Expo app for classified listings and service connections in Tier-2 and Tier-3 cities of India.

## Features

### User Features
- **Phone OTP Login**: Simple login with 10-digit mobile number
- **Profile Management**: Complete profile with name and location
- **Document Verification**: Upload Aadhar/PAN for verified badge
- **Post Listings**: Create listings in 4 categories (Jobs, Services, Buy & Sell, Rent)
- **Browse & Search**: Find listings by category or keyword
- **Apply/Book**: Apply to jobs or book services/rentals
- **Inbox**: Manage received and sent applications

### Admin Features
- **Dashboard**: Overview of users, listings, and applications
- **User Management**: View and manage all users
- **Listing Moderation**: Approve or reject pending listings
- **Verification Review**: Review user document submissions
- **Application Management**: View all applications

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React Native
- **Language**: TypeScript

## Project Structure

```
aron-expo/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx (Home)
│   │   ├── search.tsx
│   │   ├── post-ad.tsx
│   │   ├── inbox.tsx
│   │   └── profile.tsx
│   ├── admin/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── users.tsx
│   │   ├── listings.tsx
│   │   ├── verifications.tsx
│   │   └── applications.tsx
│   ├── listing/
│   │   └── [id].tsx
│   ├── listings/
│   │   └── [categoryId].tsx
│   ├── _layout.tsx
│   └── complete-profile.tsx
├── components/
├── constants/
│   └── Colors.ts
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── firebase.ts
├── types/
│   └── index.ts
├── app.json
├── package.json
└── tsconfig.json
```

## Color Palette

- **Primary**: Blue (#007BFF) - Used for Navigation Bar
- **Secondary**: Green (#28A745) - Used for Headings & Success States
- **Accent**: Orange (#FD7E14) - Used for Buttons (e.g., Post Ad)
- **Background**: White (#FFFFFF) - Main App Background

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Firebase project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd aron-expo
   npm install
   ```

3. Create a `.env` file with your Firebase config:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Running on Device

- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

## Firebase Setup

### Firestore Collections

- `/users/{userId}` - User profiles
- `/listings/{listingId}` - All listings
- `/applications/{applicationId}` - User applications
- `/adminVerifications/{verificationId}` - Verification requests

### Storage Buckets

- `/listing-images/{userId}/{listingId}/{fileName}` - Listing images
- `/verification-documents/{userId}/{fileName}` - User documents

### Security Rules

Set up appropriate Firestore and Storage security rules based on your requirements.

## Categories

1. **Jobs**: Sales, Driver, Delivery, Office Assistant, Technician
2. **Services**: Plumber, Electrician, Carpenter, Painter, Mechanic
3. **Buy & Sell**: Electronics, Furniture, Vehicles, Clothing
4. **Rent (Kiraya)**: Tractor, JCB, Tempo, Tools, Property

## License

MIT
