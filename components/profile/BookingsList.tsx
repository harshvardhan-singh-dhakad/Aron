
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface BookingsListProps {
    bookings: any[];
    isPartner: boolean;
}

export function BookingsList({ bookings, isPartner }: BookingsListProps) {
    const activeBookings = bookings.filter((b) => b.status === 'active');
    const completedBookings = bookings.filter((b) => b.status === 'completed');
    const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'completed') return <View className="bg-green-100 px-2 py-1 rounded-md"><Text className="text-[10px] font-bold text-green-700">✓ Done</Text></View>;
        if (status === 'active') return <View className="bg-blue-100 px-2 py-1 rounded-md"><Text className="text-[10px] font-bold text-blue-700">⚡ Active</Text></View>;
        if (status === 'cancelled') return <View className="bg-red-100 px-2 py-1 rounded-md"><Text className="text-[10px] font-bold text-red-700">✕ Cancelled</Text></View>;
        return null;
    };

    const handleRate = async (bookingId: string, rating: number) => {
        try {
            await updateDoc(doc(db, 'bookings', bookingId), { myRating: rating });
        } catch (err) {
            console.log('Rating save error:', err);
            Alert.alert('Error', 'Could not save rating. Please try again.');
        }
    };

    const StatCard = ({ label, count, color }: { label: string; count: number; color: string }) => (
        <View className={`flex-1 rounded-xl p-3 items-center border ${isPartner ? 'bg-white border-p-border' : 'bg-white border-u-border'}`}>
            <Text className={`text-xl font-bold ${color}`}>{count}</Text>
            <Text className="text-[10px] text-gray-400 mt-0.5 font-medium">{label}</Text>
        </View>
    );

    const BookingCard = ({ b }: { b: any }) => (
        <View className={`rounded-xl p-4 mb-3 border ${isPartner ? 'bg-white border-p-border' : 'bg-white border-u-border'}`}>
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-2">
                    <Text className="text-[15px] font-bold text-u-navy">{b.service}</Text>
                    <Text className={`text-xs mt-0.5 ${isPartner ? 'text-p-sub' : 'text-u-sub'}`}>
                        by {b.provider}
                    </Text>
                </View>
                <StatusBadge status={b.status} />
            </View>

            <View className={`flex-row justify-between items-center mt-3 pt-3 border-t border-dashed ${isPartner ? 'border-p-border' : 'border-u-border'}`}>
                <Text className={`text-xs font-medium ${isPartner ? 'text-p-sub' : 'text-u-sub'}`}>
                    📅 {b.date}
                </Text>
                <Text className={`text-[15px] font-bold ${isPartner ? 'text-p-amber' : 'text-u-accent'}`}>
                    ₹{b.amount?.toLocaleString?.() || b.amount || 0}
                </Text>
            </View>

            {b.status === 'completed' && (
                <View className="mt-2.5">
                    <Text className="text-xs text-gray-400 mb-1">
                        {(b.myRating || 0) > 0 ? "Your Rating:" : "Rate this service:"}
                    </Text>
                    <View className="flex-row gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <TouchableOpacity key={s} onPress={() => handleRate(b.id, s)} activeOpacity={0.6} className="p-0.5">
                                <Text className="text-xl">{(b.myRating || 0) >= s ? '★' : '☆'}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <ScrollView className="px-5 py-3" showsVerticalScrollIndicator={false}>
            {/* Page Title */}
            <Text className="text-base font-bold text-u-navy mb-3">Bookings & Orders</Text>

            {/* Summary Stats */}
            <View className="flex-row gap-2.5 mb-5">
                <StatCard label="Total" count={bookings.length} color="text-u-navy" />
                <StatCard label="Active" count={activeBookings.length} color="text-blue-600" />
                <StatCard label="Completed" count={completedBookings.length} color="text-green-600" />
                <StatCard label="Cancelled" count={cancelledBookings.length} color="text-red-500" />
            </View>

            {/* Active / Current Bookings */}
            {activeBookings.length > 0 && (
                <View className="mb-4">
                    <Text className="text-sm font-semibold text-blue-600 mb-2">⚡ Current Bookings</Text>
                    {activeBookings.map((b) => <BookingCard key={b.id} b={b} />)}
                </View>
            )}

            {/* Completed */}
            {completedBookings.length > 0 && (
                <View className="mb-4">
                    <Text className="text-sm font-semibold text-green-600 mb-2">✓ Completed</Text>
                    {completedBookings.map((b) => <BookingCard key={b.id} b={b} />)}
                </View>
            )}

            {/* Cancelled */}
            {cancelledBookings.length > 0 && (
                <View className="mb-4">
                    <Text className="text-sm font-semibold text-red-500 mb-2">✕ Cancelled</Text>
                    {cancelledBookings.map((b) => <BookingCard key={b.id} b={b} />)}
                </View>
            )}

            {/* Empty State */}
            {bookings.length === 0 && (
                <View className="py-10 items-center">
                    <Text className="text-4xl mb-3">📦</Text>
                    <Text className="text-gray-400 text-center">No bookings or orders yet</Text>
                </View>
            )}

            <View className="h-10" />
        </ScrollView>
    );
}
