import {
  Alert,
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
import auth from '@react-native-firebase/auth';

import CustomInput from '../components/customize/Input';
import CustomButton from '../components/customize/Button';
import CustomModal from '../components/Modal';
import CustomTitle from '../components/customize/Title';
import CustomFoodItem from '../components/customize/FoodItem';
import CustomAvatar from '../components/customize/Avatar';
import Thumnail from '../components/customize/Thumnail';
import CustomAuthHeader from '../components/customize/authHeader';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';

import {useGetRecipesQuery} from '../redux/slices/recipe/recipesService';
import {meal} from '../redux/slices/recipe/types';
import {addRecipes} from '../redux/slices/recipe/recipesSlice';

//asyncThunk
import {categoriesAPI} from '../redux/slices/category/categoriesSlice';
import {publicFoodAPI} from '../redux/slices/publicFood/publicFoodSlice';
import {accountAPI} from '../redux/slices/account/accountSlice';

interface HomePageProps
  extends NativeStackScreenProps<RootStackParamList, 'HomePage'> {}

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const user = auth().currentUser;

  const [modalVisible, setModalVisible] = useState(false);
  const [isPressHeart, setIsPressHeart] = useState(false);

  const {data: recipesData} = useGetRecipesQuery();

  const foodList = useAppSelector((state: RootState) => state.food.foods);
  const {ListCategories, isloadingCategories, isErrorCategories} =
    useAppSelector((state: RootState) => state.categories);
  const {ListPublicFood, isloadingPublicFood, isErrorPublicFood} =
    useAppSelector((state: RootState) => state.publicFood);
  const {MyAccount, isloadingAccount, isErrorAccount} = useAppSelector(
    (state: RootState) => state.account,
  );

  const handleAddRecipe = (recipe: meal) => {
    dispatch(addRecipes(recipe));
    setIsPressHeart(true);
    Alert.alert('Add recipe', 'Add recipe successfully');
    console.log('Add recipe', recipe);
  };

  useEffect(() => {
    dispatch(categoriesAPI());
    dispatch(publicFoodAPI());
    dispatch(accountAPI(user?.uid ?? ''));
  }, [dispatch, user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerBlock}>
          <CustomAuthHeader style={styles.imgStyle} img={imgURL.Yummy} />
          {isloadingAccount ? (
            <ActivityIndicator size="large" color={color.primary} />
          ) : isErrorAccount ? (
            <Text>Something went wronggg</Text>
          ) : (
            <View>
              <CustomAvatar image={MyAccount?.photoURL || imgURL.UndefineImg} />
              <Text>{MyAccount?.displayName}</Text>
            </View>
          )}
        </View>

        {/* Search Input */}
        <View style={styles.inputContainter}>
          <CustomInput
            placeholder="Search"
            showIcon
            iconName="search1"
            iconOnLeft={true}
          />
        </View>
        {/* Header */}

        {/* Thumnail */}
        <View style={styles.popularBlock}>
          <Thumnail />
        </View>
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
            showsHorizontalScrollIndicator={false}
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
        <FlatList
          data={recipesData?.meals}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.idMeal}
          renderItem={({item}) => (
            <Pressable
              onPress={() => navigation.navigate('RecipeDetailPage', item)}
              style={styles.item2}>
              {/* Left content */}
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
              {/* Right img */}
              <View style={styles.titleItemRight2}>
                <ImageBackground
                  style={styles.img2}
                  source={{uri: item.strMealThumb}}>
                  <AntDesignIcon
                    onPress={() => handleAddRecipe(item)}
                    name={isPressHeart ? 'heart' : 'hearto'}
                    size={24}
                    color={color.light}
                    style={styles.heartIcon}
                  />
                </ImageBackground>
              </View>
            </Pressable>
          )}
        />

        <CustomTitle title="Daily Food" />
        <FlatList
          data={foodList}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <Pressable>
              <CustomFoodItem title={item.name} image={item.image} />
            </Pressable>
          )}
        />

        <CustomTitle title="Public Food" />
        {isloadingPublicFood ? (
          <ActivityIndicator size="large" color={color.primary} />
        ) : isErrorPublicFood ? (
          <Text>Something went wrong</Text>
        ) : (
          <FlatList
            data={ListPublicFood}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <Pressable>
                <CustomFoodItem title={item.name} image={item.photoURL} />
              </Pressable>
            )}
          />
        )}
      </ScrollView>

      {/* Button add new Food */}
      <CustomButton
        isText={false}
        isIcon={true}
        icon="plus"
        iconSize={24}
        onPress={() => setModalVisible(true)}
        style={styles.openModalStyle}
      />

      {/* Modal add new Food */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <CustomModal onPress={() => setModalVisible(false)} />
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
    maxWidth: 100,
    width: 100,
    height: 40,
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
