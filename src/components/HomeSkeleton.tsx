import React from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import {colors} from '@/utils';

const HomeSkeleton = () => {
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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Skeleton */}
        <View style={styles.headerContainer}>
          <View style={styles.header1}>
            <View style={styles.avatar} />
            <View>
              <View style={styles.greetingText} />
              <View style={styles.username} />
            </View>
          </View>
          <View style={styles.bellIcon} />
        </View>

        {/* Popular Category Title Skeleton */}
        <View style={styles.titleContainer}>
          <View style={styles.titleText} />
        </View>

        {/* Categories Skeleton */}
        <View style={styles.categoriesContainer}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryText} />
              <View style={styles.categoryImage} />
            </View>
          ))}
        </View>

        {/* Daily Food Title Skeleton */}
        <View style={styles.titleContainer}>
          <View style={styles.titleText} />
          <View style={styles.seeAllText} />
        </View>

        {/* Daily Food List Skeleton */}
        <View style={styles.foodListContainer}>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.foodItem}>
              <View style={styles.foodImage} />
              <View style={styles.foodInfo}>
                <View style={styles.foodName} />
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar} />
                  <View style={styles.userName} />
                </View>
              </View>
              <View style={styles.favoriteIcon} />
            </View>
          ))}
        </View>

        {/* Popular Creator Title Skeleton */}
        <View style={styles.titleContainer}>
          <View style={styles.titleText} />
        </View>

        {/* Popular Creator List Skeleton */}
        <View style={styles.creatorListContainer}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.creatorItem}>
              <View style={styles.creatorAvatar} />
              <View style={styles.creatorName} />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Food Button Skeleton */}
      <View style={styles.addFoodBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.light,
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gray,
  },
  greetingText: {
    width: 120,
    height: 20,
    backgroundColor: colors.gray,
    borderRadius: 4,
    marginBottom: 4,
  },
  username: {
    width: 100,
    height: 20,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  bellIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  titleText: {
    width: 150,
    height: 24,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  seeAllText: {
    width: 60,
    height: 20,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  categoryItem: {
    minWidth: 100,
    minHeight: 100,
    margin: 10,
    borderRadius: 10,
    backgroundColor: colors.light,
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    padding: 6,
  },
  categoryText: {
    width: '80%',
    height: 16,
    backgroundColor: colors.gray,
    borderRadius: 4,
    marginBottom: 8,
  },
  categoryImage: {
    width: 100,
    height: 50,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  foodListContainer: {
    paddingHorizontal: 4,
  },
  foodItem: {
    width: 300,
    height: 200,
    margin: 10,
    borderRadius: 20,
    backgroundColor: colors.light,
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
  },
  foodImage: {
    width: 140,
    height: 200,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: colors.gray,
  },
  foodInfo: {
    padding: 14,
    justifyContent: 'flex-start',
    gap: 14,
    width: '60%',
    height: '100%',
  },
  foodName: {
    width: '80%',
    height: 24,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gray,
  },
  userName: {
    width: 100,
    height: 16,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  favoriteIcon: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray,
  },
  creatorListContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  creatorItem: {
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  creatorAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray,
  },
  creatorName: {
    width: 80,
    height: 16,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  addFoodBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gray,
  },
});

export { HomeSkeleton };
export default HomeSkeleton; 