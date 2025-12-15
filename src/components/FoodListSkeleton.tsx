import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '@/utils';

interface FoodListSkeletonProps {
  count?: number;
}

const FoodListSkeleton: React.FC<FoodListSkeletonProps> = ({ count = 6 }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const skeletonArray = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {skeletonArray.map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.skeletonItem,
              {
                opacity,
              },
            ]}
          >
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonText1} />
            <View style={styles.skeletonText2} />
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    padding: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonItem: {
    width: '47%',
    marginBottom: 14,
    backgroundColor: colors.light,
  },
  skeletonImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.gray,
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonText1: {
    width: '80%',
    height: 14,
    backgroundColor: colors.gray,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonText2: {
    width: '60%',
    height: 12,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
});

export { FoodListSkeleton };
export default FoodListSkeleton;
