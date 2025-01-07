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
import {RootStackParamList} from '../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../utils/color';
import CustomTitle from '../components/customize/Title';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';

import FontistoIcon from 'react-native-vector-icons/Fontisto';
import CustomAvatar from '../components/customize/Avatar';
import img from '../utils/urlImg';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import {getDetailFoodAPI, getFoodByIdAPI} from '../redux/slices/food/foodThunk';
import {getUserByIdAPI} from '../redux/slices/auth/authThunk';

import {
  getAllCommentFromFoodIdAPI,
  addCommentToFoodAPI,
} from '../redux/slices/review/reviewThunk';

import Loading from '../components/skeleton/Loading';

import {MMKV} from 'react-native-mmkv';
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

  const handleAddFavoriteFood = () => {
    console.log('Add favorite food');
  };

  const dispatch = useAppDispatch();
  const {selectedFood, userFoodList, isLoadingFood, isErrorFood} =
    useAppSelector((state: RootState) => state.food);

  const {foodReviewList, isErrorReview} = useAppSelector(
    (state: RootState) => state.review,
  );

  const {user} = useAppSelector((state: RootState) => state.auth);

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
      setCommentError('Please enter a comment'); // Hiển thị lỗi nếu người dùng gửi văn bản rỗng
      return;
    }

    setCommentError(null); // Xóa lỗi nếu có
    setIsAddingComment(true); // Bật trạng thái "Đang thêm bình luận"
    dispatch(getAllCommentFromFoodIdAPI(foodId));

    try {
      await dispatch(
        addCommentToFoodAPI({
          foodId: foodId,
          userId: myUserId,
          reviewText: commentText.trim(),
          rating: 0,
          isLiked: false,
        }),
      );
      setCommentText('');
      await dispatch(getAllCommentFromFoodIdAPI(foodId));
    } catch (error) {
      setCommentError('Failed to add the comment. Please try again.');
    } finally {
      setIsAddingComment(false); // Tắt trạng thái "Đang thêm bình luận"
    }
  };

  useEffect(() => {
    if (foodId) {
      dispatch(getDetailFoodAPI(foodId));
      dispatch(getAllCommentFromFoodIdAPI(foodId));
      dispatch(getUserByIdAPI(myUserId));
      dispatch(getFoodByIdAPI(userId || ''));
    }
  }, [dispatch, foodId, myUserId, userId]);

  if (isLoadingFood) {
    return <Loading />;
  }

  if (isErrorFood || !selectedFood || isErrorReview) {
    return <Text>Error loading recipe details.</Text>;
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
            source={{uri: selectedFood.foodThumbnail}}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.9)']}
              style={styles.linearGradient}>
              <Text style={styles.foodName}>{selectedFood.foodName}</Text>
            </LinearGradient>
          </ImageBackground>

          <View style={styles.body}>
            <TouchableOpacity
              style={styles.infoContainer}>
              <CustomAvatar
                width={60}
                height={60}
                borderRadius={30}
                image={selectedFood.userDetail.avatar || img.UndefineImg}
              />
              <View>
                <CustomTitle title={selectedFood.userDetail.username} />
                <Text>{selectedFood.userDetail.email}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.achivement}>
              <View style={styles.achivementItem}>
                <AntDesignIcon name="star" size={20} color={colors.primary} />
                <Text style={{color: colors.smallText, fontWeight: 'bold'}}>
                  (4.0)
                </Text>
              </View>
              <View style={styles.achivementItem}>
                <AntDesignIcon
                  name="clockcircleo"
                  size={20}
                  color={colors.primary}
                />
                <Text>{selectedFood.CookingTime}</Text>
              </View>
              <View style={styles.achivementItem}>
                <FontistoIcon name="date" size={20} color={colors.primary} />
                <Text>123</Text>
              </View>
            </View>

            <CustomTitle title="Description" />
            {selectedFood.foodDescription &&
            selectedFood.foodDescription.length > 150 ? (
              <>
                {showstrInstructions ? (
                  <Text>{selectedFood.foodDescription}</Text>
                ) : (
                  <Text>
                    {selectedFood.foodDescription.substring(0, 150)}...
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
              <Text>{selectedFood.foodDescription}</Text>
            )}

            <CustomTitle title="Ingredient" />
            {selectedFood.foodIngredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>
                {ingredient}
              </Text>
            ))}
            <CustomTitle title="Step" />
            {selectedFood.foodSteps.map((step, index) => (
              <Text key={index} style={styles.ingredientText}>
                {step}
              </Text>
            ))}
            <TouchableOpacity style={styles.titleContainer}>
              <CustomTitle title="Comment" />
              <CustomTitle style={styles.seeAll} title="See all" />
            </TouchableOpacity>
            {foodReviewList.map((foodReview, index) => (
              <View key={index} style={{flexDirection: 'row', gap: 10}}>
                <CustomAvatar
                  width={40}
                  height={40}
                  borderRadius={20}
                  image={foodReview.userDetail.avatar || img.UndefineImg}
                />
                <View>
                  <Text
                    style={{
                      color: colors.primaryText,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>
                    {foodReview.userDetail.username}
                  </Text>
                  <Text>{foodReview.reviewText}</Text>
                </View>
              </View>
            ))}
            <View style={styles.commentInput}>
              <CustomAvatar
                width={40}
                height={40}
                borderRadius={20}
                image={user?.avatar || img.UndefineImg}
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
                      <Text
                        style={{color: colors.smallText, fontWeight: 'bold'}}>
                        (4.0)
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          {commentError && <Text>{commentError}</Text>}
        </ScrollView>
      </SafeAreaView>
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

  achivement: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  achivementItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.InputBg,
    gap: 6,
    fontSize: 12,
    padding: 14,
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
    paddingTop: 12,
    marginTop: 12,
    borderTopColor: colors.InputBg,
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
});
