
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WalletSectionProps {
    wallet: any;
    transactions: any[];
}

export function WalletSection({ wallet, transactions }: WalletSectionProps) {
    return (
        <ScrollView className="px-5 py-3" showsVerticalScrollIndicator={false}>
            {/* Wallet Hero */}
            <LinearGradient
                colors={['#2563eb', '#1e40af']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-[18px] p-6 mb-6 relative overflow-hidden"
            >
                <View className="absolute -right-8 -top-8 w-[120px] h-[120px] rounded-full bg-white/10" />
                <View className="absolute right-5 -bottom-10 w-[80px] h-[80px] rounded-full bg-white/5" />

                <Text className="text-[11px] font-bold tracking-[1px] uppercase text-white/70 mb-1.5">
                    ARON WALLET
                </Text>
                <Text className="text-4xl font-extrabold text-white leading-tight">
                    ₹{wallet.balance.toLocaleString()}
                </Text>
                <Text className="text-xs text-white/60 mt-1">
                    Pending: ₹{wallet.pending} · Valid forever
                </Text>

                <View className="flex-row gap-3 mt-5">
                    <TouchableOpacity className="flex-1 bg-white/15 p-3 rounded-xl items-center backdrop-blur-sm">
                        <Text className="text-[13px] font-semibold text-white">➕ Add Money</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white/15 p-3 rounded-xl items-center backdrop-blur-sm">
                        <Text className="text-[13px] font-semibold text-white">📤 Withdraw</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <Text className="text-base font-bold text-u-navy mb-3">Transaction History</Text>

            <View className="bg-white rounded-2xl border border-u-border overflow-hidden shadow-sm mb-10">
                {transactions.map((t) => (
                    <View key={t.id} className="flex-row items-center gap-3.5 p-4 border-b border-u-border last:border-0">
                        <View className={`w-[42px] h-[42px] rounded-full items-center justify-center ${t.type === 'cr' ? 'bg-green-100' : 'bg-red-50'
                            }`}>
                            <Text className="text-lg">{t.icon}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-u-text">{t.title}</Text>
                            <Text className="text-xs text-u-sub mt-0.5">{t.date}</Text>
                        </View>
                        <Text className={`text-sm font-bold ${t.type === 'cr' ? 'text-u-green' : 'text-u-text'
                            }`}>
                            {t.type === 'cr' ? '+' : ''}₹{Math.abs(t.amount)}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
