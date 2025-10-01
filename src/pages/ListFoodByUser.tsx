import React, { useEffect, useState, useCallback } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { getUserByIdAPI } from '../redux/slices/auth/authThunk.ts';
import { getFoodByIdAPI } from '../redux/slices/food/foodThunk';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  isFollowingAPI,
  followUserAPI,
  unfollowUserAPI,
  countFollowersAPI,
  countFollowingAPI
} from '../redux/slices/follow/followThunk';
// ...existing code...
import { resetViewedUser } from '../redux/slices/auth/authSlice';
import { resetViewedUserFoodList } from '../redux/slices/food/foodSlice';

import colors from '../utils/color.ts';
import imgUrl from '../utils/urlImg.ts';
import HomeHeader from '../components/HomeHeader';
import CustomAvatar from '../components/customize/Avatar.tsx';
import CustomTitle from '../components/customize/Title.tsx';
import CustomButton from '../components/customize/CustomButton.tsx';
import Typography from '../components/customize/Typography.tsx';
import Loading from '../components/Loading.tsx';
import NoData from '../components/NoData';

interface ListFoodByUserPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ListFoodByUserPage'> { }

interface InfoItemProps {
  number: number | string;
  label: string;
}

interface FoodItemProps {
  item: {
    foodId: string;
    foodName: string;
    foodThumbnail: string;
    userId: string;
  };
  onPress: (foodId: string, userId: string) => void;
}

// Component Stats Card
const StatsCard: React.FC<InfoItemProps> = ({ number, label }) => (
  <View style={styles.statsCard}>
    <Text style={styles.statsNumber}>{number}</Text>
    <Text style={styles.statsLabel}>{label}</Text>
  </View>
);

// Component Food Item Card
const FoodItemCard: React.FC<FoodItemProps> = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.foodCard}
    onPress={() => onPress(item.foodId, item.userId)}
    activeOpacity={0.8}
  >
    <Image
      source={{ uri: item.foodThumbnail }}
      style={styles.foodImage}
      resizeMode="cover"
    />
    <View style={styles.foodInfo}>
      <Text style={styles.foodName} numberOfLines={2}>
        {item.foodName}
      </Text>
    </View>
  </TouchableOpacity>
);

