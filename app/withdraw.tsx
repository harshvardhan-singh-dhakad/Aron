
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WithdrawPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Withdraw Funds</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="wallet-outline" size={64} color="#28a745" />
                </View>
                <Text style={styles.message}>Withdrawal feature is coming soon!</Text>
                <Text style={styles.subMessage}>You will be able to transfer your earnings directly to your bank account.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    iconContainer: { marginBottom: 24, backgroundColor: '#e8f5e9', padding: 20, borderRadius: 50 },
    message: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subMessage: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
});
