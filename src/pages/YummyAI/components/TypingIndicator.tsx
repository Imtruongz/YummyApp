import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '@/utils';

const TypingIndicator: React.FC = () => {
  const [animValue1] = useState(new Animated.Value(0));
  const [animValue2] = useState(new Animated.Value(0));
  const [animValue3] = useState(new Animated.Value(0));

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: -8,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    };

    Animated.parallel([
      createAnimation(animValue1, 0),
      createAnimation(animValue2, 150),
      createAnimation(animValue3, 300),
    ]).start();
  }, [animValue1, animValue2, animValue3]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          {
            transform: [{ translateY: animValue1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            transform: [{ translateY: animValue2 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            transform: [{ translateY: animValue3 }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});

export default TypingIndicator;
