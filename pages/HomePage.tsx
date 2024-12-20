import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
// Firebase

// Custom
import CustomButton from '../components/customize/Button';
import CustomModal from '../components/Modal';
import CustomTitle from '../components/customize/Title';
import CustomFoodItem from '../components/customize/FoodItem';
import CustomAvatar from '../components/customize/Avatar';

// Reudx
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';

//Redux RTK query
import {useGetCategoriesQuery} from '../redux/slices/category/categoriesService';
import {useGetRecipesQuery} from '../redux/slices/recipe/recipesService';
import {recipes} from '../redux/slices/recipe/types';
import {addRecipes} from '../redux/slices/recipe/recipesSlice';

import handleGetRandomFood from '../services/getRandomFoodService';
import color from '../utils/color';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../components/customize/Input';

// Services

interface HomePageProps
  extends NativeStackScreenProps<RootStackParamList, 'HomePage'> {}

const HomePage: React.FC<HomePageProps> = ({}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const foodList = useAppSelector((state: RootState) => state.food.foods);

  const {data: categoriesData} = useGetCategoriesQuery();
  const {data: recipesData} = useGetRecipesQuery();

  const [randomFood, setRandomFood] = useState<any>(null);

  const getRandomFood = async () => {
    try {
      const response = await handleGetRandomFood();
      setRandomFood(response.meals[0]);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const dispatch = useAppDispatch();

  const handleAddRecipe = (recipe: recipes) => {
    dispatch(addRecipes(recipe));
    console.log('Add recipe', recipe);
  };

  useEffect(() => {
    getRandomFood();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerBlock}>
          <Image
            style={styles.imgStyle}
            source={require('../assets/Logo.webp')}
          />
          <CustomAvatar img="https://live.staticflickr.com/65535/53459716820_a6c3ce93a8_w.jpg" />
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
          <ImageBackground
            style={styles.imgBackground}
            source={{uri: randomFood?.strMealThumb}}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.9)']}
              style={styles.linearGradient}>
              <Text style={styles.textTitle}>{randomFood?.strMeal} </Text>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Thumnail */}

        <CustomTitle title="Categories" />
        <FlatList
          data={categoriesData?.categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.idCategory}
          renderItem={({item}) => (
            <View>
              <CustomFoodItem
                title={item.strCategory}
                image={item.strCategoryThumb}
              />
            </View>
          )}
        />

        <CustomTitle title="Popular Recipe" />
        <FlatList
          data={recipesData?.meals}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.idMeal}
          renderItem={({item}) => (
            <CustomFoodItem
              title={item.strMeal}
              image={item.strMealThumb}
              onPress={() => handleAddRecipe(item)}
            />
          )}
        />

        <CustomTitle title="Daily Food" />
        <FlatList
          data={foodList}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <CustomFoodItem title={item.name} image={item.image} />
          )}
        />
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
  // Header css
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  imgStyle: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
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

  inputContainter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //Popular food
  popularBlock: {
    width: '100%',
    height: 200,
  },

  imgBackground: {
    margin: 10,
    resizeMode: 'center',
  },

  linearGradient: {
    width: '100%',
    height: '100%',
  },

  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: color.light,
  },
});
