
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../types';

interface ProfileHeroProps {
    user: any;
    isPartner: boolean;
    onEdit: () => void;
    onPhotoUpload: () => void;
}

export function ProfileHero({ user, isPartner, onEdit, onPhotoUpload }: ProfileHeroProps) {
    const M = isPartner ? 'p' : 'u';

    // Dynamic styles based on mode
    const borderColor = isPartner ? 'border-p-amber' : 'border-u-accent';
    const onlineColor = isPartner ? 'bg-p-green' : 'bg-u-green';
    const camBtnBg = isPartner ? 'bg-p-amber' : 'bg-u-accent';
    const nameColor = isPartner ? 'text-p-text' : 'text-u-navy';
    const subColor = isPartner ? 'text-p-sub' : 'text-u-sub';

    return (
        <View className="items-center px-5 pt-6 gap-3">
            {/* Avatar Ring */}
            <View className="relative w-[90px] h-[90px]">
                <Image
                    source={{ uri: user.photo }}
                    className={`w-full h-full rounded-full border-4 ${borderColor}`}
                />
                <View className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${onlineColor}`} />
                <TouchableOpacity
                    onPress={onPhotoUpload}
                    className={`absolute -top-0.5 -right-0.5 w-[26px] h-[26px] rounded-full border-2 border-white items-center justify-center ${camBtnBg}`}
                >
                    <Text className="text-[10px]">📷</Text>
                </TouchableOpacity>
            </View>

            {/* Name & Info */}
            <View className="items-center">
                <Text className={`text-[22px] font-extrabold text-center ${nameColor}`}>
                    {user.name}
                </Text>
                <Text className={`text-[13px] text-center mt-1 ${subColor}`}>
                    {user.phone} · {user.city || "Add city"}
                </Text>
            </View>

            {/* Stars */}
            <View className="flex-row items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Text
                        key={s}
                        className="text-sm"
                        style={{ color: (user.rating || 0) >= s ? "#f59e0b" : "#d1d5db" }}
                    >
                        {(user.rating || 0) >= s ? '★' : '☆'}
                    </Text>
                ))}
                <Text className={`text-xs font-semibold ml-1.5 ${subColor}`}>
                    {user.rating} ({user.reviews})
                </Text>
            </View>

            {isPartner && (
                <View className="bg-p-green/10 px-2.5 py-1 rounded-md">
                    <Text className="text-[11px] font-bold text-p-green">✓ Verified Partner</Text>
                </View>
            )}
        </View>
    );
}
