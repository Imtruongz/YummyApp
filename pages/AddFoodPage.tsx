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
import CustomButton from '../components//customize/Button';
import CustomTitle from '../components//customize/Title';

import {launchImageLibrary} from 'react-native-image-picker';

import {useAppDispatch} from '../redux/hooks';

import {food} from '../redux/slices/food/types';
import {addFood} from '../redux/slices/food/foodSlice';
import Toast from 'react-native-toast-message';

import imgURL from '../utils/urlImg';

const AddFoodPage = ({}) => {
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodIngredient, setFoodIngredient] = useState('');
  const [foodRecipe, setFoodRecipe] = useState('');
  const [img, setImg] = useState('');

  const dispatch = useAppDispatch();

  const handleAddFood = () => {
    const newFood: food = {
      id: Date.now().toString(),
      name: foodName,
      ingredients: foodIngredient,
      description: foodDescription,
      step: foodRecipe,
      image: img,
    };
    dispatch(addFood(newFood));
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

  const handleInputChange = (text: any) => {
    if (text.length <= 1500) {
      setFoodDescription(text);
    }
  };
  const charCount = foodDescription.length;

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <ScrollView style={styles.modalScroll}>
          <View style={styles.content}>
            <CustomTitle title="Add food" />
            <CustomInput
              value={foodName}
              onChangeText={setFoodName}
              placeholder="Food name"
            />
            <CustomInput
              value={foodDescription}
              onChangeText={handleInputChange}
              placeholder="Food description"
              style={styles.description}
              multiline={true}
              numberOfLines={4}
            />
            <Text>{charCount}/1500</Text>
            <CustomInput
              value={foodIngredient}
              onChangeText={setFoodIngredient}
              placeholder="Enter food ingredient"
            />
            <CustomInput
              value={foodRecipe}
              onChangeText={setFoodRecipe}
              placeholder="Enter food recipe food step"
            />

            <Pressable onPress={() => requestCameraPermission()}>
              <Image
                source={{uri: img || imgURL.UndefineImg}}
                style={styles.previewImg}
              />
            </Pressable>
            <CustomButton title="Add food" onPress={handleAddFood} />
            <CustomButton
              isText={false}
              isIcon={true}
              iconSize={24}
              icon="close"
              style={styles.close}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddFoodPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 14,
  },
  modal: {
    width: 350,
    height: 550,
    borderRadius: 10,
  },
  modalScroll: {
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  description: {
    maxHeight: 100,
  },
  previewImg: {
    width: 100,
    height: 100,
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 'auto',
  },
});
