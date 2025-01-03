import {
  FlatList,
  Pressable,
  SafeAreaView,
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

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import color from '../utils/color';
import imgURL from '../utils/urlImg';
import CustomButton from '../components/customize/Button';
import CustomTitle from '../components/customize/Title';
import CustomFoodItem from '../components/customize/FoodItem';
import CustomAvatar from '../components/customize/Avatar';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
//asyncThunk
import {getAllCategoriesAPI} from '../redux/slices/category/categoryThunk';
import {getAllFoodAPI} from '../redux/slices/food/foodThunk';
import {getUserByIdAPI, getAllUsers} from '../redux/slices/auth/authThunk';

import {MMKV} from 'react-native-mmkv';
const storage = new MMKV();

interface HomePageProps
  extends NativeStackScreenProps<RootStackParamList, 'HomePage'> {}

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {foodList} = useAppSelector(state => state.food);
  const {user} = useAppSelector((state: RootState) => state.auth);
  const {ListUser} = useAppSelector((state: RootState) => state.user);
  const {categoryList} = useAppSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(getAllCategoriesAPI());
    dispatch(getAllFoodAPI());
    dispatch(getAllUsers());
    dispatch(getUserByIdAPI(storage.getString('userId') || ''));
  }, [dispatch]);

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
          <FontAwesomeIcon name="sun-o" size={18} color={color.dark} />
          <Text>Good Morning</Text>
        </View>
      );
    } else if (currentTime < 18) {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
          <FontAwesomeIcon name="sun-o" size={18} color={color.dark} />
          <Text>Good Afternoon</Text>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
          <FontAwesomeIcon name="moon-o" size={18} color={color.dark} />
          <Text>Good Evening</Text>
        </View>
      );
    }
  };
  const message = greetingMessage();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerBlock}>
          <View style={styles.headerBlock2}>
            <CustomAvatar width={50} height={50} borderRadius={25} image={user?.avatar || imgURL.UndefineImg} />
            <View style={styles.headerBlock3}>
              <Text>{message}</Text>
              <CustomTitle title={user?.username} />
            </View>
          </View>
          <FeatherIcon name="bell" size={24} color={color.dark} />
        </View>

        <TouchableOpacity style={styles.titleContainer}>
          <CustomTitle title="Popular Category" />
          <CustomTitle style={styles.SeeAllDailyFood} title="See all" />
        </TouchableOpacity>
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

        <TouchableOpacity
          onPress={() => navigation.navigate('ListFoodPage')}
          style={styles.titleContainer}>
          <CustomTitle title="Daily Food " />
          <CustomTitle style={styles.SeeAllDailyFood} title="See all" />
        </TouchableOpacity>
        <FlatList
          data={foodList}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={item => item.foodId}
          renderItem={({item}) => (
            <Pressable
              style={styles.itemContainer}
              onPress={() =>
                navigation.navigate('RecipeDetailPage', {
                  foodId: item.foodId,
                })
              }>
              <Image source={{uri: item.foodThumbnail}} style={styles.img2} />
              <View style={styles.titleItemLeft2}>
                <CustomTitle title={item.foodName} />
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <CustomAvatar width={30} height={30} borderRadius={15} image={item.userDetail?.avatar} />
                <Text>{item.userDetail?.username}</Text>
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
        <TouchableOpacity style={styles.titleContainer}>
          <CustomTitle title="Popular creators" />
          <CustomTitle style={styles.SeeAllDailyFood} title="See all" />
        </TouchableOpacity>
        <FlatList
          data={ListUser}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={item => item.userId}
          renderItem={({item}) => (
            <View style={styles.creatorItems}>
              <CustomAvatar width={100} height={100} borderRadius={50} image={item.avatar} />
              <CustomTitle
                title={item.username}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.creatorText}
              />
            </View>
          )}
        />
        <View style={{height: 100}} />
      </ScrollView>

      {/* Button add new Food */}
      <CustomButton
        isText={false}
        isIcon={true}
        icon="plus"
        iconSize={24}
        onPress={() => navigation.navigate('AddFoodPage')}
        style={styles.openModalStyle}
      />
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBlock: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBlock2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBlock3: {
    marginHorizontal: 10,
  },
  imgStyle: {
    maxWidth: 60,
    width: 50,
    height: 20,
    resizeMode: 'contain',
  },
  headerTitle: {
    width: '60%',
  },
  inputContainter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularBlock: {
    width: '100%',
    height: 200,
  },

  imgBackground: {
    margin: 10,
    resizeMode: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  item2: {
    flex: 1,
    width: 300,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    backgroundColor: color.light,
    margin: 20,
    shadowColor: color.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
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
  titleItemRight2: {
    width: '40%',
  },
  img2: {
    width: 140,
    height: 200,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    resizeMode: 'cover',
  },
  openModalStyle: {
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
  },
  creatorAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  creatorText: {
    fontSize: 14,
    maxWidth: 100,
    textAlign: 'center',
  },

  SeeAllDailyFood: {
    fontSize: 14,
    color: color.primary,
  },
});
