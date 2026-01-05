import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStack } from '@/navigation/types';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { getAllCommentFromFoodIdAPI, addCommentToFoodAPI, deleteCommentAPI } from '@/redux/slices/review/reviewThunk';
import { getAverageRatingAPI, addOrUpdateRatingAPI, getUserRatingAPI } from '@/redux/slices/rating/ratingThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getUserByIdAPI } from '@/redux/slices/auth/authThunk';
import { review } from '@/redux/slices/review/types';
import { addFavoriteFoodAPI } from '@/redux/slices/favorite/favoriteThunk';
import { getDetailFoodAPI, getFoodByIdAPI } from '@/redux/slices/food/foodThunk';
import {
  selectSelectedFood,
  selectViewedUserFoodList,
  selectFoodReviewList,
  selectUser,
} from '@/redux/selectors';

import { IconSvg, CustomInput, RatingInput, ConfirmationModal, CustomAvatar } from '@/components'
import { img, colors, ImagesSvg, formatDate, formatDateTime, showToast, handleAsyncAction, useModal, tryCatch, getStorageString, navigate, goBack, replace } from '@/utils'
import { useLoading } from '@/hooks/useLoading'
interface RecipeDetailPageProps
  extends NativeStackScreenProps<HomeStack, 'FoodDetailScreen'> { }

