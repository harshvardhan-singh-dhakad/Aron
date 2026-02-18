
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2EarnWithAron } from './Step2EarnWithAron';
import { Step3InterestCategories } from './Step3InterestCategories';
import { Step4Verification } from './Step4Verification';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(1);
    const [onboardingData, setOnboardingData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const updateData = (data: any) => {
        setOnboardingData((prev: any) => ({ ...prev, ...data }));
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handleFinalSubmit = async (finalData: any) => {
        const completeData = { ...onboardingData, ...finalData };
        setLoading(true);
        try {
            // Save to Firestore
            await setDoc(doc(db, 'users', user!.uid), {
                ...completeData,
                createdAt: new Date(),
                onboardingCompleted: true,
                verified: false, // Default to false until admin verifies
                walletBalance: 0,
                aronScore: 100, // Default start score
            });
            // Also potentially save to 'partners' collection if needed, but keeping it simple in 'users' for now or subcollection
            onComplete();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {step === 1 && <Step1BasicInfo onNext={updateData} initialData={onboardingData} />}
            {step === 2 && <Step2EarnWithAron onNext={updateData} initialData={onboardingData} />}
            {step === 3 && <Step3InterestCategories onNext={updateData} initialData={onboardingData} earnType={onboardingData.earnType} />}
            {step === 4 && <Step4Verification onSubmit={handleFinalSubmit} loading={loading} initialData={onboardingData} />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
});
