import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, ImagesSvg } from '@/utils';
import { IconSvg } from './IconSvg';

interface SettingHeaderCardProps {
    icon: string;
    title: string;
    subtitle: string;
    iconSize?: number;
    iconColor?: string;
}

export const SettingHeaderCard: React.FC<SettingHeaderCardProps> = ({
    icon,
    title,
    subtitle,
    iconSize = 24,
    iconColor = colors.dark,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <IconSvg xml={icon} width={iconSize} height={iconSize} color={iconColor} />
                <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary + '15',
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark,
    },
    subtitle: {
        fontSize: 14,
        color: colors.smallText,
        lineHeight: 20,
    },
});
