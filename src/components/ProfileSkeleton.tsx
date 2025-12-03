import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import {colors} from '@/utils';

const initialLayout = {width: Dimensions.get('window').width};

const ProfileSkeleton = () => {
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
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.title} />
        <View style={styles.settingIcon} />
      </View>

      {/* Profile Info Skeleton */}
      <View style={styles.infoContainer}>
        <View style={styles.myInfoContainer}>
          <View style={styles.myInfo2}>
            <View style={styles.avatar} />
            <View style={styles.myInfo3}>
              <View style={styles.infoItem}>
                <View style={styles.infoNumber} />
                <View style={styles.infoLabel} />
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoNumber} />
                <View style={styles.infoLabel} />
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoNumber} />
                <View style={styles.infoLabel} />
              </View>
            </View>
          </View>
          <View style={styles.username} />
          <View style={styles.description} />
        </View>
      </View>

      {/* Tab Bar Skeleton */}
      <View style={styles.tabBar}>
        <View style={styles.tabItem} />
        <View style={styles.tabItem} />
      </View>

      {/* Tab Content Skeleton */}
      <View style={styles.tabContent}>
        <View style={styles.postGrid}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.postItem}>
              <View style={styles.postImage} />
              <View style={styles.postTitle} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  title: {
    width: 150,
    height: 24,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  settingIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gray,
  },
  infoContainer: {
    minHeight: 140,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  myInfoContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  myInfo2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
  },
  myInfo3: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 32,
  },
  infoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 4,
  },
  infoNumber: {
    width: 40,
    height: 16,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  infoLabel: {
    width: 60,
    height: 12,
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.gray,
  },
  username: {
    width: 120,
    height: 24,
    backgroundColor: colors.gray,
    borderRadius: 4,
    marginTop: 8,
  },
  description: {
    width: '80%',
    height: 16,
    backgroundColor: colors.gray,
    borderRadius: 4,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  tabItem: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    flex: 1,
    backgroundColor: colors.light,
  },
  postGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  postItem: {
    width: (initialLayout.width - 32) / 3,
    margin: 4,
    aspectRatio: 1,
    backgroundColor: colors.light,
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '80%',
    backgroundColor: colors.gray,
  },
  postTitle: {
    width: '80%',
    height: 12,
    backgroundColor: colors.gray,
    borderRadius: 4,
    marginTop: 4,
    marginHorizontal: 4,
  },
});

export { ProfileSkeleton };
export default ProfileSkeleton; 