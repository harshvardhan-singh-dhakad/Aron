
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface SectionTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    isPartner: boolean;
    tabLabels: Record<string, string>;
    hasLeads?: boolean;
}

export function SectionTabs({ tabs, activeTab, onTabChange, isPartner, tabLabels, hasLeads }: SectionTabsProps) {
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
                className="mb-2"
            >
                {tabs.map((t) => {
                    const isActive = activeTab === t;
                    let containerClass = "px-4 py-2 rounded-full border border-transparent";
                    let textClass = "text-[13px] font-semibold";

                    if (isPartner) {
                        containerClass = isActive
                            ? "bg-p-amber border-p-amber"
                            : "bg-white border-p-border";
                        textClass = isActive ? "text-white" : "text-p-sub";
                    } else {
                        containerClass = isActive
                            ? "bg-u-navy border-u-navy"
                            : "bg-transparent";
                        textClass = isActive ? "text-white" : "text-u-sub";
                    }

                    return (
                        <TouchableOpacity
                            key={t}
                            onPress={() => onTabChange(t)}
                            className={`${containerClass} flex-row items-center`}
                        >
                            <Text className={textClass}>
                                {tabLabels[t] || t.charAt(0).toUpperCase() + t.slice(1)}
                            </Text>
                            {t === 'leads' && hasLeads && (
                                <View className="w-2 h-2 bg-red-500 rounded-full ml-1.5" />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
