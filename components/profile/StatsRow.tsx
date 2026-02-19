
import { View, Text } from 'react-native';

interface StatsRowProps {
    isPartner: boolean;
    stats: any;
}

export function StatsRow({ isPartner, stats }: StatsRowProps) {
    // Common wrapper for a stat item
    const StatItem = ({ label, value }: { label: string, value: string | number }) => (
        <View className={`rounded-lg py-3 px-2 flex-1 items-center border shadow-sm ${isPartner
                ? 'bg-white border-p-border shadow-orange-500/5'
                : 'bg-white border-u-border shadow-gray-200/50'
            }`}>
            <Text className={`text-lg font-bold ${isPartner ? 'text-p-amber font-serif' : 'text-u-accent'
                }`}>
                {value}
            </Text>
            <Text className={`text-[11px] font-semibold mt-0.5 ${isPartner ? 'text-p-sub' : 'text-u-sub'
                }`}>
                {label}
            </Text>
        </View>
    );

    return (
        <View className="flex-row gap-3 px-5 mt-5">
            {isPartner ? (
                <>
                    <StatItem label="Total Views" value={stats.views} />
                    <StatItem label="Calls" value={stats.calls} />
                    <StatItem label="Revenue" value={`₹${(stats.revenue / 1000).toFixed(1)}k`} />
                </>
            ) : (
                <>
                    <StatItem label="Bookings" value={stats.bookings} />
                    <StatItem label="Saved" value={stats.saved} />
                    <StatItem label="Reviews" value={stats.reviews} />
                </>
            )}
        </View>
    );
}
