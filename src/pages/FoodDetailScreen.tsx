import React, { useEffect, useState, useLayoutEffect } from 'react';
import { FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { MMKV } from 'react-native-mmkv';

import { getAllCommentFromFoodIdAPI, addCommentToFoodAPI, deleteCommentAPI } from '@/redux/slices/review/reviewThunk';
import { getAverageRatingAPI, addOrUpdateRatingAPI, getUserRatingAPI } from '@/redux/slices/rating/ratingThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getUserByIdAPI } from '@/redux/slices/auth/authThunk';
import { review } from '@/redux/slices/review/types';
import { addFavoriteFoodAPI } from '@/redux/slices/favorite/favoriteThunk';
import { getDetailFoodAPI, getFoodByIdAPI } from '@/redux/slices/food/foodThunk';
import {
  selectSelectedFood,
  selectUserFoodList,
  selectIsLoadingFood,
  selectFoodReviewList,
  selectIsLoadingReview,
  selectUser,
  selectIsLoadingUser,
} from '@/redux/selectors';

import { Loading, CustomTitle, IconSvg, CustomInput, RatingInput, Typography, ConfirmationModal, CustomAvatar } from '@/components'
import { img, colors, ImagesSvg, formatDate, formatDateTime, showToast } from '@/utils'

const storage = new MMKV();
interface RecipeDetailPageProps
  extends NativeStackScreenProps<RootStackParamList, 'FoodDetailScreen'> { }

const FoodDetailScreen: React.FC<RecipeDetailPageProps> = ({
  route,
  navigation,
}) => {
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);
  const { foodId, userId } = route.params;
  const myUserId = storage.getString('userId') || '';
  const [showstrInstructions, setShowstrInstructions] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<review | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [userRating, setUserRating] = useState<number>(0);

  const [dialogTitle, setDialogTitle] = useState('');
  const { t, i18n } = useTranslation();

  const showDialog = (item: review) => {
    setCurrentItem(item);
    // Chỉ hiển thị modal nếu bình luận là của chính user
    if (item.userId === myUserId) {
      setDialogTitle('Delete');
      setVisible(true);
    }
    // Nếu không phải của user thì không làm gì cả
  };
  const handleCancel = () => {
    if (currentItem) {
      setVisible(false);
    }
  };

  const handleDelete = async () => {
    setVisible(false);
    if (currentItem) {
      try {
        await dispatch(deleteCommentAPI(currentItem.reviewId)).unwrap();
        // Refresh comments list sau khi xóa
        await dispatch(getAllCommentFromFoodIdAPI(foodId));

        showToast.success('Thành công', 'Bình luận đã được xóa');
      } catch (error) {
        console.log('Failed to delete comment:', error);
        showToast.error('Lỗi', 'Không thể xóa bình luận, vui lòng thử lại');
      }
    }
  };

  const handleAddFavoriteFood = async () => {
    if (!myUserId || !foodId) {
      showToast.error('Lỗi', 'Không thể thêm vào yêu thích, vui lòng thử lại sau');
      return;
    }

    try {
      await dispatch(
        addFavoriteFoodAPI({
          userId: myUserId,
          foodId: foodId,
        }),
      ).unwrap();
      showToast.success('Thành công', 'Đã thêm vào danh sách yêu thích');
    } catch (error: any) {
      const errorMessage = 'Món ăn đã có trong danh sách ưa thích';
      showToast.error('Lỗi', errorMessage);
    }
  };

  const dispatch = useAppDispatch();
  const selectedFood = useAppSelector(selectSelectedFood);
  const userFoodList = useAppSelector(selectUserFoodList);
  const isLoadingFood = useAppSelector(selectIsLoadingFood);

  const foodReviewList = useAppSelector(selectFoodReviewList);
  const isLoadingReview = useAppSelector(selectIsLoadingReview);

  const user = useAppSelector(selectUser);
  const isLoadingUser = useAppSelector(selectIsLoadingUser);

  const [iconColor, setIconColor] = useState<string>(colors.light);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 275) {
      setIconColor(colors.secondary);
    } else {
      setIconColor(colors.light);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      setCommentError('Please enter a comment');
      return;
    }

    setCommentError(null);
    setIsAddingComment(true);
    try {
      await dispatch(
        addCommentToFoodAPI({
          foodId: foodId,
          userId: myUserId,
          reviewText: commentText.trim(),
        }),
      ).unwrap();
      
      setCommentText('');
      // Refresh comments list after adding
      await dispatch(getAllCommentFromFoodIdAPI(foodId));
      
      showToast.success('Thành công', 'Bình luận đã được thêm');
    } catch (error) {
      setCommentError('Failed to add the comment. Please try again.');
      showToast.error('Lỗi', 'Không thể thêm bình luận, vui lòng thử lại');
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleRatingChange = async (rating: number) => {
    try {
      await dispatch(
        addOrUpdateRatingAPI({
          foodId: foodId,
          userId: myUserId,
          rating: rating,
        }),
      ).unwrap();

      setUserRating(rating);

      // Refresh average rating
      try {
        const ratingResult = await dispatch(getAverageRatingAPI(foodId)).unwrap();
        setAverageRating(ratingResult.averageRating || 0);
        setTotalRatings(ratingResult.totalRatings || 0);
      } catch (error) {
        console.log('Error fetching updated rating:', error);
      }

      showToast.success('Thành công', `Cảm ơn bạn đã đánh giá ${rating} sao!`);
    } catch (error: any) {
      console.log('Error updating rating:', error);
      showToast.error('Lỗi', 'Không thể cập nhật đánh giá, vui lòng thử lại sau');
    }
  };

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    setIsInitialLoading(true);
    const loadInitialData = async () => {
      try {
        await Promise.all([
          dispatch(getDetailFoodAPI(foodId)),
          dispatch(getAllCommentFromFoodIdAPI(foodId)),
          dispatch(getUserByIdAPI({ userId: myUserId })),
          dispatch(getFoodByIdAPI({ userId, isViewMode: true }))
        ]);

        // Fetch rating data
        try {
          const ratingResult = await dispatch(getAverageRatingAPI(foodId)).unwrap();
          setAverageRating(ratingResult.averageRating || 0);
          setTotalRatings(ratingResult.totalRatings || 0);
        } catch (error) {
          console.log('Error fetching average rating:', error);
        }

        // Fetch user's rating for this food
        if (myUserId) {
          try {
            const userRatingResult = await dispatch(getUserRatingAPI({ foodId, userId: myUserId })).unwrap();
            setUserRating(userRatingResult?.rating || 0);
          } catch (error) {
            console.log('Error fetching user rating:', error);
            setUserRating(0);
          }
        }
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadInitialData();
  }, [dispatch, foodId, myUserId, userId]);

  if (isInitialLoading) {
    return <Loading />;
  }

  return (
    <>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <TouchableOpacity
          style={[styles.arrowLeftIcon, { backgroundColor: iconColor }]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <IconSvg xml={ImagesSvg.icArrowLeft} width={24} height={24} color='black' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.favoriteIcon, { backgroundColor: iconColor }]}
          onPress={handleAddFavoriteFood}
        >
          <IconSvg xml={ImagesSvg.icHeart} width={24} height={24} color='black' />
        </TouchableOpacity>
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
          <ImageBackground
            style={styles.imgContainer}
            source={{ uri: selectedFood?.foodThumbnail }}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.9)']}
              style={styles.linearGradient}>
              <Text style={styles.foodName}>{selectedFood?.foodName}</Text>
            </LinearGradient>
          </ImageBackground>

          <View style={styles.body}>
            <TouchableOpacity
              style={styles.infoContainer}
              onPress={() => {
                if (selectedFood?.userId) {
                  navigation.navigate('ListFoodByUserPage', {
                    userId: selectedFood.userId
                  });
                }
              }}
            >
              <CustomAvatar
                width={60}
                height={60}
                borderRadius={30}
                image={selectedFood?.userDetail.avatar || img.defaultAvatar}
              />
              <View>
                <CustomTitle title={selectedFood?.userDetail.username} />
                <Typography
                  title={selectedFood?.userDetail.email}
                  color="Poppins-Regular"
                  fontSize={12}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.achivementContainer}>
              <View style={styles.achivementItem}>
                <IconSvg xml={ImagesSvg.icStar} width={20} height={20} color={colors.primary} />
                <Typography
                  title={`${averageRating.toFixed(1)} (${totalRatings})`}
                  color={colors.smallText}
                  fontSize={12}
                />
              </View>
              <View style={styles.achivementItem}>
                <IconSvg xml={ImagesSvg.icTime} width={20} height={20} color={colors.primary} />
                <Typography
                  title={selectedFood?.CookingTime}
                  color={colors.smallText}
                  fontSize={12}
                />
              </View>
              <View style={styles.achivementItem}>
                <IconSvg xml={ImagesSvg.icDate} width={20} height={20} color={colors.primary} />
                <Typography
                  title={formatDate(selectedFood?.createdAt)}
                  color={colors.smallText}
                  fontSize={12}
                />
              </View>
            </View>

            {selectedFood?.categoryDetail && (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  alignSelf: 'flex-start',
                  marginTop: 10,
                }}
                onPress={() => {
                  navigation.navigate('CategoriesScreen', {
                    categoryId: selectedFood.categoryDetail?.categoryId,
                  });
                }}
              >
                <Typography
                  title={selectedFood.categoryDetail.categoryName}
                  color={'white'}
                  fontSize={12}
                />
              </TouchableOpacity>
            )}

            <CustomTitle title={t('recipe_detail_description')} style={{ marginTop: 10 }} />
            {selectedFood?.foodDescription &&
              selectedFood?.foodDescription.length > 150 ? (
              <>
                {showstrInstructions ? (
                  <Text>{selectedFood?.foodDescription}</Text>
                ) : (
                  <Text>
                    {selectedFood?.foodDescription.substring(0, 150)}...
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => setShowstrInstructions(!showstrInstructions)}>
                  <Text style={styles.readMore}>
                    {showstrInstructions ? 'See less' : 'Read more'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>{selectedFood?.foodDescription}</Text>
            )}

            <CustomTitle title={t('recipe_detail_ingredient')} style={{ marginTop: 20 }} />
            {selectedFood?.foodIngredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>
                {ingredient}
              </Text>
            ))}
            <CustomTitle title={t('recipe_detail_step')} style={{ marginTop: 20 }} />
            {selectedFood?.foodSteps.map((step, index) => (
              <Text key={index} style={styles.ingredientText}>
                {step}
              </Text>
            ))}
            <CustomTitle title={'Đánh giá của bạn'} style={{ marginTop: 20 }} />
            <RatingInput
              rating={userRating}
              onRatingChange={handleRatingChange}
            />

            <TouchableOpacity style={styles.titleContainer}>
              <CustomTitle title={t('recipe_detail_comment')} />
              <CustomTitle style={styles.seeAll} title="See all" />
            </TouchableOpacity>
            {foodReviewList.map(item => (
              <TouchableOpacity
                onLongPress={() => showDialog(item)}
                key={item.reviewId}
                style={styles.foodReviewListContainer}>
                <View style={styles.foodReviewListItem1}>
                  <CustomAvatar
                    width={40}
                    height={40}
                    borderRadius={20}
                    image={item.userDetail.avatar || img.defaultAvatar}
                  />
                  <View style={styles.foodReviewListItem2}>
                    <Typography
                      title={item.userDetail.username}
                      color={colors.dark}
                      fontSize={13}
                    />
                    <Typography
                      title={formatDateTime(item.createdAt)}
                      color={colors.smallText}
                      fontSize={10}
                    />
                    <Text>{item.reviewText}</Text>
                  </View>
                </View>
                <IconSvg xml={ImagesSvg.icEllipsis} width={20} height={20} color={colors.primary} />
              </TouchableOpacity>
            ))}
            <View style={styles.commentInput}>
              <CustomAvatar
                width={40}
                height={40}
                borderRadius={20}
                image={user?.avatar || img.defaultAvatar}
              />
              <CustomInput
                style={styles.foodNameStyle2}
                placeholder={t('recipe_detail_comment_placeholder')}
                value={commentText}
                onChangeText={setCommentText}
                multiline={true}
                numberOfLines={3}
              />
              <TouchableOpacity onPress={handleAddComment}><IconSvg xml={ImagesSvg.icSend} width={24} height={24} color={colors.primary} /></TouchableOpacity>
            </View>
            <CustomTitle title={t('recipe_detail_more_food')} />
            <FlatList
              data={userFoodList}
              horizontal
              showsHorizontalScrollIndicator={true}
              keyExtractor={item => item.foodId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item.foodId}
                  style={styles.itemContainer}
                  onPress={() =>
                    navigation.navigate('FoodDetailScreen', {
                      foodId: item.foodId,
                      userId: item.userId,
                    })
                  }>
                  {/* Top img */}
                  <Image
                    style={styles.img2}
                    source={{ uri: item.foodThumbnail }}
                  />
                  {/* Bottom info */}
                  <View style={styles.titleItemLeft}>
                    <CustomTitle
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.title}
                      title={item.foodName}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <IconSvg xml={ImagesSvg.icStar} width={18} height={18} color={colors.primary} />

                      <Typography
                        title={`${averageRating.toFixed(1)} (${totalRatings})`}
                        color={colors.smallText}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          {commentError && <Text>{commentError}</Text>}
        </ScrollView>
      </SafeAreaView>
      <ConfirmationModal
        visible={visible}
        title={dialogTitle === 'Hidden' ? t('recipe_detail_not_authorized_title') : t('recipe_detail_delete_comment_title')}
        message={dialogTitle === 'Hidden'
          ? t('recipe_detail_not_authorized_message')
          : t('recipe_detail_delete_comment_message')}
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
  arrowLeftIcon: {
    position: 'absolute',
    top: 42,
    left: 22,
    zIndex: 1,
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 50,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 42,
    right: 22,
    zIndex: 1,
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 50,
  },
  imgContainer: {
    height: 240,
    width: '100%',
    resizeMode: 'cover',
  },
  linearGradient: {
    width: '100%',
    height: '100%',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  body: {
    gap: 10,
    padding: 18,
  },
  readMore: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  foodName: {
    fontSize: 22,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 12,
    left: 22,
    color: colors.light,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    gap: 12,
  },
  achivementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 12,
  },
  achivementItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.InputBg,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  ingredientText: {
    backgroundColor: colors.InputBg,
    padding: 10,
    borderRadius: 10,
  },
  foodNameStyle2: {
    width: '70%',
    marginHorizontal: 12,
    paddingBottom: 12
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
  },
  commentInput: {
    width: '100%',
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemContainer: {
    width: 180,
    height: 180,
    backgroundColor: colors.light,
    borderRadius: 15,
    gap: 8,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  img2: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  titleItemLeft: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  foodReviewListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 22,
    marginBottom: 8,
    width: '100%',
  },
  foodReviewListItem1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  foodReviewListItem2: { maxWidth: '80%' },
});
