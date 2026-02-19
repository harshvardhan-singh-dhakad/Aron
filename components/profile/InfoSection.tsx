
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoSectionProps {
    user: any;
    onEdit: (field: string, value: string) => void;
    onLogout: () => void;
    onDelete: () => void;
}

export function InfoSection({ user, onEdit, onLogout, onDelete }: InfoSectionProps) {
    const SectionHeader = ({ title }: { title: string }) => (
        <Text className="text-base font-bold text-u-navy mb-3">{title}</Text>
    );

    const InfoRow = ({ icon, label, val, field, badge }: any) => (
        <TouchableOpacity
            onPress={() => field && onEdit(field, val)}
            className="flex-row items-center gap-3.5 py-3.5 border-b border-u-border last:border-0"
        >
            <View className="w-[38px] h-[38px] rounded-xl items-center justify-center bg-gray-100">
                <Text className="text-base">{icon}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-sm font-semibold text-u-text">{val}</Text>
                <Text className="text-xs text-u-sub mt-0.5">{label}</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
                {badge}
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView className="px-5 py-3" showsVerticalScrollIndicator={false}>
            <SectionHeader title="Personal Information" />
            <View className="bg-white rounded-2xl border border-u-border px-4 shadow-sm mb-5 overflow-hidden">
                <InfoRow icon="👤" label="Full Name" val={user.name} field="name" />
                <InfoRow
                    icon="📱"
                    label="Phone (OTP Verified)"
                    val={user.phone}
                    badge={<View className="bg-green-100 px-2 py-1 rounded-md"><Text className="text-[10px] font-bold text-green-700">✓</Text></View>}
                />
                <InfoRow icon="📧" label="Email" val={user.email || "Add email"} field="email" />
                <InfoRow icon="📍" label="City / Location" val={user.city || "Add city"} field="city" />
            </View>

            <SectionHeader title="Skills & Verification" />
            <View className="bg-white rounded-2xl border border-u-border px-4 shadow-sm mb-5 overflow-hidden">
                <InfoRow icon="🛠️" label="Skill / Profession" val={user.profession || "Add profession"} field="profession" />
                <InfoRow
                    icon="🪪"
                    label="Identity Verification"
                    val="Aadhaar Card"
                    badge={<View className="bg-green-100 px-2 py-1 rounded-md"><Text className="text-[10px] font-bold text-green-700">✓ Verified</Text></View>}
                />
            </View>

            <View className="bg-white rounded-2xl border border-u-border px-4 pt-1 shadow-sm mb-10 overflow-hidden">
                <TouchableOpacity
                    onPress={onLogout}
                    className="flex-row items-center gap-3.5 py-3.5 border-b border-u-border"
                >
                    <View className="w-[38px] h-[38px] rounded-xl items-center justify-center bg-red-50">
                        <Text>🚪</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-semibold text-red-500">Logout</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ef4444" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onDelete}
                    className="flex-row items-center gap-3.5 py-3.5"
                >
                    <View className="w-[38px] h-[38px] rounded-xl items-center justify-center bg-red-50">
                        <Text>🗑️</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-semibold text-red-500">Delete Account</Text>
                        <Text className="text-xs text-red-400 mt-0.5">This action is permanent</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
