import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getFollowingFoodsAPI } from '@/redux/slices/food/foodThunk';
import { selectFollowingFoodList, selectIsLoadingFood } from '@/redux/selectors';

import { HomeHeader } from '@/components';
import { colors, navigateToFoodDetail, getStorageString, ImagesSvg } from '@/utils';
import { useLoading } from '@/hooks/useLoading';

const FollowingFeedScreen = () => {
  const { t } = useTranslation();

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('time.just_now');
    if (diffMins < 60) return t('time.minutes_ago', { count: diffMins });
    if (diffHours < 24) return t('time.hours_ago', { count: diffHours });
    if (diffDays < 7) return t('time.days_ago', { count: diffDays });

    return postDate.toLocaleDateString();
  };

  
  const dispatch = useAppDispatch();
  const { LoadingShow, LoadingHide } = useLoading();

  const followingFoodList = useAppSelector(selectFollowingFoodList);
  const isLoadingFood = useAppSelector(selectIsLoadingFood);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    try {
      const userId = getStorageString('userId') || '';
      setCurrentUserId(userId);
    } catch (e) {
      setCurrentUserId('');
    }
  }, []);

  useEffect(() => {
    if (isLoadingFood) {
      LoadingShow();
    } else {
      LoadingHide();
    }
  }, [isLoadingFood, LoadingShow, LoadingHide]);

  useEffect(() => {
    if (currentUserId) {
      loadFollowingFoods(1);
    }
  }, [currentUserId]);

  const loadFollowingFoods = (pageNum: number) => {
    if (currentUserId) {
      dispatch(getFollowingFoodsAPI({ userId: currentUserId, page: pageNum, limit: 10 }))
        .then((result: any) => {
          if (result.payload && result.payload.pagination) {
            const { page, pages } = result.payload.pagination;
            setHasMoreData(page < pages);
          }
        });
      setPage(pageNum);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingFood && hasMoreData) {
      loadFollowingFoods(page + 1);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.foodCard}
      onPress={() => navigateToFoodDetail(item.foodId, item.userId || '')}
      activeOpacity={0.8}
    >
      {/* Card Header - User Info */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: (item.userDetail?.avatar || item.avatar) || 'https://via.placeholder.com/40' }}
            style={styles.userAvatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.username}>{item.userDetail?.username || item.username}</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(item.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Food Image */}
      <Image
        source={{ uri: item.foodThumbnail }}
        style={styles.foodImage}
      />

      {/* Food Content */}
      <View style={styles.foodContent}>
        {/* Food Name & Description */}
        <Text style={styles.foodName} numberOfLines={2}>{item.foodName}</Text>
        <Text style={styles.foodDesc} numberOfLines={2}>{item.foodDescription}</Text>

        {/* Food Specs */}
        <View style={styles.foodSpecs}>
          {item.CookingTime && (
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>⏱️</Text>
              <Text style={styles.specValue}>{item.CookingTime}</Text>
            </View>
          )}
          {item.difficultyLevel && (
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>📊</Text>
              <Text style={styles.specValue}>{item.difficultyLevel}</Text>
            </View>
          )}
          {item.servings > 0 && (
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>👥</Text>
              <Text style={styles.specValue}>{item.servings}</Text>
            </View>
          )}
        </View>

        {/* Rating & Engagement */}
        <View style={styles.footerInfo}>
          <View style={styles.ratingContent}>
            <Text style={styles.ratingStars}>{'⭐'.repeat(Math.round(item.averageRating || 0))}</Text>
            <Text style={styles.ratingText}>{item.averageRating || 0}</Text>
            <Text style={styles.commentCount}>• {t('comments_count', { count: item.commentCount || 0 })}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ); const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('no_data')}</Text>
      <Text style={styles.emptySubText}>{t('follow_people_to_see_feed')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader
        mode="back"
        title={t('following_feed')}
        showGoBack={true}
        showNotification={false}
        isBackHome={true}
      />
      <FlatList
        data={followingFoodList}
        keyExtractor={(item) => item.foodId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        scrollEventThrottle={400}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eae8e8ff',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  foodCard: {
    backgroundColor: colors.white,
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ddd',
  },
  userDetails: {
    justifyContent: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
    color: colors.smallText,
  },
  foodImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#eee',
  },
  foodContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryText,
  },
  foodDesc: {
    fontSize: 12,
    color: colors.smallText,
    lineHeight: 16,
  },
  foodSpecs: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specLabel: {
    fontSize: 14,
  },
  specValue: {
    fontSize: 11,
    color: colors.primaryText,
    fontWeight: '500',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingStars: {
    fontSize: 11,
  },
  ratingText: {
    fontSize: 12,
    color: colors.primaryText,
    fontWeight: '600',
  },
  commentCount: {
    fontSize: 11,
    color: colors.smallText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.smallText,
    textAlign: 'center',
  },
}); export default FollowingFeedScreen;
