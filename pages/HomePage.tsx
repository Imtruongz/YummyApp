import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import {useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';

//Redux RTK query
import {useGetCategoriesQuery} from '../redux/slices/category/categoriesService';
//import {useGetRandomFoodQuery} from '../redux/slices/food/randomFoodService';

import handleGetRandomFood from '../services/getRandomFoodService';

// Services

interface HomePageProps
  extends NativeStackScreenProps<RootStackParamList, 'HomePage'> {}

const HomePage: React.FC<HomePageProps> = ({}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const foodList = useAppSelector((state: RootState) => state.food.foods);

  const {data: categoriesData} = useGetCategoriesQuery();

  //const { data: randomFoodData } = useGetRandomFoodQuery();

  const [randomFood, setRandomFood] = useState<any>(null);

  const getRandomFood = async () => {
    try {
      const response = await handleGetRandomFood();
      setRandomFood(response.meals[0]);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
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
        <View style={styles.searchBlock}>
          <TextInput style={styles.textInputStyle} placeholder="Search" />
        </View>
        {/* Header */}

        {/* Thumnail */}
        <View style={styles.popularBlock}>
        <Text style={styles.textTItle}>{randomFood?.strMeal}</Text>
          <Image
            style={styles.imgBackground}
            source={{uri: randomFood?.strMealThumb}}
          />
        </View>
        {/* Thumnail */}

        <CustomTitle title="New food" />
        <FlatList
          data={foodList}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <CustomFoodItem title={item.name} image={item.image} />
          )}
        />
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
      </ScrollView>

      {/* Button add new Food */}
      <CustomButton
        title="+"
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
    backgroundColor: 'white',
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
  imgAvatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderBlockColor: 'orange',
  },
  textTItle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
  },
  openModalStyle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'orange',
  },

  //Search food
  searchBlock: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputStyle: {
    width: '92%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 25,
  },
  //Popular food
  popularBlock: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imgBackground: {
    padding: 26,
    width: '90%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
});
