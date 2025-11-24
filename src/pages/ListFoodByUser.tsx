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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { getUserByIdAPI } from '../redux/slices/auth/authThunk.ts';
import { getFoodByIdAPI } from '../redux/slices/food/foodThunk';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { useNotification } from '../contexts/NotificationContext';
import api from '../api/config';
import { RootState } from '../redux/store';
import {
  isFollowingAPI,
  followUserAPI,
  unfollowUserAPI,
  countFollowersAPI,
  countFollowingAPI
} from '../redux/slices/follow/followThunk';
import { resetViewedUser } from '../redux/slices/auth/authSlice';
import { resetViewedUserFoodList } from '../redux/slices/food/foodSlice';

import colors from '../utils/color.ts';
import imgUrl from '../utils/urlImg.ts';
import HomeHeader from '../components/HomeHeader';
import CustomAvatar from '../components/customize/Avatar.tsx';
import Loading from '../components/Loading.tsx';
import NoData from '../components/NoData';
import FoodItemCard from '../components/FoodItemCard';

interface ListFoodByUserPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ListFoodByUserPage'> { }

interface InfoItemProps {
  number: number | string;
  label: string;
}

// Component Stats Card
const StatsCard: React.FC<InfoItemProps> = ({ number, label }) => (
  <View style={styles.statsCard}>
    <Text style={styles.statsNumber}>{number}</Text>
    <Text style={styles.statsLabel}>{label}</Text>
  </View>
);

const ListFoodByUser: React.FC<ListFoodByUserPageProps> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
  const { userId } = route.params;
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const { showNotification } = useNotification();


  const { viewedUserFoodList, isLoadingFood } = useAppSelector((state: RootState) => state.food);
  const { viewedUser, isLoadingUser } = useAppSelector((state: RootState) => state.auth);
  const followInfo = useAppSelector((state: RootState) => state.follow.byUserId[userId] || {});
  const followerCount = followInfo.followerCount ?? 0;
  const followingCount = followInfo.followingCount ?? 0;
  const isFollowing = followInfo.isFollowing ?? false;
  const followLoading = followInfo.loading ?? false;

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
        dispatch(getFoodByIdAPI({ userId, isViewMode: true })),
        dispatch(getUserByIdAPI({ userId, isViewMode: true }))
      ]);
    } catch (error) {
      console.log('Error loading user data:', error);
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

  // Kiểm tra thông tin ngân hàng của người dùng trước khi chuyển đến màn hình Donate
  const handleDonatePress = useCallback(async () => {
    try {
      console.log('[ListFoodByUser] userId before checking bank account:', userId);
      console.log('[ListFoodByUser] User info:', viewedUser);
      
      // Kiểm tra xem người dùng đích có tài khoản ngân hàng hay không
      // Loại bỏ dấu / ở đầu vì baseURL đã có /api
      const response = await api.get(`bank-accounts/${userId}`);
      console.log('[ListFoodByUser] Bank account check response:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        console.log('[ListFoodByUser] Navigating to PaymentScreen with userId:', userId);
        // Nếu có thông tin ngân hàng, chuyển đến màn hình PaymentScreen
        navigation.navigate('PaymentScreen', {
          amount: 0,
          userId: userId,
          serviceType: 'Thanh toán dịch vụ',
          serviceProvider: 'YummyApp'
        });
      } else {
        // Nếu không có thông tin ngân hàng, hiển thị thông báo
        showNotification({
          type: 'warning',
          title: t('no_bank_account_title', 'Thông báo'),
          message: t('no_bank_account_message'),
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.log('Error checking bank account:', error);
      
      // Nếu lỗi 404 (người dùng chưa có tài khoản ngân hàng), chỉ hiển thị thông báo thông tin
      if (error?.response?.status === 404) {
        showNotification({
          type: 'warning',
          title: t('no_bank_account_title', 'Thông báo'),
          message: t('no_bank_account_message'),
          duration: 3000,
        });
      } else {
        // Các lỗi khác không hiện thông báo, chỉ log ra console
        console.log('Unexpected error when checking bank account:', error);
      }
    }
  }, [userId, navigation, showNotification, t]);

  if (isLoadingFood || isLoadingUser) {
    return <Loading />;
  }

  const hasNoData = !viewedUserFoodList || viewedUserFoodList.length === 0;

  const renderFoodItem = ({ item }: { item: any }) => (
    <FoodItemCard 
      containerStyle={{ width: cardWidth, margin: 4 }}
      item={item} 
      onPress={() => handleFoodPress(item.foodId, item.userId)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader
        mode="back"
        title=''
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
          <View style={styles.infoBlock3}>
            <Text style={styles.username}>{viewedUser?.username}</Text>
            {viewedUser?.description && (
              <Text style={styles.bio} numberOfLines={2}>
                {viewedUser.description}
              </Text>
            )}
          </View>
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

        <View style={styles.handleFlDnt}>
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
          <TouchableOpacity
            style={styles.followButton}
            onPress={() => handleDonatePress()}
            activeOpacity={0.8}
            disabled={followLoading}
          >
            <Text style={styles.followButtonText}>
              Donate
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    flexDirection: 'row',
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
    alignItems: 'flex-start',
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
  title2: {
    fontSize: 12,
    color: colors.smallText,
  },
  handleFlDnt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
});
