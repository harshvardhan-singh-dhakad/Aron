
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';

interface LeadsListProps {
    leads: any[];
}

export function LeadsList({ leads }: LeadsListProps) {
    return (
        <ScrollView className="px-5 py-3" showsVerticalScrollIndicator={false}>
            <Text className="text-base font-bold text-p-text font-serif mb-3">New Leads 🔔</Text>

            {leads.map((l) => (
                <View key={l.id} className="bg-white border border-p-border rounded-lg p-4 mb-3">
                    <View className="flex-row items-center gap-3 mb-2.5">
                        <Image
                            source={{ uri: l.avatar }}
                            className="w-[38px] h-[38px] rounded-full bg-gray-100"
                        />
                        <View className="flex-1">
                            <Text className="text-[13px] font-bold text-p-text">{l.name}</Text>
                            <Text className="text-[10px] text-p-sub">{l.time}</Text>
                        </View>
                        <View className="bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                            <Text className="text-[10px] font-bold text-orange-600">New</Text>
                        </View>
                    </View>

                    <Text className="text-xs text-p-sub mb-3.5 italic leading-5">"{l.msg}"</Text>

                    <View className="flex-row gap-2">
                        <TouchableOpacity className="flex-1 bg-green-50 py-2.5 rounded-lg items-center border border-green-100">
                            <Text className="text-xs font-bold text-green-700">📞 Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-blue-50 py-2.5 rounded-lg items-center border border-blue-100">
                            <Text className="text-xs font-bold text-blue-600">💬 Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-red-50 py-2.5 rounded-lg items-center border border-red-100">
                            <Text className="text-xs font-bold text-red-600">✕</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <View className="h-10" />
        </ScrollView>
    );
}