const FoodDetailScreen: React.FC<RecipeDetailPageProps> = ({ route }) => {
  const { foodId, userId } = route.params;
  const myUserId = getStorageString('userId') || '';
  const { LoadingShow, LoadingHide } = useLoading();
  const [showstrInstructions, setShowstrInstructions] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const { isVisible: isDeleteModalVisible, open: openDeleteModal, close: closeDeleteModal } = useModal();
  const [currentItem, setCurrentItem] = useState<review | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [userRating, setUserRating] = useState<number>(0);
  const [dialogTitle, setDialogTitle] = useState('');

  const [totalRatings, setTotalRatings] = useState<number>(0);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedFood = useAppSelector(selectSelectedFood);
  const userFoodList = useAppSelector(selectViewedUserFoodList);
  const moreFoods = useMemo(() => (userFoodList || []).filter(f => f.foodId !== foodId), [userFoodList, foodId]);
  const foodReviewList = useAppSelector(selectFoodReviewList);
  const user = useAppSelector(selectUser);
  const [iconColor, setIconColor] = useState<string>(colors.light);

  const showDialog = (item: review) => {
    setCurrentItem(item);
    if (item.userId === myUserId) {
      setDialogTitle('Delete');
      openDeleteModal();
    }
  };
  const handleCancel = () => {
    if (currentItem) {
      closeDeleteModal();
    }
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 275) {
      setIconColor(colors.secondary);
    } else {
      setIconColor(colors.light);
    }
  };

  const loadFoodDetails = async () => {
    try {
      await dispatch(getDetailFoodAPI(foodId));
    } catch (error) {
      console.log('Error loading food details:', error);
    }
  };

  const loadComments = async () => {
    try {
      await dispatch(getAllCommentFromFoodIdAPI(foodId));
    } catch (error) {
      console.log('Error loading comments:', error);
    }
  };

  const loadUserInfo = async () => {
    try {
      await dispatch(getUserByIdAPI({ userId: myUserId }));
    } catch (error) {
      console.log('Error loading user info:', error);
    }
  };

  const loadUserFoodList = async () => {
    try {
      await dispatch(getFoodByIdAPI({ userId, isViewMode: true }));
    } catch (error) {
      console.log('Error loading user food list:', error);
    }
  };

  const loadRatingData = async () => {
    const result = await tryCatch(async () => {
      return await dispatch(getAverageRatingAPI(foodId)).unwrap();
    });
    
    if (result.success && result.data) {
      setAverageRating(result.data.averageRating || 0);
      setTotalRatings(result.data.totalRatings || 0);
    }
    
    return result;
  };

  const loadUserRating = async () => {
    if (!myUserId) return { success: false };
    
    const result = await tryCatch(async () => {
      return await dispatch(getUserRatingAPI({ foodId, userId: myUserId })).unwrap();
    });
    
    if (result.success && result.data) {
      setUserRating(result.data?.rating || 0);
    } else {
      setUserRating(0);
    }
    
    return result;
  };

  useEffect(() => {
    LoadingShow();
    const loadInitialData = async () => {
      try {
        // Load basic data in parallel
        await Promise.all([
          loadFoodDetails(),
          loadComments(),
          loadUserInfo(),
          loadUserFoodList(),
          loadRatingData(),
          loadUserRating()
        ]);
      } catch (error) {
        console.log('Error loading food detail screen data:', error);
      } finally {
        LoadingHide();
      }
    };
    
    loadInitialData();
  }, [dispatch, foodId, myUserId, userId]);

  const handleDelete = async () => {
    closeDeleteModal();
    if (currentItem) {
      LoadingShow();
      await handleAsyncAction(
        async () => {
          await dispatch(deleteCommentAPI(currentItem.reviewId)).unwrap();
          await dispatch(getAllCommentFromFoodIdAPI(foodId));
        },
        {
          onSuccess: () => {
            LoadingHide();
            showToast.success(t('success_title'), t('toast_messages.toast_comment_delete_success'));
          },
          onError: () => {
            LoadingHide();
            showToast.error(t('error_title'), t('toast_messages.toast_comment_delete_error'));
          }
        }
      );
    }
  };

  const handleAddFavoriteFood = async () => {
    if (!myUserId || !foodId) {
      showToast.error(t('error_title'), t('toast_messages.toast_food_added_error'));
      return;
    }
    LoadingShow();
    await handleAsyncAction(
      async () => {
        await dispatch(addFavoriteFoodAPI({
          userId: myUserId,
          foodId: foodId,
        }),).unwrap();
      },
      {
        onSuccess: () => {
          LoadingHide()
          showToast.success(t('success_title'), t('toast_messages.toast_food_added_success'));
        },
        onError: () => {
          LoadingHide()
          showToast.error(t('error_title'), t('toast_messages.toast_food_added_error'));
        }
      }
    );
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      setCommentError('Please enter a comment');
      return;
    }

    setCommentError(null);
    LoadingShow();
    await handleAsyncAction(
      async () => {
        await dispatch(
          addCommentToFoodAPI({
            foodId: foodId,
            userId: myUserId,
            reviewText: commentText.trim(),
          }),
        ).unwrap();

        setCommentText('');
        await dispatch(getAllCommentFromFoodIdAPI(foodId));
      },
      {
        onSuccess: () => {
          LoadingHide();
          showToast.success(t('success_title'), t('toast_messages.toast_comment_add_success'));
        },
        onError: () => {
          LoadingHide();
          setCommentError('Failed to add the comment. Please try again.');
          showToast.error(t('error_title'), t('toast_messages.toast_comment_add_error'));
        }
      }
    );
  };

  const handleRatingChange = async (rating: number) => {
    LoadingShow();
    await handleAsyncAction(
      async () => {
        await dispatch(
          addOrUpdateRatingAPI({
            foodId: foodId,
            userId: myUserId,
            rating: rating,
          }),
        ).unwrap();

        setUserRating(rating);

        // Refresh average rating
        const ratingResult = await dispatch(getAverageRatingAPI(foodId)).unwrap();
        setAverageRating(ratingResult.averageRating || 0);
        setTotalRatings(ratingResult.totalRatings || 0);
      },
      {
        onSuccess: () => {
          LoadingHide();
          showToast.success(t('success_title'), t('toast_messages.toast_rating_success', { rating }));
        },
        onError: () => {
          LoadingHide();
          showToast.error(t('error_title'), t('toast_messages.toast_rating_error'));
        }
      }
    );
  };

  const ItemView = (icon?: string, value?: string | number, label?: string) => {
    return (
      <View style={styles.statItem}>
        {icon && <IconSvg xml={icon} width={24} height={24} color={colors.primary} />}
        <View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      </View>
    );
  };

  const CommentItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onLongPress={() => showDialog(item)}
        key={item.reviewId}
        style={styles.commentCard}>
        <CustomAvatar
          width={40}
          height={40}
          borderRadius={20}
          image={item.userDetail.avatar || img.defaultAvatar}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{item.userDetail.username}</Text>
            <Text style={styles.commentTime}>{formatDateTime(item.createdAt)}</Text>
          </View>
          <Text style={styles.commentText}>{item.reviewText}</Text>
        </View>
      </TouchableOpacity>
    )
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: iconColor }]}
          onPress={goBack}
        >
          <IconSvg xml={ImagesSvg.icArrowLeft} width={24} height={24} color='black' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: iconColor }]}
          onPress={handleAddFavoriteFood}
        >
          <IconSvg xml={ImagesSvg.icHeart} width={24} height={24} color='black' />
        </TouchableOpacity>
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <ImageBackground
            style={styles.heroImage}
            source={{ uri: selectedFood?.foodThumbnail }}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']}
              style={styles.heroGradient}>
              <Text style={styles.heroTitle}>{selectedFood?.foodName}</Text>
            </LinearGradient>
          </ImageBackground>

          <View style={styles.contentSection}>
            <TouchableOpacity
              style={styles.authorCard}
              onPress={() => {
                if (selectedFood?.userId) {
                  navigate('ListFoodByUserPage', { userId: selectedFood.userId });
                }
              }}>
              <CustomAvatar
                width={56}
                height={56}
                borderRadius={28}
                image={selectedFood?.userDetail.avatar || img.defaultAvatar}
              />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.authorName}>{selectedFood?.userDetail.username}</Text>
                <Text style={styles.authorEmail}>{selectedFood?.userDetail.email}</Text>
              </View>
              <View style={{ transform: [{ rotate: '180deg' }] }}>
                <IconSvg xml={ImagesSvg.icArrowLeft} width={20} height={20} color={colors.primary} />
              </View>
            </TouchableOpacity>
            {/* Stats Row */}
            <View style={styles.statsRow}>
              {ItemView(ImagesSvg.icDate, formatDate(selectedFood?.createdAt), t('recipe_detail_screen.recipe_detail_created_date'))}
              {ItemView(ImagesSvg.icTime, selectedFood?.CookingTime, t('recipe_detail_screen.recipe_detail_cooking_time'))}
              {ItemView(ImagesSvg.icStar, averageRating.toFixed(1), t('recipe_detail_screen.recipe_detail_ratings'))}
            </View>
            {/* Category Badge */}
            {selectedFood?.categoryDetail && (
              <TouchableOpacity
                style={styles.categoryBadge}
                onPress={() => {
                  navigate('CategoriesScreen', {
                    categoryId: selectedFood.categoryDetail?.categoryId,
                  });
                }}
              >
                <Text style={styles.categoryText}>{selectedFood.categoryDetail.categoryName}</Text>
              </TouchableOpacity>
            )}

            {/* Description Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{t('recipe_detail_screen.recipe_detail_description')}</Text>
              {selectedFood?.foodDescription &&
                selectedFood?.foodDescription.length > 150 ? (
                <>
                  <Text style={styles.descriptionText}>
                    {showstrInstructions
                      ? selectedFood?.foodDescription
                      : selectedFood?.foodDescription.substring(0, 150) + '...'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowstrInstructions(!showstrInstructions)}>
                    <Text style={styles.readMoreBtn}>
                      {showstrInstructions ? 'Show less' : 'Read more'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.descriptionText}>{selectedFood?.foodDescription}</Text>
              )}
            </View>

            {/* Ingredients Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{t('recipe_detail_screen.recipe_detail_ingredient')}</Text>
              <View style={styles.ingredientsList}>
                {selectedFood?.foodIngredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <View style={styles.ingredientBullet} />
                    <Text style={styles.ingredientName}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Steps Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{t('recipe_detail_screen.recipe_detail_step')}</Text>
              <View style={styles.stepsList}>
                {selectedFood?.foodSteps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Rating Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{t('recipe_detail_screen.recipe_detail_your_rating')}</Text>
              <RatingInput
                rating={userRating}
                onRatingChange={handleRatingChange}
              />
            </View>

            {/* Comments Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.commentsHeader}>
                <Text style={styles.sectionTitle}>{t('recipe_detail_screen.recipe_detail_comment')}</Text>
              </View>

              {foodReviewList.map(item => (
                <CommentItem item={item} key={item.reviewId} />
              ))}

              {/* Add Comment Input */}
              <View style={styles.addCommentSection}>
                <CustomAvatar
                  width={40}
                  height={40}
                  borderRadius={20}
                  image={user?.avatar || img.defaultAvatar}
                />
                <CustomInput
                  placeholder={t('recipe_detail_screen.recipe_detail_comment_placeholder')}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline={true}
                  numberOfLines={3}
                  style={styles.commentInputField}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleAddComment}
                >
                  <IconSvg xml={ImagesSvg.icSend} width={20} height={20} color={colors.light} />
                </TouchableOpacity>
              </View>
            </View>

            {/* More Recipes Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{t('recipe_detail_screen.recipe_detail_more_food')}</Text>
              <FlatList
                data={moreFoods}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.foodId}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.recipeCard}
                    onPress={() =>
                      replace('FoodDetailScreen', {
                        foodId: item.foodId,
                        userId: item.userId,
                      })
                    }>
                    <Image
                      style={styles.recipeImage}
                      source={{ uri: item.foodThumbnail }}
                    />
                    <View style={styles.recipeInfo}>
                      <Text style={styles.recipeName} numberOfLines={2}>{item.foodName}</Text>
                      <View style={styles.recipeRating}>
                        <IconSvg xml={ImagesSvg.icStar} width={14} height={14} color={colors.primary} />
                        <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

            {commentError && <Text style={styles.errorText}>{commentError}</Text>}
          </View>
        </ScrollView>
      </SafeAreaView>
      <ConfirmationModal
        visible={isDeleteModalVisible}
        title={dialogTitle === 'Hidden' ? t('recipe_detail_screen.recipe_detail_not_authorized_title') : t('recipe_detail_screen.recipe_detail_delete_comment_title')}
        message={dialogTitle === 'Hidden'
          ? t('recipe_detail_screen.recipe_detail_not_authorized_message')
          : t('recipe_detail_screen.recipe_detail_delete_comment_message')}
        type={dialogTitle === 'Hidden' ? 'warning' : 'error'}
        onClose={handleCancel}
        onConfirm={dialogTitle === 'Hidden' ? handleCancel : handleDelete}
        confirmText={dialogTitle === 'Hidden' ? t('ok') : t('delete')}
        cancelText={dialogTitle === 'Hidden' ? undefined : t('cancel')}
      />
    </>
  );
};

export default FoodDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  headerButton: {
    position: 'absolute',
    top: 42,
    left: 22,
    zIndex: 10,
    padding: 10,
    borderRadius: 50,
  },
  favoriteButton: {
    position: 'absolute',
    top: 42,
    right: 22,
    zIndex: 10,
    padding: 10,
    borderRadius: 50,
  },
  heroImage: {
    height: 280,
    width: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light,
    margin: 16,
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  authorEmail: {
    fontSize: 12,
    color: colors.smallText,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f2f2f2ff',
    borderRadius: 12,
    padding: 12,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  statLabel: {
    fontSize: 11,
    color: colors.smallText,
    fontWeight: '500',
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  categoryText: {
    color: colors.light,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.smallText,
  },
  readMoreBtn: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
  },
  ingredientsList: {
    gap: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  ingredientBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  ingredientName: {
    fontSize: 14,
    color: colors.dark,
    flex: 1,
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: colors.light,
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 22,
    flex: 1,
    marginTop: 2,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentCard: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginBottom: 4,
    gap: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  commentTime: {
    fontSize: 10,
    color: colors.smallText,
  },
  commentText: {
    fontSize: 13,
    color: colors.primaryText,
    lineHeight: 20,
    marginTop: 4,
  },
  addCommentSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  commentInputField: {
    flex: 1,
    height: 52,
    backgroundColor: colors.InputBg,
    paddingHorizontal: 12,
    marginHorizontal: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  recipeCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.light,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  recipeInfo: {
    padding: 10,
  },
  recipeName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  recipeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.smallText,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginVertical: 12,
  },
});
