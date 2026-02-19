
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface ListingsListProps {
    listings: any[];
}

export function ListingsList({ listings }: ListingsListProps) {
    return (
        <ScrollView className="px-5 py-3" showsVerticalScrollIndicator={false}>
            <Text className="text-base font-bold text-p-text font-serif mb-3">My Listings</Text>

            {listings.map((l, i) => (
                <View key={i} className="bg-white border border-p-border rounded-lg p-4 mb-3">
                    <View className="flex-row justify-between items-start mb-2.5">
                        <View>
                            <Text className="text-[15px] font-bold text-p-text">{l.title}</Text>
                            <Text className="text-xs text-p-sub mt-0.5">
                                👁 {l.views} views · 📞 {l.calls} calls
                            </Text>
                        </View>
                        <View className={`px-2 py-1 rounded-md ${l.status === 'active' ? 'bg-green-100' :
                                l.status === 'pending' ? 'bg-orange-100' : 'bg-red-100'
                            }`}>
                            <Text className={`text-[10px] font-bold ${l.status === 'active' ? 'text-green-700' :
                                    l.status === 'pending' ? 'text-orange-700' : 'text-red-700'
                                }`}>
                                {l.status === 'active' ? '✓ Live' :
                                    l.status === 'pending' ? '⏳ Review' : '✕ Expired'}
                            </Text>
                        </View>
                    </View>

                    {l.boost && (
                        <View className="bg-green-100 self-start px-2 py-1 rounded-md mb-2.5">
                            <Text className="text-[10px] font-bold text-green-700">⚡ Boosted</Text>
                        </View>
                    )}

                    <View className="flex-row gap-2 mt-1">
                        <TouchableOpacity className="flex-1 bg-blue-50 py-2 rounded-lg items-center border border-blue-100">
                            <Text className="text-xs font-bold text-blue-600">✏️ Edit</Text>
                        </TouchableOpacity>
                        {!l.boost && (
                            <TouchableOpacity className="flex-1 bg-green-50 py-2 rounded-lg items-center border border-green-100">
                                <Text className="text-xs font-bold text-green-700">⚡ Boost ₹49</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity className="flex-1 bg-red-50 py-2 rounded-lg items-center border border-red-100">
                            <Text className="text-xs font-bold text-red-600">🗑️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <View className="h-10" />
        </ScrollView>
    );
}
