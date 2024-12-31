import {
  Image,
  PermissionsAndroid,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';

import CustomInput from '../components/customize/Input';
import CustomButton from '../components/customize/Button';
import {launchImageLibrary} from 'react-native-image-picker';

import {food} from '../redux/slices/food/types';
import Toast from 'react-native-toast-message';

import imgURL from '../utils/urlImg';
import Header from '../components/customize/Header';
import color from '../utils/color';

const AddFoodPage = ({}) => {
  // const [foodName, setFoodName] = useState('');
  // const [foodDescription, setFoodDescription] = useState('');
  // const [foodIngredient, setFoodIngredient] = useState('');
  // const [foodRecipe, setFoodRecipe] = useState('');
  // const [img, setImg] = useState('');


  // const handleAddFood = () => {
  //   const newFood: food = {
  //     id: Date.now().toString(),
  //     name: foodName,
  //     ingredients: foodIngredient,
  //     description: foodDescription,
  //     step: foodRecipe,
  //     image: img,
  //   };
  //   console.log('Add food success', newFood);
  //   Toast.show({
  //     type: 'success',
  //     position: 'top',
  //     text1: 'Add Recipe',
  //     text2: 'Add Recipe to your favorite',
  //     visibilityTime: 2000,
  //   });

  //   setFoodName('');
  //   setFoodIngredient('');
  //   setFoodDescription('');
  //   setFoodRecipe('');
  //   setImg('');
  // };

  // const requestCameraPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       const result: any = await launchImageLibrary({
  //         mediaType: 'photo',
  //       });
  //       if (result.assets && result.assets.length > 0) {
  //         setImg(result.assets[0].uri);
  //       } else {
  //         console.log('No image selected or camera launch failed');
  //       }
  //     } else {
  //       console.log('Camera permission denied');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  // const handleInputChange = (text: any) => {
  //   if (text.length <= 1500) {
  //     setFoodDescription(text);
  //   }
  // };
  // const charCount = foodDescription.length;

  return (
    <View style={styles.container}>
      <Header title="Add food" iconName="close"/>
      
    </View>
  );
};

export default AddFoodPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
});