const ListFoodByUser: React.FC<ListFoodByUserPageProps> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
  const { userId } = route.params;
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);


  const { viewedUserFoodList, isLoadingFood } = useAppSelector((state: RootState) => state.food);
  const { viewedUser, isLoadingUser } = useAppSelector((state: RootState) => state.auth);
  const followInfo = useAppSelector((state: RootState) => state.follow.byUserId[userId] || {});
  const followerCount = followInfo.followerCount ?? 0;
  const followingCount = followInfo.followingCount ?? 0;
  const isFollowing = followInfo.isFollowing ?? false;
  const followLoading = followInfo.loading ?? false;

  // Lấy userId hiện tại từ local storage (MMKV hoặc AsyncStorage tuỳ app)
  // Giả sử đã có sẵn userId hiện tại trong localStorage
  const [currentUserId, setCurrentUserId] = useState<string>('');
  useEffect(() => {
    try {
      const { MMKV } = require('react-native-mmkv');
      const storage = new MMKV();
      setCurrentUserId(storage.getString('userId') || '');
    } catch (e) {
      setCurrentUserId('');
    }
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth > 600 ? 3 : 2;
  const cardWidth = (screenWidth - 48) / numColumns - 8;


  useEffect(() => {
    loadData();
    // Lấy trạng thái follow và số follower/following khi vào màn
    if (userId && currentUserId && userId !== currentUserId) {
      dispatch(isFollowingAPI({ followerId: currentUserId, followingId: userId }));
    }
    if (userId) {
      dispatch(countFollowersAPI(userId));
      dispatch(countFollowingAPI(userId));
    }
    return () => {
      dispatch(resetViewedUser());
      dispatch(resetViewedUserFoodList());
    };
  }, [dispatch, userId, currentUserId]);

  const loadData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(getFoodByIdAPI({userId, isViewMode: true})),
        dispatch(getUserByIdAPI({userId, isViewMode: true}))
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [dispatch, userId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleFoodPress = useCallback((foodId: string, userId: string) => {
    navigation.navigate('RecipeDetailPage', { foodId, userId });
  }, [navigation]);


  const handleFollowPress = useCallback(() => {
    if (!currentUserId || !userId || userId === currentUserId) return;
    if (isFollowing) {
      // Unfollow
      dispatch(unfollowUserAPI({ followerId: currentUserId, followingId: userId }))
        .then((action) => {
          if (action.type.endsWith('/fulfilled')) {
            console.log('Unfollow thành công');
          } else {
            console.log('Unfollow thất bại:', action);
          }
          dispatch(isFollowingAPI({ followerId: currentUserId, followingId: userId }));
          dispatch(countFollowersAPI(userId));
        });
    } else {
      // Follow
      dispatch(followUserAPI({ followerId: currentUserId, followingId: userId }))
        .then((action) => {
          if (action.type.endsWith('/fulfilled')) {
            console.log('Follow thành công');
          } else {
            console.log('Follow thất bại:', action);
          }
          dispatch(isFollowingAPI({ followerId: currentUserId, followingId: userId }));
          dispatch(countFollowersAPI(userId));
        });
    }
  }, [currentUserId, userId, isFollowing, dispatch]);

  if (isLoadingFood || isLoadingUser) {
    return <Loading />;
  }

  const hasNoData = !viewedUserFoodList || viewedUserFoodList.length === 0;

  const renderFoodItem = ({ item }: { item: any }) => (
    <FoodItemCard item={item} onPress={handleFoodPress} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader 
        mode="back" 
        title={viewedUser?.username || t('profile', 'Profile')} 
        showGoBack={true}
        showNotification={false}
      />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <CustomAvatar
              width={100}
              height={100}
              borderRadius={50}
              image={viewedUser?.avatar || imgUrl.defaultAvatar}
            />
          </View>
          <Text style={styles.username}>{viewedUser?.username}</Text>
          {viewedUser?.description && (
            <Text style={styles.bio} numberOfLines={2}>
              {viewedUser.description}
            </Text>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <StatsCard
            number={viewedUserFoodList?.length ?? 0}
            label={t('profile_posts', 'Posts')}
          />
          <StatsCard
            number={followLoading ? '...' : followerCount}
            label={t('profile_followers', 'Followers')}
          />
          <StatsCard
            number={followLoading ? '...' : followingCount}
            label={t('profile_following', 'Following')}
          />
        </View>

        {/* Action Button */}
        {userId !== currentUserId && (
          <TouchableOpacity
            style={[styles.followButton, isFollowing ? { backgroundColor: colors.gray } : {}]}
            onPress={handleFollowPress}
            activeOpacity={0.8}
            disabled={followLoading}
          >
            <Text style={styles.followButtonText}>
              {followLoading
                ? t('loading', 'Đang xử lý...')
                : isFollowing
                  ? t('profile_unfollow_btn', 'Unfollow')
                  : t('profile_follow_btn', 'Follow')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content Section */}
      {hasNoData ? (
        <View style={styles.emptyContainer}>
          <NoData
            message={t('list_nodata', 'No recipes yet')}
            width={120}
            height={120}
            textSize={16}
          />
          <Text style={styles.emptySubtext}>
            {t('empty_profile_message', 'This user hasn\'t shared any recipes yet')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={viewedUserFoodList}
          keyExtractor={(item) => item.foodId}
          renderItem={renderFoodItem}
          numColumns={numColumns}
          contentContainerStyle={[
            styles.foodGrid,
            { paddingHorizontal: (screenWidth - cardWidth * numColumns - 8 * (numColumns - 1)) / 2 }
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ListFoodByUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Profile Section Styles
  profileSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  statsCard: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Follow Button
  followButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Content Section
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },

  // Food Grid
  foodGrid: {
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Food Card
  foodCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  foodInfo: {
    padding: 12,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 18,
  },

  // Legacy styles (keeping for compatibility)
  infoContainer: {
    paddingVertical: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  infoBlock1: {
    marginBottom: 22,
    gap: 8,
  },
  infoBlock2: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 6,
  },
  infoBlock3: {
    paddingHorizontal: 12,
  },
  infoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 4,
    marginHorizontal: 12,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
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
  titleHeader: {
    padding: 12,
    fontSize: 22,
    fontWeight: 'bold',
  },
  myInfoContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  myInfo2: {
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
  },
  myInfo3: {
    width: 120,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  inputHeader: {
    width: '90%',
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    margin: 18,
  },
  ListFoodContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
    padding: 12,
  },
  itemContainer: {
    width: '47%',
    height: 160,
    backgroundColor: colors.light,
    borderRadius: 15,
    gap: 8,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  titleItemLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 'auto',
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  title2: {
    fontSize: 12,
    color: colors.smallText,
  },
});
