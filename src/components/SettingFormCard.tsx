import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/utils';

interface SettingFormCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const SettingFormCard: React.FC<SettingFormCardProps> = ({ children, style }) => {
    return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.light,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 24,
    },
});
