import { Image, View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { RootState } from '@/redux/store';

import { getAllFavoriteFoodsAPI, deleteFavoriteFoodAPI } from '@/redux/slices/favorite/favoriteThunk';
import { NoData, ConfirmationModal, IconSvg } from '@/components'
import { colors, handleAsyncAction, useModal, navigate, getStorageString, ImagesSvg } from '@/utils';
import { useLoading } from '@/hooks/useLoading';

const SecondRoute = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { LoadingShow, LoadingHide } = useLoading();
  const [userId, setUserId] = useState(getStorageString('userId') || '');
  const { favoriteFoodList, isLoadingFavorite } = useAppSelector(
    (state: RootState) => state.favorite,
  );
  const { foodList } = useAppSelector((state: RootState) => state.food);
  const [currentFavoriteId, setCurrentFavoriteId] = useState<string | null>(null);
  const { isVisible: isDeleteModalVisible, open: openDeleteModal, close: closeDeleteModal } = useModal();

  useEffect(() => {
    if (userId) {
      dispatch(getAllFavoriteFoodsAPI(userId));
      console.log('getAllFavoriteFoodsAPI rendered successfully with userId:', userId);
    } else {
      console.log('userId is empty, skipping getAllFavoriteFoodsAPI call');
    }
  }, [dispatch, userId]);

  const showDialog = (favoriteFoodId: string) => {
    setCurrentFavoriteId(favoriteFoodId);
    openDeleteModal();
  };

  const handleCancel = () => {
    closeDeleteModal();
  };

  const handleDeleteFavorite = async () => {
    if (currentFavoriteId && userId) {
      LoadingShow();
      await handleAsyncAction(
        async () => {
          await dispatch(
            deleteFavoriteFoodAPI({
              userId,
              favoriteFoodId: currentFavoriteId,
            }),
          ).unwrap();
        },
        {
          successMessage: t('toast_messages.toast_delete_success'),
          errorMessage: t('toast_messages.toast_delete_error'),
          onSuccess: () => {
            LoadingHide();
          },
          onError: () => {
            LoadingHide();
          }
        }
      );
      closeDeleteModal();
      setCurrentFavoriteId(null);
    }
  };

  // Tìm thông tin food dựa trên foodId từ favoriteFoodList
  const getFoodDetails = (foodId: string) => {
    return foodList.find(food => food.foodId === foodId);
  };

  if (isLoadingFavorite) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!favoriteFoodList || favoriteFoodList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <NoData width={80} height={80} textSize={16} message={t('no_data')} />
        <Text style={styles.emptyText}>{t('profile_screen.no_favorites_yet')}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {favoriteFoodList.map(favorite => {
          const foodDetails = getFoodDetails(favorite.foodId);
          if (!foodDetails) return null;

          return (
            <TouchableOpacity
              key={favorite.favoriteFoodId}
              style={styles.item}
              activeOpacity={0.9}
              onPress={() => {
                navigate('FoodDetailScreen', {
                  foodId: favorite.foodId,
                  userId: favorite.userId,
                });
              }}>
              <Image
                style={styles.img}
                source={{ uri: foodDetails.foodThumbnail }}
              />
              <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                  <Text numberOfLines={1} style={styles.foodName}>{foodDetails.foodName}</Text>
                  <Text numberOfLines={2} style={styles.description}>
                    {foodDetails.foodDescription || t('no_description')}
                  </Text>
                  {/* Rating or Creator info could go here */}
                  <View style={styles.metaContainer}>
                    <Text style={styles.creatorName}>by {foodDetails.userDetail?.username || 'Unknown'}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => showDialog(favorite.favoriteFoodId)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <View style={styles.menuDots}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ConfirmationModal
        visible={isDeleteModalVisible}
        title={t('profile_screen.delete_favorite_title')}
        message={t('profile_screen.delete_favorite_confirmation_message')}
        type="warning"
        onClose={handleCancel}
        onConfirm={handleDeleteFavorite}
        confirmText={t('delete_button')}
        cancelText={t('cancel')}
      />
    </>
  );
};

export { SecondRoute };
export default SecondRoute;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: colors.smallText,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    // overflow: 'hidden', // Xóa dòng này để shadow hiện trên iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // Tăng độ đậm shadow
    shadowRadius: 8,
    elevation: 6, // Tăng elevation cho Android
    height: 110,
    marginBottom: 6, // Thêm margin bottom để shadow không bị che
  },
  img: {
    width: 110,
    height: 110,
    resizeMode: 'cover',
    borderTopLeftRadius: 16, // Bo góc cho ảnh thủ công
    borderBottomLeftRadius: 16,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    gap: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: colors.smallText,
    lineHeight: 16,
    marginBottom: 6,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.primary,
  },
  menuButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuDots: {
    gap: 3,
    padding: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.smallText,
  },
});
