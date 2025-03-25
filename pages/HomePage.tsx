import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import color from '../utils/color';
import imgURL from '../utils/urlImg';
import CustomButton from '../components/customize/Button';
import CustomTitle from '../components/customize/Title';
import Typography from '../components/customize/Typography';
import CustomFoodItem from '../components/customize/FoodItem';
import CustomAvatar from '../components/customize/Avatar';
import Greeting from '../components/customize/Greeting';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
//asyncThunk
import {getAllCategoriesAPI} from '../redux/slices/category/categoryThunk';
import {getAllFoodAPI} from '../redux/slices/food/foodThunk';
import {getUserByIdAPI, getAllUsers} from '../redux/slices/auth/authThunk';

import {MMKV} from 'react-native-mmkv';
import img from '../utils/urlImg';
const storage = new MMKV();

interface HomePageProps
  extends NativeStackScreenProps<RootStackParamList, 'HomePage'> {}

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const userId = storage.getString('userId') || '';
  const {foodList} = useAppSelector(state => state.food);
  const {user} = useAppSelector((state: RootState) => state.auth);
  const {ListUser} = useAppSelector((state: RootState) => state.user);
  const {categoryList} = useAppSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(getAllCategoriesAPI());
    dispatch(getAllFoodAPI());
    dispatch(getAllUsers());
    dispatch(getUserByIdAPI(userId));
    console.log('render');
  }, [dispatch, userId]);

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return <Greeting iconName="sun-o" title="Good Morning" />;
    } else if (currentTime < 18) {
      return <Greeting iconName="sun-o" title="Good Afternoon" />;
    } else {
      return <Greeting iconName="moon-o" title="Good Evening" />;
    }
  };
  const message = greetingMessage();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.header1}>
            <CustomAvatar
              width={50}
              height={50}
              borderRadius={25}
              image={user?.avatar || imgURL.defaultAvatar}
            />
            <View>
              <Text>{message}</Text>
              <Typography
                title={user?.username}
                fontSize={16}
                fontFamily="Poppins-SemiBold"
              />
            </View>
          </View>
          <FeatherIcon name="bell" size={24} color={color.dark} />
        </View>
        {/* Popular Category Title */}
        <TouchableOpacity style={styles.titleContainer}>
          <CustomTitle title="Popular Category" />
        </TouchableOpacity>
        {/* Popular Category List */}
        <FlatList
          data={categoryList}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={item => item.categoryId}
          renderItem={({item}) => (
            <Pressable
              onPress={() =>
                navigation.navigate('ListFoodByCategoriesPage', {
                  categoryId: item.categoryId,
                })
              }>
              <CustomFoodItem
                title={item.categoryName}
                image={item.categoryThumbnail}
              />
            </Pressable>
          )}
        />
        {/* Daily Food Title */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ListFoodPage')}
          style={styles.titleContainer}>
          <CustomTitle title="Daily Food " />
          <CustomTitle style={styles.seeAll} title="See all" />
        </TouchableOpacity>
        {/* Daily Food List */}
        <FlatList
          data={foodList}
          horizontal
          showsHorizontalScrollIndicator={true}
          initialNumToRender={5}
          onEndReached={getAllFoodAPI}
          onEndReachedThreshold={0.5}
          keyExtractor={item => item.foodId}
          renderItem={({item}) => (
            <Pressable
              style={styles.itemContainer}
              onPress={() =>
                navigation.navigate('RecipeDetailPage', {
                  foodId: item.foodId,
                  userId: item.userId,
                })
              }>
              <Image source={{uri: item.foodThumbnail}} style={styles.img2} />
              <View style={styles.titleItemLeft2}>
                <Typography
                  title={item.foodName}
                  fontSize={18}
                  fontFamily="Poppins-Regular"
                  fontWeight="700"
                  numberOfLines={2}
                />
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <CustomAvatar
                    width={30}
                    height={30}
                    borderRadius={15}
                    image={item.userDetail?.avatar}
                  />
                  <Typography
                    title={item.userDetail?.username}
                    fontFamily="Poppins-SemiBold"
                  />
                </View>
              </View>
              <MaterialIcons
                name="favorite-border"
                size={24}
                color={color.dark}
                style={styles.favoriteIcon}
              />
            </Pressable>
          )}
        />
        {/* Popular Creator Title */}
        <TouchableOpacity style={styles.titleContainer}>
          <CustomTitle title="Popular creators" />
        </TouchableOpacity>
        {/* Popular Creator List */}
        <FlatList
          data={ListUser}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={item => item.userId}
          renderItem={({item}) => (
            <Pressable
              onPress={() =>
                navigation.navigate('ListFoodByUserPage', {
                  userId: item.userId,
                })
              }
              style={styles.creatorItems}>
              <CustomAvatar
                width={100}
                height={100}
                borderRadius={50}
                image={item.avatar || img.defaultAvatar}
              />
              <CustomTitle
                title={item.username}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.creatorName}
              />
            </Pressable>
          )}
        />
      </ScrollView>
      {/* Button add new Food */}
      <CustomButton
        isText={false}
        isIcon={true}
        icon="plus"
        iconSize={24}
        onPress={() => navigation.navigate('AddFoodPage')}
        style={styles.addFoodBtn}
      />
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.light,
    shadowColor: color.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  favoriteIcon: {
    position: 'absolute',
    bottom: 14,
    right: 14,
  },
  titleItemLeft2: {
    padding: 14,
    justifyContent: 'flex-start',
    gap: 14,
    width: '60%',
    height: '100%',
  },
  img2: {
    width: 140,
    height: 200,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    resizeMode: 'cover',
  },
  addFoodBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: color.primary,
  },
  itemContainer: {
    width: 300,
    height: 200,
    margin: 10,
    borderRadius: 20,
    backgroundColor: color.light,
    shadowColor: color.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
  },
  creatorItems: {
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  creatorName: {
    fontSize: 14,
    maxWidth: 100,
    textAlign: 'center',
  },
  seeAll: {
    fontSize: 14,
    color: color.primary,
  },
});
