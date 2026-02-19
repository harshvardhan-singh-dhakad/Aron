
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PartnerDashboardProps {
    stats: any;
    leads: any[];
    listings: any[];
    onAction: (action: string) => void;
}

export function PartnerDashboard({ stats, leads, listings, onAction }: PartnerDashboardProps) {
    const KpiCard = ({ val, lbl, change, isUp }: any) => (
        <View className="bg-[#fffbef] border border-p-border rounded-lg p-4 flex-1">
            <Text className="text-[28px] font-black text-p-amber font-serif">{val}</Text>
            <Text className="text-[11px] font-medium text-p-sub mt-0.5">{lbl}</Text>
            <Text className={`text-[10px] font-bold mt-1 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                {change}
            </Text>
        </View>
    );

    return (
        <ScrollView className="px-5 py-3" showsVerticalScrollIndicator={false}>
            <Text className="text-base font-bold text-p-text font-serif mb-3">Performance Overview</Text>

            <View className="flex-row gap-2.5 mb-2.5">
                <KpiCard val={stats.views} lbl="👁️ Total Views" change="↑ 24% this week" isUp />
                <KpiCard val={stats.calls} lbl="📞 Calls Received" change="↑ 12% this week" isUp />
            </View>
            <View className="flex-row gap-2.5 mb-2.5">
                <KpiCard val={stats.leads} lbl="🔔 New Leads" change="↓ 3 from last week" isUp={false} />
                <KpiCard val={`₹${(stats.revenue / 1000).toFixed(1)}k`} lbl="💰 Revenue" change="↑ 18% this month" isUp />
            </View>

            <Text className="text-base font-bold text-p-text font-serif mt-3 mb-3">Quick Actions</Text>
            <View className="bg-white rounded-lg border border-p-border overflow-hidden shadow-sm mb-6">
                {[
                    { icon: "➕", label: "Create New Listing", sub: "Post a new ad or service", cls: "bg-green-100" },
                    { icon: "⚡", label: "Boost Listing", sub: "Featured — ₹49 for 7 days", cls: "bg-orange-50" },
                    { icon: "📊", label: "View Analytics", sub: "Detailed insights", cls: "bg-purple-100" },
                    { icon: "💳", label: "Withdraw Earnings", sub: "To bank or UPI", cls: "bg-slate-100" },
                ].map((item, i) => (
                    <TouchableOpacity key={i} className="flex-row items-center gap-3.5 p-3.5 border-b border-p-border last:border-0">
                        <View className={`w-[38px] h-[38px] rounded-xl items-center justify-center ${item.cls}`}>
                            <Text className="text-base">{item.icon}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-p-text">{item.label}</Text>
                            <Text className="text-xs text-p-sub mt-0.5">{item.sub}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#d6d3d1" />
                    </TouchableOpacity>
                ))}
            </View>

            <Text className="text-base font-bold text-p-text font-serif mb-3">Recent Leads</Text>
            {leads.map((l) => (
                <View key={l.id} className="bg-white border border-p-border rounded-lg p-3.5 mb-2.5 shadow-sm">
                    <View className="flex-row items-center gap-2.5 mb-2">
                        <View className="w-[38px] h-[38px] rounded-full bg-gray-200 overflow-hidden">
                            {/* Avatar would go here */}
                        </View>
                        <View className="flex-1">
                            <Text className="text-[13px] font-bold text-p-text">{l.name}</Text>
                            <Text className="text-[10px] text-p-sub">{l.time}</Text>
                        </View>
                        <View className="bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                            <Text className="text-[10px] font-bold text-orange-600">New</Text>
                        </View>
                    </View>
                    <Text className="text-xs text-p-sub mb-2.5 italic">"{l.msg}"</Text>
                    <View className="flex-row gap-2">
                        <TouchableOpacity className="flex-1 bg-green-50 py-2 rounded-lg items-center border border-green-100">
                            <Text className="text-xs font-bold text-green-700">📞 Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-blue-50 py-2 rounded-lg items-center border border-blue-100">
                            <Text className="text-xs font-bold text-blue-600">💬 Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-red-50 py-2 rounded-lg items-center border border-red-100">
                            <Text className="text-xs font-bold text-red-600">✕</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <View className="h-10" />
        </ScrollView>
    );
}
