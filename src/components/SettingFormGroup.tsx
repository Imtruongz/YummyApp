import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/utils';
import { IconSvg } from './IconSvg';

interface SettingFormGroupProps {
    label: string;
    icon?: string;
    iconSize?: number;
    iconColor?: string;
    error?: string;
    helper?: string;
    children: React.ReactNode;
}

export const SettingFormGroup: React.FC<SettingFormGroupProps> = ({
    label,
    icon,
    iconSize = 16,
    iconColor = colors.dark,
    error,
    helper,
    children,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                {icon && <IconSvg xml={icon} width={iconSize} height={iconSize} color={iconColor} />}
                {icon && <View style={{ width: 6 }} />}
                <Text style={styles.label}>{label}</Text>
            </View>
            {children}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {helper && <Text style={styles.helperText}>{helper}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 0,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark,
    },
    errorText: {
        color: colors.danger,
        fontSize: 13,
        marginTop: 8,
        fontWeight: '500',
    },
    helperText: {
        color: colors.smallText,
        fontSize: 12,
        marginTop: 8,
        lineHeight: 16,
    },
});
