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

import AntDesignIcon from 'react-native-vector-icons/AntDesign';
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
      return 'Good Morning';
    } else if (currentTime < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };
  const message = greetingMessage();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerBlock}>
          <View style={styles.headerBlock2}>
            <CustomAvatar image={user?.avatar || imgURL.UndefineImg} />
            <View style={styles.headerBlock3}>
              <Text>{message}</Text>
              <CustomTitle title={user?.username} />
            </View>
          </View>
          <FeatherIcon name="bell" size={24} color={color.dark} />
        </View>

        <View style={styles.titleContainer}>
          <CustomTitle title="Trending now " />
        </View>
        {/* Thumnail */}
        {/* Thumnail */}

        <View style={styles.titleContainer}>
          <CustomTitle title="Popular Category" />
          <AntDesignIcon name="arrowright" size={24} color={color.dark} />
        </View>
        <FlatList
          data={categoryList}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={item => item.categoryId}
          renderItem={({item}) => (
            <Pressable>
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
          <AntDesignIcon name="arrowright" size={24} color={color.dark} />
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
                  foodId: item.foodId, // Gửi foodId qua navigation
                })
              }>
              <Image source={{uri: item.foodThumbnail}} style={styles.img2} />
              <View style={styles.titleItemLeft2}>
                <CustomTitle title={item.foodName} />
                <Text>by: {item.userDetail?.username}</Text>
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
        <View style={styles.titleContainer}>
          <CustomTitle title="Popular creators" />
          <AntDesignIcon name="arrowright" size={24} color={color.dark} />
        </View>
        <FlatList
          data={ListUser}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={item => item.userId}
          renderItem={({item}) => (
            <View style={styles.creatorItems}>
              <CustomAvatar style={styles.creatorAvatar} image={item.avatar} />
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
  },
  headerBlock: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
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
    padding: 10,
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
    margin: 10,
    padding: 10,
    gap: 10,
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
});
