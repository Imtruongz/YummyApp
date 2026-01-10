import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/utils';
import { IconSvg } from './IconSvg';

interface SettingInfoCardProps {
    icon?: string;
    iconSize?: number;
    iconColor?: string;
    title: string;
    items: string[];
    backgroundColor?: string;
    borderColor?: string;
}

export const SettingInfoCard: React.FC<SettingInfoCardProps> = ({
    icon,
    iconSize = 28,
    iconColor = colors.dark,
    title,
    items,
    backgroundColor = '#fffbf0',
    borderColor = '#FF6B6B',
}) => {
    return (
        <View style={[styles.container, { backgroundColor, borderLeftColor: borderColor }]}>
            <View style={styles.titleRow}>
                {icon && <IconSvg xml={icon} width={iconSize} height={iconSize} color={iconColor} />}
                {icon && <View style={{ width: 3 }} />}
                <Text style={styles.title}>{title}</Text>
            </View>
            {items.map((item, index) => (
                <Text key={index} style={styles.item}>
                    • {item}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderLeftWidth: 4,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.dark,
    },
    item: {
        fontSize: 13,
        color: colors.smallText,
        marginBottom: 8,
        lineHeight: 18,
    },
});
