import React from 'react';
import { View, Pressable, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/utils';

interface NumberSpinnerProps {
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

const NumberSpinner: React.FC<NumberSpinnerProps> = ({
    value,
    onValueChange,
    min = 1,
    max = 100,
    step = 1,
}) => {
    const handleIncrease = () => {
        if (value < max) {
            onValueChange(value + step);
        }
    };

    const handleDecrease = () => {
        if (value > min) {
            onValueChange(value - step);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={[
                    styles.button,
                    value <= min && styles.buttonDisabled,
                ]}
                onPress={handleDecrease}
                disabled={value <= min}
            >
                <Text style={[styles.buttonText, value <= min && styles.textDisabled]}>−</Text>
            </Pressable>

            <View style={styles.displayContainer}>
                <Text style={styles.displayText}>{value}</Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    value >= max && styles.buttonDisabled,
                ]}
                onPress={handleIncrease}
                disabled={value >= max}
            >
                <Text style={[styles.buttonText, value >= max && styles.textDisabled]}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        backgroundColor: colors.InputBg,
        height: 46,
        paddingHorizontal: 4,
    },
    button: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        // backgroundColor: colors.primary,
    },
    buttonDisabled: {
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
    },
    textDisabled: {
        color: '#999',
    },
    displayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    displayText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
    },
});

export { NumberSpinner };
export default NumberSpinner;
