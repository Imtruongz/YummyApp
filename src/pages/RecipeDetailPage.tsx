import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../utils/color';
import CustomTitle from '../components/customize/Title';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import FontAwesome6Icons from 'react-native-vector-icons/FontAwesome6';

import FontistoIcon from 'react-native-vector-icons/Fontisto';
import CustomAvatar from '../components/customize/Avatar';
import img from '../utils/urlImg';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import {getDetailFoodAPI, getFoodByIdAPI} from '../redux/slices/food/foodThunk';
import {getUserByIdAPI} from '../redux/slices/auth/authThunk';
import Dialog from 'react-native-dialog';
import {formatDate, formatDateTime} from '../utils/formatDate'; // Đường dẫn tới file bạn vừa tạo

import {
  getAllCommentFromFoodIdAPI,
  addCommentToFoodAPI,
  deleteCommentAPI,
} from '../redux/slices/review/reviewThunk';

import Loading from '../components/skeleton/Loading';
import {review} from '../redux/slices/review/types';
import {MMKV} from 'react-native-mmkv';
import Typography from '../components/customize/Typography';
const storage = new MMKV();

interface RecipeDetailPageProps
  extends NativeStackScreenProps<RootStackParamList, 'RecipeDetailPage'> {}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({
  route,
  navigation,
}) => {
  const {foodId, userId} = route.params;
  const myUserId = storage.getString('userId') || '';
  const [showstrInstructions, setShowstrInstructions] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<review | null>(null);

  const [dialogTitle, setDialogTitle] = useState('');

  const showDialog = (item: review) => {
    setCurrentItem(item);
    if (item.userId !== myUserId) {
      // Nếu không có quyền, hiển thị Dialog "Hidden"
      setDialogTitle('Hidden');
      setVisible(true);
      console.log('Check myuserId', myUserId, 'and userComment', item.userId);
    } else {
      // Nếu có quyền, hiển thị Dialog "Delete"
      setDialogTitle('Delete');
      setVisible(true);
      console.log('Check myuserId', myUserId, 'and userComment', item.userId);
    }
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
        await dispatch(deleteCommentAPI(currentItem.reviewId)); // Call delete thunk
        dispatch(getAllCommentFromFoodIdAPI(foodId)); // Refresh comments list
        console.log('Comment deleted successfully');
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const handleAddFavoriteFood = () => {
    console.log('Add favorite food');
  };

  const dispatch = useAppDispatch();
  const {selectedFood, userFoodList, isLoadingFood} = useAppSelector(
    (state: RootState) => state.food,
  );

  const {foodReviewList, isLoadingReview} = useAppSelector((state: RootState) => state.review);

  const {user, isLoadingUser} = useAppSelector((state: RootState) => state.auth);

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
    dispatch(getAllCommentFromFoodIdAPI(foodId));

    try {
      await dispatch(
        addCommentToFoodAPI({
          foodId: foodId,
          userId: myUserId,
          reviewText: commentText.trim(),
        }),
      );
      setCommentText('');
      await dispatch(getAllCommentFromFoodIdAPI(foodId));
    } catch (error) {
      setCommentError('Failed to add the comment. Please try again.');
    } finally {
      setIsAddingComment(false);
    }
  };

  useEffect(() => {
    dispatch(getDetailFoodAPI(foodId));
    dispatch(getAllCommentFromFoodIdAPI(foodId));
    dispatch(getUserByIdAPI(myUserId));
    dispatch(getFoodByIdAPI(userId));
  }, [dispatch, foodId, myUserId, userId]);

  if (isLoadingFood || isLoadingReview || isLoadingUser) {
    return <Loading />;
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <AntDesignIcon
          name="arrowleft"
          size={24}
          style={[styles.arrowLeftIcon, {backgroundColor: iconColor}]}
          color={colors.dark}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <MaterialIcons
          name="favorite-border"
          size={24}
          color={colors.dark}
          style={[styles.favoriteIcon, {backgroundColor: iconColor}]}
          onPress={handleAddFavoriteFood}
        />
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
          <ImageBackground
            style={styles.imgContainer}
            source={{uri: selectedFood?.foodThumbnail}}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.9)']}
              style={styles.linearGradient}>
              <Text style={styles.foodName}>{selectedFood?.foodName}</Text>
            </LinearGradient>
          </ImageBackground>

          <View style={styles.body}>
            <TouchableOpacity style={styles.infoContainer}>
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
                <AntDesignIcon name="star" size={20} color={colors.primary} />
                <Typography
                  title="4.0"
                  fontFamily="Poppins-Medium"
                  color={colors.smallText}
                  fontSize={12}
                />
              </View>
              <View style={styles.achivementItem}>
                <AntDesignIcon
                  name="clockcircleo"
                  size={20}
                  color={colors.primary}
                />
                <Typography
                  title={selectedFood?.CookingTime}
                  fontFamily="Poppins-Medium"
                  color={colors.smallText}
                  fontSize={12}
                />
              </View>
              <View style={styles.achivementItem}>
                <FontistoIcon name="date" size={20} color={colors.primary} />
                <Typography
                  title={formatDate(selectedFood?.createdAt)}
                  fontFamily="Poppins-Medium"
                  color={colors.smallText}
                  fontSize={12}
                />
              </View>
            </View>

            <CustomTitle title="Description" />
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

            <CustomTitle title="Ingredient" />
            {selectedFood?.foodIngredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>
                {ingredient}
              </Text>
            ))}
            <CustomTitle title="Step" />
            {selectedFood?.foodSteps.map((step, index) => (
              <Text key={index} style={styles.ingredientText}>
                {step}
              </Text>
            ))}
            <TouchableOpacity style={styles.titleContainer}>
              <CustomTitle title="Comment" />
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
                      fontFamily="Poppins-SemiBold"
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
                <FontAwesome6Icons
                  name="ellipsis-vertical"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            ))}
            <View style={styles.commentInput}>
              <CustomAvatar
                width={40}
                height={40}
                borderRadius={20}
                image={user?.avatar || img.defaultAvatar}
              />
              <TextInput
                style={styles.foodNameStyle2}
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
                multiline={true}
                numberOfLines={3}
              />
              <FontAwesomeIcons
                name={isAddingComment ? 'send' : 'send-o'}
                size={24}
                color={colors.primary}
                onPress={handleAddComment}
                disabled={isAddingComment}
              />
            </View>
            <CustomTitle title="More food" />
            <FlatList
              data={userFoodList}
              horizontal
              showsHorizontalScrollIndicator={true}
              keyExtractor={item => item.foodId}
              renderItem={({item}) => (
                <TouchableOpacity
                  key={item.foodId}
                  style={styles.itemContainer}
                  onPress={() =>
                    navigation.navigate('RecipeDetailPage', {
                      foodId: item.foodId,
                      userId: item.userId,
                    })
                  }>
                  {/* Top img */}
                  <Image
                    style={styles.img2}
                    source={{uri: item.foodThumbnail}}
                  />
                  {/* Bottom info */}
                  <View style={styles.titleItemLeft}>
                    <CustomTitle
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.title}
                      title={item.foodName}
                    />
                    {/* <Text style={styles.title2}>
                      {item.userDetail.username}
                    </Text> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <AntDesignIcon
                        name="star"
                        size={20}
                        color={colors.primary}
                      />

                      <Typography
                        title="4.0"
                        fontFamily="Poppins-SemiBold"
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
      <Dialog.Container visible={visible}>
        <Dialog.Title>{dialogTitle}</Dialog.Title>
        {dialogTitle === 'Hidden' ? (
          <>
            <Dialog.Description>
              You are not authorized to delete this comment!
            </Dialog.Description>
            <Dialog.Button label="OK" onPress={handleCancel} />
          </>
        ) : (
          <>
            <Dialog.Description>
              Do you want to delete this comment? This action cannot be undone.
            </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button label="Delete" onPress={handleDelete} />
          </>
        )}
      </Dialog.Container>
    </>
  );
};

export default RecipeDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },

  arrowLeftIcon: {
    position: 'absolute',
    top: 12,
    left: 22,
    zIndex: 1,
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 50,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 12,
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
    width: 220,
    height: 60,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 18,
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
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.InputBg,
    borderTopColor: colors.InputBg,
    paddingTop: 12,
    paddingBottom: 18,
    marginTop: 12,
    marginBottom: 8,
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
    shadowOffset: {width: 0, height: 2},
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
  title2: {
    fontSize: 12,
    color: colors.smallText,
  },
  userNameDetail: {
    fontSize: 12,
  },
  foodReviewListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 12,
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
  foodReviewListItem2: {maxWidth: '80%'},
});
