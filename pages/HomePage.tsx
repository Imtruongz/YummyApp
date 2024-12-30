import {
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import color from '../utils/color';
import imgURL from '../utils/urlImg';
import Toast from 'react-native-toast-message';

import CustomButton from '../components/customize/Button';
import CustomModal from '../components/Modal';
import CustomTitle from '../components/customize/Title';
import CustomFoodItem from '../components/customize/FoodItem';
import CustomAvatar from '../components/customize/Avatar';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';

//asyncThunk
import {categoriesAPI} from '../redux/slices/category/categoriesSlice';

import {getAllFoodAPI} from '../redux/slices/food/foodThunk';
import {getUserByIdAPI} from '../redux/slices/auth/authThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HomePageProps
  extends NativeStackScreenProps<RootStackParamList, 'HomePage'> {}

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  //Get userId from AsyncStorage

  const [modalVisible, setModalVisible] = useState(false);
  // const [isPressHeart, setIsPressHeart] = useState(false);

  const {foodList, isLoadingFood, isErrorFood} = useAppSelector(
    state => state.food,
  );

  const {user, isLoadingUser, isErrorUser} = useAppSelector(
    (state: RootState) => state.auth,
  );

  const {ListCategories, isloadingCategories, isErrorCategories} =
    useAppSelector((state: RootState) => state.categories);

  // const handleAddRecipe = () => {
  //   setIsPressHeart(true);
  //   Toast.show({
  //     type: 'success',
  //     position: 'top',
  //     text1: 'Add Recipe',
  //     text2: 'Add Recipe to your favorite',
  //     visibilityTime: 2000,
  //   });
  // };

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (userId) {
        dispatch(getUserByIdAPI(userId));
      }

      dispatch(categoriesAPI());
      dispatch(getAllFoodAPI());
    } catch (error) {
      console.error('Error fetching data from AsyncStorage', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerBlock}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <CustomAvatar image={user?.avatar || imgURL.UndefineImg} />
            <Text>{user?.username}</Text>
          </View>
        </View>

        {/* Thumnail */}
        <View style={styles.popularBlock}></View>
        {/* Thumnail */}

        <CustomTitle title="Categories" />
        {isloadingCategories ? (
          <ActivityIndicator size="large" color={color.primary} />
        ) : isErrorCategories ? (
          <Text>Something went wrong</Text>
        ) : (
          <FlatList
            data={ListCategories?.categories}
            horizontal
            showsHorizontalScrollIndicator={true}
            keyExtractor={item => item.idCategory}
            renderItem={({item}) => (
              <Pressable>
                <CustomFoodItem
                  title={item.strCategory}
                  image={item.strCategoryThumb}
                />
              </Pressable>
            )}
          />
        )}

        <CustomTitle title="Popular Recipee" />
        {/* <FlatList
          data={}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={item => item.idMeal}
          renderItem={({item}) => (
            <Pressable
              onPress={() => navigation.navigate('RecipeDetailPage', item)}
              style={styles.item2}>
              <View style={styles.titleItemLeft2}>
                <CustomTitle
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  title={item.strMeal}
                />
                <Text numberOfLines={5} ellipsizeMode="tail">
                  {item.strInstructions}
                </Text>
              </View>
              <View style={styles.titleItemRight2}>
                <ImageBackground
                  style={styles.img2}
                  source={{uri: item.strMealThumb}}>
                  <AntDesignIcon
                    onPress={() => handleAddRecipe(item)}
                    name={isPressHeart ? 'heart' : 'hearto'}
                    size={24}
                    color={isPressHeart ? color.danger : color.light}
                    style={styles.heartIcon}
                  />
                </ImageBackground>
              </View>
            </Pressable>
          )}
        /> */}

        <CustomTitle title="Daily Food" />
        {isLoadingFood ? (
          <ActivityIndicator size="large" color={color.primary} />
        ) : isErrorFood ? (
          <Text>Something went wrong</Text>
        ) : (
          <FlatList
            data={foodList}
            horizontal
            showsHorizontalScrollIndicator={true}
            renderItem={({item}) => (
              <Pressable>
                <CustomFoodItem
                  title={item.foodName}
                  image={item.foodThumbnail}
                />
              </Pressable>
            )}
          />
        )}

        <CustomTitle title="Public Food" />
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

      {/* Modal add new Food */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <CustomModal />
      </Modal>
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
    padding: 10,
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

  item2: {
    flex: 1,
    width: 300,
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
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
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
    height: 180,
    borderRadius: 20,
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
});
