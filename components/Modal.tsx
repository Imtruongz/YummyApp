import {
  Image,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';

import CustomInput from './customize/Input';
import CustomButton from './customize/Button';
import CustomTitle from './customize/Title';

import {launchImageLibrary} from 'react-native-image-picker';

import {useAppDispatch} from '../redux/hooks';

import {food} from '../redux/slices/food/types';
import {addFood} from '../redux/slices/food/foodSlice';

interface customModalProps {
  onPress?: () => void;
}

const CustomModal: React.FC<customModalProps> = ({onPress}) => {
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodIngredient, setFoodIngredient] = useState('');
  const [foodRecipe, setFoodRecipe] = useState('');
  const [img, setImg] = useState('');

  const dispatch = useAppDispatch();

  const handleAddFood = () => {
    const newFood: food = {
      id: Date.now().toString(), // Tạo ID duy nhất cho món ăn
      name: foodName,
      ingredients: foodIngredient,
      description: foodDescription,
      step: foodRecipe,
      image: img,
    };
    //Add new food to redux store
    dispatch(addFood(newFood));
    console.log('Add food success', newFood);
    //Close modal when food is added
    onPress && onPress();

    // Reset các input
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
      // Chỉ cho phép nhập nếu độ dài văn bản <= 1500 ký tự
      setFoodDescription(text);
    }
  };

  // Lấy độ dài của chuỗi hiện tại
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
            <Text style={{textAlign: 'right'}}>{charCount}/1500</Text>
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

            <CustomButton
              title="Choose food image"
              onPress={() => requestCameraPermission()}
            />
            {img ? (
              <Image source={{uri: img}} style={styles.previewImg} />
            ) : null}
            <CustomButton title="Add food" onPress={handleAddFood} />
            <CustomButton
              isText={false}
              isIcon={true}
              iconSize={24}
              icon="close"
              style={styles.close}
              onPress={onPress}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default CustomModal;

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
    backgroundColor: 'rgba(218, 190, 127, 0.9)',
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
  previewImg: {
    width: 100,
    height: 100,
  },
  description: {
    maxHeight: 100,
  },
  close: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 'auto',
  },
});
