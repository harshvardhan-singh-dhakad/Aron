
import { View, Text, TouchableOpacity } from 'react-native';

interface ModeSwitchProps {
    isPartner: boolean;
    onSwitch: (toPartner: boolean) => void;
}

export function ModeSwitch({ isPartner, onSwitch }: ModeSwitchProps) {
    return (
        <View className={`mx-5 my-5 p-1.5 rounded-2xl transition-all ${isPartner ? 'bg-white border border-p-border p-4' : 'bg-gray-200 border-none'}`}>
            {isPartner && (
                <Text className="text-[10px] font-bold text-p-sub uppercase tracking-widest mb-2.5">
                    🔄 Mode Switch
                </Text>
            )}

            <View className={`flex-row h-[42px] rounded-xl overflow-hidden ${isPartner ? 'bg-p-amber-soft' : 'gap-1'}`}>
                <TouchableOpacity
                    onPress={() => onSwitch(false)}
                    className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg transition-all ${!isPartner ? 'bg-white shadow-sm' : 'bg-transparent'
                        }`}
                >
                    <Text className={`text-[13px] font-semibold ${!isPartner ? 'text-u-navy' : 'text-gray-500'}`}>
                        👤 User
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onSwitch(true)}
                    className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg transition-all ${isPartner ? 'bg-p-amber shadow-sm shadow-orange-500/40' : 'bg-transparent'
                        }`}
                >
                    <Text className={`text-[13px] font-semibold ${isPartner ? 'text-white' : 'text-gray-500'}`}>
                        ⚡ Partner
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
