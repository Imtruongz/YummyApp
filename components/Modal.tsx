import {
  Button,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';

import CustomInput from './customize/Input';
import CustomButton from './customize/Button';
import CustomTitle from './customize/Title';

import { launchImageLibrary} from 'react-native-image-picker';

import {useAppDispatch} from '../redux/hooks';

import {food} from '../redux/slices/food/foodSlice';
import {addFood} from '../redux/slices/food/foodSlice';

interface customModalProps {
  onPress?: () => void;
}

const CustomModal: React.FC<customModalProps> = ({onPress}) => {
  const [foodName, setFoodName] = useState('');
  const [foodIngredient, setFoodIngredient] = useState('');
  const [foodRecipe, setFoodRecipe] = useState('');
  const [img, setImg] = useState('');

  const dispatch = useAppDispatch();

  const handleAddFood = () => {
    const newFood: food = {
      id: Date.now().toString(), // Tạo ID duy nhất cho món ăn
      name: foodName,
      ingredients: foodIngredient,
      step: foodRecipe,
      image: img,
    };

    dispatch(addFood(newFood)); // Gọi action addFood để thêm món ăn vào Redux store
    console.log('Add food success', newFood);

    // Reset các input
    setFoodName('');
    setFoodIngredient('');
    setFoodRecipe('');
    setImg('');
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // const result: any = await launchCamera({
        //   mediaType: 'photo',
        //   cameraType: 'back',
        // });

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

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <CustomTitle title="Add food" />
        <CustomInput
          value={foodName}
          onChangeText={setFoodName}
          placeholder="Enter food name"
        />
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
        <Text>Choose food category</Text>
        <Text>Choose food image</Text>

        <CustomButton
          title="Choose food image"
          onPress={() => requestCameraPermission()}
        />
        {img ? (
          <Image source={{uri: img}} style={{width: 100, height: 100}} />
        ) : null}
        <CustomButton title="Add food" onPress={handleAddFood} />

        <Button title="X" onPress={onPress} />
      </View>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
    height: 500,
    borderRadius: 10,
    backgroundColor: 'rgba(218, 190, 127, 0.9)',
    padding: 20,
  },
});
