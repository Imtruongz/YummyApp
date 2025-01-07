import React, {useEffect, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import CustomButton from '../components/customize/Button';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import imgURL from '../utils/urlImg';
import Header from '../components/customize/Header';
import SelectDropdown from 'react-native-select-dropdown';
import {addFoodAPI} from '../redux/slices/food/foodThunk';
import {getAllCategoriesAPI} from '../redux/slices/category/categoryThunk';
import {foodPayload} from '../redux/slices/food/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import colors from '../utils/color';
import CustomTitle from '../components/customize/Title';
import {SafeAreaView} from 'react-native-safe-area-context';

import {getAllFoodAPI} from '../redux/slices/food/foodThunk';
import {getFoodByIdAPI} from '../redux/slices/food/foodThunk';

import {MMKV} from 'react-native-mmkv';
const storage = new MMKV();

// Initial state
const initialState: foodPayload = {
  foodName: '',
  categoryId: '',
  userId: '',
  foodDescription: '',
  foodIngredients: [],
  foodThumbnail: '',
  foodSteps: [],
  CookingTime: '',
};

const AddFoodPage = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<foodPayload>(initialState);
  const [errorForm, setErrorForm] = useState<null | {[key: string]: string}>(
    null,
  );

  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);

  const {categoryList} = useAppSelector((state: RootState) => state.categories);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };
  const handleIngredientChange = (text: string, index: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };
  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };
  const handleAddStep = () => {
    setSteps([...steps, '']);
  };
  const handleStepChange = (text: string, index: number) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };
  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };
  // Fetch categories on mount
  useEffect(() => {
    dispatch(getAllCategoriesAPI());
  }, [dispatch]);

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
          setFormData(prev => ({
            ...prev,
            foodThumbnail: result.assets[0].uri,
          }));
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

  const handleSubmit = async () => {
    const updatedFormData = {
      ...formData,
      userId: storage.getString('userId') || '',
      foodIngredients: ingredients,
      foodSteps: steps,
    };
    try {
      await dispatch(addFoodAPI(updatedFormData)).unwrap();
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'New food added successfully!',
        visibilityTime: 2000,
      });

      await dispatch(getAllFoodAPI());
      await dispatch(getFoodByIdAPI(storage.getString('userId') || ''));
      setFormData(initialState);
      setIngredients(['']);
      setSteps(['']);
      setErrorForm(null);
    } catch (error: any) {
      setErrorForm(error?.data?.errors || {general: 'Something went wrong!'});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Food" iconName="arrowleft" />
      <ScrollView>
        <View style={styles.container2}>
          <CustomTitle title="Choose Image" />
          <Pressable onPress={requestCameraPermission}>
            <Image
              source={{uri: formData.foodThumbnail || imgURL.UndefineImg}} //7
              style={styles.imagePreview}
            />
          </Pressable>
          {errorForm?.foodThumbnail && (
            <Text style={styles.errorText}>{errorForm.foodThumbnail}</Text>
          )}
        </View>

        <View style={styles.container2}>
          <CustomTitle title="Food Name" />
          <TextInput
            style={styles.foodNameTextInput}
            placeholder="Enter food name"
            value={formData.foodName}
            onChangeText={
              text => setFormData(prev => ({...prev, foodName: text})) //2
            }
          />
          {errorForm?.foodName && (
            <Text style={styles.errorText}>{errorForm.foodName}</Text>
          )}
        </View>

        <View style={styles.container2}>
          <CustomTitle title="Description" />
          <TextInput
            style={styles.foodDescriptionTextInput}
            placeholder="Enter description"
            value={formData.foodDescription}
            numberOfLines={5}
            multiline={true}
            onChangeText={
              text => setFormData(prev => ({...prev, foodDescription: text})) //5
            }
          />
          {errorForm?.foodDescription && (
            <Text style={styles.errorText}>{errorForm.foodDescription}</Text>
          )}
        </View>

        <View style={styles.foodcategoryContainer}>
          <CustomTitle title="Category" />
          <SelectDropdown
            data={categoryList}
            onSelect={selectedItem => {
              console.log(selectedItem.categoryId);
              setFormData(prev => ({
                ...prev,
                categoryId: selectedItem.categoryId,
              }));
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.categoryName) || 'Category'}
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

        <View style={styles.foodcategoryContainer}>
          <CustomTitle title="Cooking time" />
          <TextInput
            style={styles.cookingTimeTextInput}
            keyboardType="numeric"
            placeholder="Time in minutes"
            value={formData.CookingTime}
            onChangeText={
              text => setFormData(prev => ({...prev, CookingTime: text})) //6
            }
          />
        </View>

        <View style={styles.container2}>
          <CustomTitle title="Ingredients" />
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ISTextInputContainer}>
              <TextInput
                style={styles.ISTextInput}
                placeholder={`Ingredient ${index + 1}`}
                value={ingredient}
                onChangeText={text => handleIngredientChange(text, index)}
              />
              <Pressable onPress={() => handleRemoveIngredient(index)}>
                <AntDesignIcon style={styles.icon} name="minus" size={22} />
              </Pressable>
            </View>
          ))}
          <CustomButton
            style={styles.addIngredient}
            title="Add Ingredient"
            onPress={handleAddIngredient}
          />
        </View>

        <View style={styles.container2}>
          <CustomTitle title="Steps" />
          {steps.map((step, index) => (
            <View key={index} style={styles.ISTextInputContainer}>
              <TextInput
                style={styles.ISTextInput}
                placeholder={`Step ${index + 1}`}
                value={step}
                onChangeText={text => handleStepChange(text, index)}
              />
              <Pressable onPress={() => handleRemoveStep(index)}>
                <AntDesignIcon style={styles.icon} name="minus" size={22} />
              </Pressable>
            </View>
          ))}
          <CustomButton
            style={styles.addIngredient}
            title="Add Step"
            onPress={handleAddStep}
          />
        </View>
      </ScrollView>

      <View style={styles.buttons}>
        <CustomButton title="Add Food" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default AddFoodPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  //Image block
  container2: {
    marginHorizontal: 18,
    marginVertical: 12,
    gap: 10,
  },
  imagePreview: {
    width: 327,
    height: 180,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  // FoodName block
  foodNameTextInput: {
    width: 327,
    height: 53,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    padding: 16,
  },
  // FoodDescription block
  foodDescriptionTextInput: {
    width: 327,
    height: 123,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    padding: 16,
  },
  // FoodCategory and cooking time block
  foodcategoryContainer: {
    marginHorizontal: 18,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cookingTimeTextInput: {
    width: 160,
    height: 53,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    padding: 16,
  },
  //Ingredients and Step blocks
  ISTextInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ISTextInput: {
    width: 280,
    height: 53,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  icon: {
    padding: 2,
    borderRadius: 16,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  addIngredient: {
    width: 127,
    backgroundColor: colors.secondary,
    marginHorizontal: 18,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.light,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 10,
  },

  dropdownButtonStyle: {
    width: 160,
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 22,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    position: 'absolute',
    bottom: 100,
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
});
