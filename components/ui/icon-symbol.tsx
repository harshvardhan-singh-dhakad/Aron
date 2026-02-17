
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolView, SymbolViewProps, SFSymbol } from 'expo-symbols';
import { StyleProp, TextStyle } from 'react-native';
import React from 'react';

export function IconSymbol({
    name,
    size = 24,
    color,
    style,
}: {
    name: string;
    size?: number;
    color: string;
    style?: StyleProp<TextStyle>;
    weight?: SymbolViewProps['weight'];
}) {
    return <MaterialIcons name={MAPPING[name] as any || 'help'} size={size} color={color} style={style} />;
}

const MAPPING: Record<string, string> = {
    'house.fill': 'home',
    'paperplane.fill': 'send',
    'chevron.left.forwardslash.chevron.right': 'code',
    'chevron.right': 'chevron-right',
    'magnifyingglass': 'search',
    'plus.circle.fill': 'add-circle',
    'envelope.fill': 'mail',
    'person.fill': 'person',
    'cross': 'close'
}
