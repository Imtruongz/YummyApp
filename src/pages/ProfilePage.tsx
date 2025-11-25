import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  TabView,
  SceneMap,
  TabBar,
  SceneRendererProps,
  NavigationState,
  Route,
} from 'react-native-tab-view';

import CustomAvatar from '../components/customize/Avatar';
import CustomTitle from '../components/customize/Title';
import ProfileSkeleton from '../components/skeleton/ProfileSkeleton';
import HomeHeader from '../components/HomeHeader';

import imgUrl from '../utils/urlImg';
import FirstRoute from '../components/FirstRoute';
import SecondRoute from '../components/SecondRoute';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import colors from '../utils/color';
import {getUserByIdAPI} from '../redux/slices/auth/authThunk';
import { countFollowersAPI, countFollowingAPI } from '../redux/slices/follow/followThunk';

import {MMKV} from 'react-native-mmkv';
import Typography from '../components/customize/Typography';
import {useTranslation} from 'react-i18next';

const storage = new MMKV();

const initialLayout = {width: Dimensions.get('window').width};

interface InfoItemProps {
  number: number | string;
  label: string;
}

import { TouchableOpacity } from 'react-native';
const InfoItem: React.FC<InfoItemProps & { onPress?: () => void }> = ({number, label, onPress}) => (
  onPress ? (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.infoItem, styles.infoItemTouchable]}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <Typography
        title={number === undefined || number === null ? '0' : String(number)}
        fontSize={16}
      />
      <Typography title={label} fontSize={13} />
    </TouchableOpacity>
  ) : (
    <View style={styles.infoItem}>
      <Typography title={number === undefined || number === null ? '0' : String(number)} fontSize={14} />
      <Typography title={label} fontSize={13} />
    </View>
  )
);

interface ProfilePageProps
  extends NativeStackScreenProps<RootStackParamList, 'ProfilePage'> {}

const ProfilePage: React.FC<ProfilePageProps> = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState(storage.getString('userId') || '');

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {key: 'first', title: t('profile_your_posts')},
    {key: 'second', title: t('profile_your_favorites')},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  useEffect(() => {
    // Cập nhật các tiêu đề tab mỗi khi ngôn ngữ thay đổi
    setRoutes([
      {key: 'first', title: t('profile_your_posts')},
      {key: 'second', title: t('profile_your_favorites')},
    ]);
  }, [t]); // Đảm bảo rằng nó được cập nhật khi 't' thay đổi


  const {user, isLoadingUser, isErrorUser} = useAppSelector((state: RootState) => state.auth);
  const {userFoodList} = useAppSelector((state: RootState) => state.food);
  const followInfo = useAppSelector((state: RootState) => state.follow.byUserId[userId] || {});
  const followerCount = followInfo.followerCount ?? 0;
  const followingCount = followInfo.followingCount ?? 0;
  const followLoading = followInfo.loading ?? false;
  console.log('ProfilePage - followerCount:', followerCount, 'followingCount:', followingCount);

  const renderTabBar = (
    props: SceneRendererProps & {navigationState: NavigationState<Route>},
  ) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.primaryHover}}
      style={{backgroundColor: colors.light}}
      activeColor={colors.primaryHover}
      inactiveColor={colors.dark}
    />
  );


  useEffect(() => {
    if (userId) {
      dispatch(getUserByIdAPI({userId}));
      dispatch(countFollowersAPI(userId));
      dispatch(countFollowingAPI(userId));
    }
  }, [dispatch, userId]);

  if (isLoadingUser) {
    return <ProfileSkeleton />;
  }

  const handleFollowersPress = () => {
    // @ts-ignore
    navigation.navigate('FollowersFollowingListScreen', { userId, type: 'followers' });
  };
  const handleFollowingPress = () => {
    // @ts-ignore
    navigation.navigate('FollowersFollowingListScreen', { userId, type: 'following' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader mode="profile" title={t('profile_my_profile_header')} showNotification={false} />
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
                image={user?.avatar || imgUrl.defaultAvatar}
              />
              <View style={styles.myInfo3}>
                <InfoItem
                  number={userFoodList.length ?? 0}
                  label={t('profile_posts')}
                />
                <InfoItem
                  number={followLoading ? '...' : followerCount}
                  label={t('profile_followers')}
                  onPress={handleFollowersPress}
                />
                <InfoItem
                  number={followLoading ? '...' : followingCount}
                  label={t('profile_following')}
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
        navigationState={{index, routes}}
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
  },
  myInfo3: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  infoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minWidth: 64,
  },
  infoItemTouchable: {
    borderRadius: 10,
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
  icon: {
    padding: 12,
  },
  title: {
    padding: 12,
  },
});

export default ProfilePage;
