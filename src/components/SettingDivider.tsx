import React from 'react';
import { View, StyleSheet } from 'react-native';

export const SettingDivider: React.FC = () => {
    return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 16,
    },
});
