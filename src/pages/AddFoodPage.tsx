import React, {useEffect, useState, useLayoutEffect} from 'react';
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
import CustomButton from '../components/customize/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import imgURL from '../utils/urlImg';
import HomeHeader from '../components/HomeHeader';
import SelectDropdown from 'react-native-select-dropdown';
import {addFoodAPI} from '../redux/slices/food/foodThunk';
import {getAllCategoriesAPI} from '../redux/slices/category/categoryThunk';
import {foodPayload} from '../redux/slices/food/types';

const Icon = require('react-native-vector-icons/MaterialCommunityIcons').default;
const AntDesignIcon = require('react-native-vector-icons/AntDesign').default;

import colors from '../utils/color';
import CustomTitle from '../components/customize/Title';
import {SafeAreaView} from 'react-native-safe-area-context';

import {getAllFoodAPI} from '../redux/slices/food/foodThunk';
import {getFoodByIdAPI} from '../redux/slices/food/foodThunk';
import {NativeModules} from 'react-native';
import RNFS from 'react-native-fs';
import {MMKV} from 'react-native-mmkv';
import {useTranslation} from 'react-i18next';

const storage = new MMKV();
const userId = storage.getString('userId') || '';

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

// Hàm chuyển đổi hình ảnh sang base64
const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    if (uri.startsWith('file://')) {
      const base64Data = await RNFS.readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64Data}`;
    } else if (uri.startsWith('content://')) {
      console.log('Need to handle content:// URI');
      const base64Data = await RNFS.readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64Data}`;
    } else {
      console.error('Unsupported URI format');
      return '';
    }
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return '';
  }
};

const AddFoodPage = ({ navigation }: any) => {
  const {t} = useTranslation();
  useLayoutEffect(() => {
    navigation?.getParent?.()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation?.getParent?.()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<foodPayload>(initialState);
  const [errorForm, setErrorForm] = useState<null | {[key: string]: string}>(
    null,
  );

  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [originalImageUri, setOriginalImageUri] = useState<string>('');

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
    console.log('getAllCategoriesAPI rendered successfully');
  }, [dispatch]);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result: any = await launchImageLibrary({
          mediaType: 'photo',
          includeBase64: false,
          maxHeight: 800,
          maxWidth: 800,
        });
        if (result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          setOriginalImageUri(imageUri);
          const base64Image = await convertImageToBase64(imageUri);
          setFormData(prev => ({
            ...prev,
            foodThumbnail: base64Image,
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
      userId: userId,
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

      // Chỉ gọi một API để tránh trùng lặp dữ liệu
      await dispatch(getFoodByIdAPI({ userId: userId }));
      
      // Reset form state
      setFormData(initialState);
      setIngredients(['']);
      setSteps(['']);
      setErrorForm(null);
      setOriginalImageUri('');
      
      // Chuyển về màn hình Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeNavigator' }],
      });
    } catch (error: any) {
      setErrorForm(error?.data?.errors || {general: 'Something went wrong!'});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader 
        mode="back" 
        title={t('add_add_food_header')} 
        showGoBack={true}
        showNotification={false}
      />
      <ScrollView>
        <View style={styles.container2}>
          <CustomTitle title={t('add_choose_image')} />
          <Pressable onPress={requestCameraPermission}>
            <Image
              source={{uri: originalImageUri || imgURL.UndefineImg}}
              style={styles.imagePreview}
            />
          </Pressable>
          {errorForm?.foodThumbnail && (
            <Text style={styles.errorText}>{errorForm.foodThumbnail}</Text>
          )}
        </View>

        <View style={styles.container2}>
          <CustomTitle title={t('add_food_name')} />
          <TextInput
            style={styles.foodNameTextInput}
            placeholder={t('add_food_name')}
            value={formData.foodName}
            onChangeText={text =>
              setFormData(prev => ({...prev, foodName: text}))
            }
          />
          {errorForm?.foodName && (
            <Text style={styles.errorText}>{errorForm.foodName}</Text>
          )}
        </View>

        <View style={styles.container2}>
          <CustomTitle title={t('add_description')} />
          <TextInput
            style={styles.foodDescriptionTextInput}
            placeholder={t('add_description')}
            value={formData.foodDescription}
            numberOfLines={5}
            multiline={true}
            onChangeText={text =>
              setFormData(prev => ({...prev, foodDescription: text}))
            }
          />
          {errorForm?.foodDescription && (
            <Text style={styles.errorText}>{errorForm.foodDescription}</Text>
          )}
        </View>

        <View style={styles.foodcategoryContainer}>
          <CustomTitle title={t('add_category')} />
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
                    {(selectedItem && selectedItem.categoryName) ||
                      t('add_category')}
                  </Text>
                  {React.createElement(Icon, {
                    name: isOpened ? 'chevron-up' : 'chevron-down',
                    style: styles.dropdownButtonArrowStyle,
                  })}
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
          <CustomTitle title={t('add_cooking_time')} />
          <TextInput
            style={styles.cookingTimeTextInput}
            keyboardType="numeric"
            placeholder={t('add_cooking_time')}
            value={formData.CookingTime}
            onChangeText={text =>
              setFormData(prev => ({...prev, CookingTime: text}))
            }
          />
        </View>

        <View style={styles.container2}>
          <CustomTitle title={t('add_ingredients')} />
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ISTextInputContainer}>
              <TextInput
                style={styles.ISTextInput}
                placeholder={`${t('add_placeholder_ingredients')} ${index + 1}`}
                value={ingredient}
                onChangeText={text => handleIngredientChange(text, index)}
              />
              <Pressable onPress={() => handleRemoveIngredient(index)}>
                {React.createElement(AntDesignIcon, {
                  style: styles.icon,
                  name: 'minus',
                  size: 22,
                })}
              </Pressable>
            </View>
          ))}
          <CustomButton
            style={styles.addIngredient}
            title={t('add_add_ingredient')}
            onPress={handleAddIngredient}
          />
        </View>

        <View style={styles.container2}>
          <CustomTitle title={t('add_steps')} />
          {steps.map((step, index) => (
            <View key={index} style={styles.ISTextInputContainer}>
              <TextInput
                style={styles.ISTextInput}
                placeholder={`${t('add_placeholder_steps')} ${index + 1}`}
                value={step}
                onChangeText={text => handleStepChange(text, index)}
              />
              <Pressable onPress={() => handleRemoveStep(index)}>
                {React.createElement(AntDesignIcon, {
                  style: styles.icon,
                  name: 'minus',
                  size: 22,
                })}
              </Pressable>
            </View>
          ))}
          <CustomButton
            style={styles.addIngredient}
            title={t('add_add_step')}
            onPress={handleAddStep}
          />
        </View>
      </ScrollView>

      <View style={styles.buttons}>
        <CustomButton title={t('add_add_food_btn')} onPress={handleSubmit} />
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
  foodNameTextInput: {
    width: 327,
    height: 53,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    padding: 16,
  },
  foodDescriptionTextInput: {
    width: 327,
    height: 123,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    padding: 16,
  },
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
