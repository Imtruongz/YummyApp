import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import api from '@/api/config';
import { getUserByIdAPI } from '@/redux/slices/auth/authThunk.ts';
import { getFoodByIdAPI } from '@/redux/slices/food/foodThunk';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { isFollowingAPI, followUserAPI, unfollowUserAPI, countFollowersAPI, countFollowingAPI } from '@/redux/slices/follow/followThunk';
import { resetViewedUser } from '@/redux/slices/auth/authSlice';
import { resetViewedUserFoodList } from '@/redux/slices/food/foodSlice';
import {
  selectViewedUserFoodList,
  selectIsLoadingFood,
  selectViewedUser,
  selectIsLoadingUser,
  selectUserFollowInfo,
} from '@/redux/selectors';

import { HomeHeader, Loading, NoData, FoodItemCard, CustomAvatar } from '@/components'
import { img, colors, handleAsyncAction, showToast, navigate, getStorageString } from '@/utils'

const screenWidth = Dimensions.get('window').width;
const numColumns = screenWidth > 600 ? 3 : 2;
const cardWidth = (screenWidth - 48) / numColumns - 8;

interface InfoItemProps {
  number: number | string;
  label: string;
}

const StatsCard: React.FC<InfoItemProps & { onPress?: () => void }> = ({ number, label, onPress }) => (
  <TouchableOpacity style={styles.statsCard} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.statsNumber}>{number}</Text>
    <Text style={styles.statsLabel}>{label}</Text>
  </TouchableOpacity>
);

const UsersProfileScreen: React.FC = ({ route }: any) => {
  const { t } = useTranslation();
  const { userId } = route.params;
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [showBioExpanded, setShowBioExpanded] = useState(false);

  const viewedUserFoodList = useAppSelector(selectViewedUserFoodList);
  const isLoadingFood = useAppSelector(selectIsLoadingFood);
  const viewedUser = useAppSelector(selectViewedUser);
  const isLoadingUser = useAppSelector(selectIsLoadingUser);
  const followInfo = useAppSelector(selectUserFollowInfo(userId)) || {};
  const followerCount = followInfo.followerCount ?? 0;
  const followingCount = followInfo.followingCount ?? 0;
  const isFollowing = followInfo.isFollowing ?? false;
  const followLoading = followInfo.loading ?? false;

  const [currentUserId, setCurrentUserId] = useState<string>('');
  useEffect(() => {
    try {
      setCurrentUserId(getStorageString('userId') || '');
    } catch (e) {
      setCurrentUserId('');
    }
  }, []);

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
    navigate('FoodDetailScreen', { foodId, userId });
  }, []);


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
    await handleAsyncAction(
      async () => {
        const response = await api.get(`bank-accounts/${userId}`);
        if (response.data && response.data.success && response.data.data) {
          navigate('PaymentScreen', {
            amount: 0,
            userId: userId,
            serviceType: 'Thanh toán dịch vụ',
            serviceProvider: 'YummyApp'
          });
        } else {
          showToast.info(t('notification_screen.notification_title'), t('payment_screen.no_bank_account_message'));
        }
      },
      {
        showSuccessToast: false,
        onError: (error: any) => {
          if (error?.response?.status === 404) {
            showToast.info(t('notification_screen.notification_title'), t('payment_screen.no_bank_account_message'));
          } else {
            console.log('Unexpected error when checking bank account:', error);
          }
        }
      }
    );
  }, [userId, t]);

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

  const renderHeader = () => (
    <View>
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGradientBorder}>
            <CustomAvatar
              width={110}
              height={110}
              borderRadius={55}
              image={viewedUser?.avatar || img.defaultAvatar}
            />
          </View>
        </View>
        <View style={styles.userInfoSection}>
          <View style={styles.userHeaderRow}>
            <Text style={styles.username}>{viewedUser?.username}</Text>
          </View>
          {viewedUser?.description && (
            <TouchableOpacity
              onPress={() => setShowBioExpanded(!showBioExpanded)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.bio, { color: showBioExpanded ? colors.primary : colors.smallText }]}
                numberOfLines={showBioExpanded ? 0 : 2}
              >
                {viewedUser.description}
              </Text>
              {viewedUser.description.length > 50 && (
                <Text style={styles.readMoreText}>
                  {showBioExpanded ? 'Show less' : 'Read more'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.statsSection}>
        <StatsCard
          number={viewedUserFoodList?.length ?? 0}
          label={t('profile_screen.profile_posts')}
          onPress={() => console.log('Posts tapped')}
        />
        <View style={styles.statsDivider} />
        <StatsCard
          number={followLoading ? '...' : followerCount}
          label={t('profile_screen.profile_followers')}
          onPress={() => console.log('Followers tapped')}
        />
        <View style={styles.statsDivider} />
        <StatsCard
          number={followLoading ? '...' : followingCount}
          label={t('profile_screen.profile_following')}
          onPress={() => console.log('Following tapped')}
        />
      </View>
      <View style={styles.actionButtonsSection}>
        {userId !== currentUserId ? (
          <>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isFollowing && styles.secondaryButton
              ]}
              onPress={handleFollowPress}
              activeOpacity={0.8}
              disabled={followLoading}
            >
              {followLoading ? (
                <ActivityIndicator size="small" color={isFollowing ? colors.primary : colors.light} />
              ) : (
                <Text style={[styles.buttonText, isFollowing && styles.secondaryButtonText]} numberOfLines={1}>
                  {isFollowing
                    ? t('profile_screen.unfollow_btn')
                    : t('profile_screen.profile_follow_btn')}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleDonatePress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t('profile_screen.donate_btn')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigate('ProfileScreen')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.gridHeader}>
        <Text style={styles.gridTitle}>{t('profile_screen.profile_posts')} ({viewedUserFoodList?.length ?? 0})</Text>
      </View>
    </View>
  );

  const RenderRefreshControl = () => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.primary]}
      tintColor={colors.primary}
    />
  );

  const RenderEmpty = () => (
    <View style={styles.emptyContainer}>
      <NoData
        message={t('no_data')}
        width={120}
        height={120}
        textSize={16}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <HomeHeader
        mode="back"
        title=''
        showGoBack={true}
        showNotification={false}
        isBackHome={true}
      />
      <FlatList
        data={viewedUserFoodList}
        keyExtractor={(item) => item.foodId}
        renderItem={renderFoodItem}
        numColumns={numColumns}
        scrollEventThrottle={16}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={[styles.foodGrid, { paddingHorizontal: (screenWidth - cardWidth * numColumns - 8 * (numColumns - 1)) / 2 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={RenderRefreshControl()}
        ListEmptyComponent={RenderEmpty()}
      />
    </SafeAreaView>
  );
};

export default UsersProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarGradientBorder: {
    padding: 3,
    borderRadius: 60,
    backgroundColor: colors.primary,
  },
  userInfoSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  userHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  username: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
  },
  bio: {
    fontSize: 14,
    color: colors.smallText,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  readMoreText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 12,
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  statsCard: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  statsNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 11,
    color: colors.smallText,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionButtonsSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: colors.light,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    color: colors.light,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  gridHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  foodGrid: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  title: {
    padding: 12,
  },
});
