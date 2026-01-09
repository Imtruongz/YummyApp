import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '@/utils';

const { width } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.3);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            {/* Background Gradient Effect */}
            <View style={styles.backgroundCircle1} />
            <View style={styles.backgroundCircle2} />

            {/* Logo & Brand */}
            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Logo/Icon */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoEmoji}>🍽️</Text>
                </View>

                {/* Brand Name */}
                <Text style={styles.brandName}>Yummy</Text>
            </Animated.View>

            {/* Loading Indicator */}
            <View style={styles.loadingContainer}>
                <View style={styles.loadingDot} />
                <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
                <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
            </View>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    backgroundCircle1: {
        position: 'absolute',
        width: width * 1.5,
        height: width * 1.5,
        borderRadius: width * 0.75,
        backgroundColor: colors.primary,
        opacity: 0.05,
        top: -width * 0.5,
        left: -width * 0.25,
    },
    backgroundCircle2: {
        position: 'absolute',
        width: width * 1.2,
        height: width * 1.2,
        borderRadius: width * 0.6,
        backgroundColor: colors.primary,
        opacity: 0.08,
        bottom: -width * 0.4,
        right: -width * 0.3,
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF5F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8,
    },
    logoEmoji: {
        fontSize: 64,
    },
    brandName: {
        fontSize: 48,
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: -1,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 100,
        flexDirection: 'row',
        gap: 12,
    },
    loadingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
        opacity: 0.3,
    },
    loadingDotDelay1: {
        opacity: 0.6,
    },
    loadingDotDelay2: {
        opacity: 1,
    },
});
