import { View, StyleSheet, Dimensions, Text} from 'react-native';
import React, { useState, useEffect } from 'react';
import { TabView, SceneMap, TabBar, SceneRendererProps, NavigationState, Route} from 'react-native-tab-view';
import { MMKV } from 'react-native-mmkv';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getUserByIdAPI } from '@/redux/slices/auth/authThunk';
import { countFollowersAPI, countFollowingAPI } from '@/redux/slices/follow/followThunk';
import {
  selectUser,
  selectIsLoadingUser,
  selectUserFollowInfo,
  selectFollowerCount,
  selectFollowingCount,
  selectUserFoodList,
  selectAuthError,
} from '@/redux/selectors';

import { HomeHeader, CustomTitle, CustomAvatar, FirstRoute, SecondRoute, Typography, ProfileSkeleton } from '@/components'
import {img, colors, navigate} from '@/utils'

const storage = new MMKV();
const initialLayout = { width: Dimensions.get('window').width };

interface InfoItemProps {
  number: number | string;
  label: string;
}

import { TouchableOpacity } from 'react-native';
const InfoItem: React.FC<InfoItemProps & { onPress?: () => void }> = ({ number, label, onPress }) => (
  onPress ? (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.infoItem}
    >
      <Typography
        title={number === undefined || number === null ? '0' : String(number)}
        fontSize={16}
        fontWeight='700'
      />
      <Typography title={label} fontSize={14} />
    </TouchableOpacity>
  ) : (
    <View style={styles.infoItem}>
      <Typography title={number === undefined || number === null ? '0' : String(number)} fontSize={16} fontWeight='700' />
      <Typography title={label} fontSize={14} />
    </View>
  )
);

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState(storage.getString('userId') || '');

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: 'first', title: t('profile_screen.profile_your_posts') },
    { key: 'second', title: t('profile_screen.profile_your_favorites') },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  useEffect(() => {
    setRoutes([
      { key: 'first', title: t('profile_screen.profile_your_posts') },
      { key: 'second', title: t('profile_screen.profile_your_favorites') },
    ]);
  }, [t]);

  const user = useAppSelector(selectUser);
  const isLoadingUser = useAppSelector(selectIsLoadingUser);
  const userFoodList = useAppSelector(selectUserFoodList);
  const followInfo = useAppSelector(selectUserFollowInfo(userId));
  const followerCount = followInfo?.followerCount ?? 0;
  const followingCount = followInfo?.followingCount ?? 0;
  const followLoading = followInfo?.loading ?? false;
  const isErrorUser = useAppSelector(selectAuthError);
  console.log('ProfileScreen - followerCount:', followerCount, 'followingCount:', followingCount);

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: NavigationState<Route> },
  ) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primaryHover }}
      style={{ backgroundColor: colors.light }}
      activeColor={colors.primaryHover}
      inactiveColor={colors.dark}
    />
  );

  useEffect(() => {
    if (userId) {
      dispatch(getUserByIdAPI({ userId }));
      dispatch(countFollowersAPI(userId));
      dispatch(countFollowingAPI(userId));
    }
  }, [dispatch, userId]);

  if (isLoadingUser) {
    return <ProfileSkeleton />;
  }

  const handleFollowersPress = () => {
    navigate('FollowScreen', { userId, type: 'followers' });
  };
  const handleFollowingPress = () => {
    navigate('FollowScreen', { userId, type: 'following' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader mode="profile" title={t('profile_screen.profile_my_profile_header')} showNotification={false} />
      <View style={styles.infoContainer}>
        {isErrorUser ? (
          <Text>{t('Something went wrong')}</Text>
        ) : (
          <View style={styles.myInfoContainer}>
            <View style={styles.myInfo2}>
              <CustomAvatar
                width={70}
                height={70}
                borderRadius={35}
                image={user?.avatar || img.defaultAvatar}
              />
              <View style={styles.myInfo3}>
                <InfoItem
                  number={userFoodList.length ?? 0}
                  label={t('profile_screen.profile_posts')}
                />
                <InfoItem
                  number={followLoading ? '...' : followerCount}
                  label={t('profile_screen.profile_followers')}
                  onPress={handleFollowersPress}
                />
                <InfoItem
                  number={followLoading ? '...' : followingCount}
                  label={t('profile_screen.profile_following')}
                  onPress={handleFollowingPress}
                />
              </View>
            </View>
            <CustomTitle title={user?.username} />
            <Text>{user?.description}</Text>
          </View>
        )}
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabVIewContainer}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    minHeight: 140,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: colors.light,
  },
  myInfoContainer: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  myInfo2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  myInfo3: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tabVIewContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  title: {
    padding: 12,
  },
});

export default ProfileScreen;
