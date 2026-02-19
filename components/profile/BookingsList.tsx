
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookingsListProps {
    bookings: any[];
    isPartner: boolean;
}

export function BookingsList({ bookings, isPartner }: BookingsListProps) {
    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'completed') return <View className="bg-green-100 px-2 py-1 rounded-md"><Text className="text-[10px] font-bold text-green-700">✓ Done</Text></View>;
        if (status === 'active') return <View className="bg-blue-100 px-2 py-1 rounded-md"><Text className="text-[10px] font-bold text-blue-700">⚡ Active</Text></View>;
        if (status === 'cancelled') return <View className="bg-red-100 px-2 py-1 rounded-md"><Text className="text-[10px] font-bold text-red-700">✕ Cancelled</Text></View>;
        return null;
    };

    return (
        <ScrollView className="px-5 py-3" showsVerticalScrollIndicator={false}>
            <Text className="text-base font-bold text-u-navy mb-3">Booking History</Text>
            {bookings.map((b) => (
                <View
                    key={b.id}
                    className={`rounded-lg p-4 mb-3 border ${isPartner ? 'bg-white border-p-border' : 'bg-white border-u-border'
                        }`}
                >
                    <View className="flex-row justify-between items-start mb-2">
                        <View>
                            <Text className="text-[15px] font-bold text-u-navy">{b.service}</Text>
                            <Text className={`text-xs mt-0.5 ${isPartner ? 'text-p-sub' : 'text-u-sub'}`}>
                                by {b.provider}
                            </Text>
                        </View>
                        <StatusBadge status={b.status} />
                    </View>

                    <View className={`flex-row justify-between items-center mt-3 pt-3 border-t border-dashed ${isPartner ? 'border-p-border' : 'border-u-border'
                        }`}>
                        <Text className={`text-xs font-medium ${isPartner ? 'text-p-sub' : 'text-u-sub'}`}>
                            📅 {b.date}
                        </Text>
                        <Text className={`text-[15px] font-bold ${isPartner ? 'text-p-amber' : 'text-u-accent'}`}>
                            ₹{b.amount.toLocaleString()}
                        </Text>
                    </View>

                    {b.status === 'completed' && (
                        <View className="mt-2.5">
                            <Text className="text-xs text-gray-400 mb-1">
                                {b.myRating > 0 ? "Your Rating:" : "Rate this service:"}
                            </Text>
                            <View className="flex-row gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Ionicons
                                        key={s}
                                        name="star"
                                        size={20}
                                        color={(b.myRating || 0) >= s ? "#f59e0b" : "#e5e7eb"}
                                    />
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            ))}
            <View className="h-10" />
        </ScrollView>
    );
}
