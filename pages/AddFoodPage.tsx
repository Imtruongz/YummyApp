import {
  FlatList,
  Image,
  PermissionsAndroid,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import CustomInput from '../components/customize/Input';
import CustomButton from '../components/customize/Button';
import {launchImageLibrary} from 'react-native-image-picker';

import {food} from '../redux/slices/food/types';
import Toast from 'react-native-toast-message';

import imgURL from '../utils/urlImg';
import Header from '../components/customize/Header';
import color from '../utils/color';
import CustomTitle from '../components/customize/Title';
import colors from '../utils/color';

import SelectDropdown from 'react-native-select-dropdown';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import {getAllCategoriesAPI} from '../redux/slices/category/categoryThunk';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddFoodPage = () => {
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodIngredient, setFoodIngredient] = useState('');
  const [foodRecipe, setFoodRecipe] = useState('');
  const [img, setImg] = useState('');

  const handleAddFood = () => {
    const newFood: food = {
      id: Date.now().toString(),
      name: foodName,
      ingredients: foodIngredient,
      description: foodDescription,
      step: foodRecipe,
      image: img,
    };
    console.log('Add food success', newFood);
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Add Recipe',
      text2: 'Add Recipe to your favorite',
      visibilityTime: 2000,
    });

    setFoodName('');
    setFoodIngredient('');
    setFoodDescription('');
    setFoodRecipe('');
    setImg('');
  };


  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result: any = await launchImageLibrary({
          mediaType: 'photo',
        });
        if (result.assets && result.assets.length > 0) {
          setImg(result.assets[0].uri);
        } else {
          console.log('No image selected or camera launch failed');
        }
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // const handleInputChange = (text: any) => {
  //   if (text.length <= 1500) {
  //     setFoodDescription(text);
  //   }
  // };
  // const charCount = foodDescription.length;

  const {categoryList} = useAppSelector((state: RootState) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllCategoriesAPI());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Header title="Add food" iconName="close" />
      <View style={styles.body}>
        <CustomTitle title="Food image" />
        <Pressable onPress={() => requestCameraPermission()}>
              <Image
                source={{uri: img || imgURL.UndefineImg}}
                style={styles.previewImg}
              />
            </Pressable>
        <CustomTitle title="Food name" />
        <CustomInput placeholder="Enter food name" />
        <CustomTitle style={styles.input} title="Description" />
        <CustomInput placeholder="Enter description" />
      </View>
      <View style={styles.ingredients}>
          <CustomTitle title="Ingredients" />
          <SelectDropdown
            data={categoryList}
            onSelect={selectedItem => {
              console.log(selectedItem);
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.categoryName) ||
                      'Select your mood'}
                  </Text>
                  <Icon
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    style={styles.dropdownButtonArrowStyle}
                  />
                </View>
              );
            }}
            renderItem={(item, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && {backgroundColor: '#D2D9DF'}),
                  }}>
                  <Text style={styles.dropdownItemTxtStyle}>
                    {item.categoryName}
                  </Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        </View>
    </View>
  );
};

export default AddFoodPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
  body: {
    padding: 20,
  },
  input: {
    height: 100,
  },
  previewImg: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  ingredients: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },
});
