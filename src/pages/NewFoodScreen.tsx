import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Image, PermissionsAndroid, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import SelectDropdown from 'react-native-select-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import { MMKV } from 'react-native-mmkv';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addFoodAPI } from '../redux/slices/food/foodThunk';
import { getAllCategoriesAPI } from '../redux/slices/category/categoryThunk';
import { getFoodByIdAPI } from '../redux/slices/food/foodThunk';
import { foodPayload } from '../redux/slices/food/types';
import { selectCategoryList } from '@/redux/selectors';

import { CustomButton, HomeHeader, CustomTitle, IconSvg, CustomInput } from '@/components'
import {img, colors, ImagesSvg} from '@/utils'

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
      const base64Data = await RNFS.readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64Data}`;
    } else {
      return '';
    }
  } catch (error) {
    console.log('Error converting image to base64:', error);
    return '';
  }
};

const NewFoodScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
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
  const [errorForm, setErrorForm] = useState<null | { [key: string]: string }>(
    null,
  );

  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [originalImageUri, setOriginalImageUri] = useState<string>('');

  const categoryList = useAppSelector(selectCategoryList);

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
      console.log(err);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Kiểm tra tên món ăn
    if (!formData.foodName.trim()) {
      errors.foodName = t('add_validation_food_name');
    }

    // Kiểm tra hình ảnh món ăn
    if (!formData.foodThumbnail || !originalImageUri) {
      errors.foodThumbnail = t('add_validation_image');
    }

    // Kiểm tra danh mục món ăn
    if (!formData.categoryId) {
      errors.categoryId = t('add_validation_category');
    }

    // Kiểm tra mô tả món ăn
    if (!formData.foodDescription.trim()) {
      errors.foodDescription = t('add_validation_description');
    }

    // Kiểm tra thời gian nấu ăn (không bắt buộc, nhưng nếu có thì phải là số)
    if (formData.CookingTime && isNaN(Number(formData.CookingTime))) {
      errors.CookingTime = t('add_validation_cooking_time_number');
    }

    // Kiểm tra nguyên liệu
    const validIngredients = ingredients.filter(item => item.trim() !== '');
    if (validIngredients.length === 0) {
      errors.ingredients = t('add_validation_ingredients');
    }

    // Kiểm tra các bước nấu
    const validSteps = steps.filter(item => item.trim() !== '');
    if (validSteps.length === 0) {
      errors.steps = t('add_validation_steps');
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async () => {
    // Validate form trước khi gửi
    const { isValid, errors } = validateForm();
    if (!isValid) {
      setErrorForm(errors);

      // Hiển thị thông báo lỗi
      Toast.show({
        type: 'error',
        position: 'top',
        text1: t('error'),
        text2: t('add_validation_form_error'),
        visibilityTime: 3000,
      });

      return;
    }

    // Lọc bỏ nguyên liệu và các bước rỗng
    const filteredIngredients = ingredients.filter(item => item.trim() !== '');
    const filteredSteps = steps.filter(item => item.trim() !== '');

    const updatedFormData = {
      ...formData,
      userId: userId,
      foodIngredients: filteredIngredients,
      foodSteps: filteredSteps,
    };

    try {
      await dispatch(addFoodAPI(updatedFormData)).unwrap();
      Toast.show({
        type: 'success',
        position: 'top',
        text1: t('success'),
        text2: t('add_success_message'),
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
      console.log('Error adding food:', error);
      setErrorForm(error?.data?.errors || { general: t('general_error') });

      Toast.show({
        type: 'error',
        position: 'top',
        text1: t('error'),
        text2: t('add_error_message'),
        visibilityTime: 3000,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <HomeHeader
        mode="back"
        title={t('add_add_food_header')}
        showGoBack={true}
        showNotification={false}
      />
      <ScrollView>
        <View style={styles.content}>
          <CustomTitle title={t('add_choose_image')} />
          <Pressable onPress={requestCameraPermission}>
            <Image
              source={{ uri: originalImageUri || img.UndefineImg }}
              style={styles.imagePreview}
            />
          </Pressable>
          {errorForm?.foodThumbnail && (
            <Text style={styles.errorText}>{errorForm.foodThumbnail}</Text>
          )}
        </View>

        <View style={styles.content}>
          <CustomTitle title={t('add_food_name')} />
          <CustomInput
            style={styles.foodNameTextInput}
            placeholder={t('add_placeholder_food_name')}
            value={formData.foodName}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, foodName: text }))
            }
          />
          {errorForm?.foodName && (
            <Text style={styles.errorText}>{errorForm.foodName}</Text>
          )}
        </View>
        <View style={styles.content}>
          <CustomTitle title={t('add_description')} />
          <CustomInput
            style={styles.foodDescriptionTextInput}
            placeholder={t('add_placeholder_description')}
            value={formData.foodDescription}
            numberOfLines={5}
            multiline={true}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, foodDescription: text }))
            }
          />
          {errorForm?.foodDescription && (
            <Text style={styles.errorText}>{errorForm.foodDescription}</Text>
          )}
        </View>

        <View style={styles.foodcategoryContainer}>
          <CustomTitle title={t('add_category')} />
          <View>
            <SelectDropdown
              data={categoryList}
              onSelect={selectedItem => {
                setFormData(prev => ({
                  ...prev,
                  categoryId: selectedItem.categoryId,
                }));
                // Xóa lỗi khi người dùng chọn danh mục
                if (errorForm?.categoryId) {
                  const newErrorForm = { ...errorForm };
                  delete newErrorForm.categoryId;
                  setErrorForm(newErrorForm);
                }
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={[
                    styles.dropdownButtonStyle,
                    errorForm?.categoryId ? styles.inputError : {}
                  ]}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.categoryName) ||
                        t('add_category')}
                    </Text>
                    {
                      isOpened
                        ? <IconSvg xml={ImagesSvg.iconArrowDown} width={20} height={20} color='black' />
                        : <IconSvg xml={ImagesSvg.iconArrowRight} width={20} height={20} color='black' />
                    }
                  </View>
                );
              }}
              renderItem={(item, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: '#D2D9DF' }),
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
            {errorForm?.categoryId && (
              <Text style={[styles.errorText, { textAlign: 'right' }]}>
                {errorForm.categoryId}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.foodcategoryContainer}>
          <CustomTitle title={t('add_cooking_time')} />
          <View>
            <CustomInput style={[ styles.cookingTimeTextInput, errorForm?.CookingTime ? styles.inputError : {} ]}
              placeholder={t('add_cooking_time')}
              value={formData.CookingTime}
              onChangeText={text => {
                setFormData(prev => ({ ...prev, CookingTime: text }));
                if (errorForm?.CookingTime) {
                  const newErrorForm = { ...errorForm };
                  delete newErrorForm.CookingTime;
                  setErrorForm(newErrorForm);
                }
              }}
            />
            {errorForm?.CookingTime && (
              <Text style={[styles.errorText, { textAlign: 'right' }]}>
                {errorForm.CookingTime}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <CustomTitle title={t('add_ingredients')} />
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ISTextInputContainer}>
              <CustomInput
                style={[styles.ISTextInput, errorForm?.ingredients && !ingredient.trim() ? styles.inputError : {}]}
                placeholder={`${t('add_placeholder_ingredients')} ${index + 1}`}
                value={ingredient}
                onChangeText={text => {
                  handleIngredientChange(text, index);
                  if (errorForm?.ingredients && text.trim()) {
                    const newErrorForm = { ...errorForm };
                    delete newErrorForm.ingredients;
                    setErrorForm(newErrorForm);
                  }
                }}
              />
              <Pressable
                onPress={() => handleRemoveIngredient(index)}
                disabled={ingredients.length === 1} // Không cho phép xóa khi chỉ còn 1 phần tử
              >
                <View style={styles.icon}>
                  <IconSvg
                    xml={ImagesSvg.icMinus}
                    width={22}
                    height={22}
                    color={colors.primary}
                  />
                </View>
              </Pressable>
            </View>
          ))}
          {errorForm?.ingredients && (
            <Text style={styles.errorText}>{errorForm.ingredients}</Text>
          )}
          <CustomButton
            title={t('add_add_ingredient')}
            onPress={handleAddIngredient}
          />
        </View>

        <View style={styles.content}>
          <CustomTitle title={t('add_steps')} />
          {steps.map((step, index) => (
            <View key={index} style={styles.ISTextInputContainer}>
              <CustomInput style={[ styles.ISTextInput, errorForm?.steps && !step.trim() ? styles.inputError : {} ]}
                placeholder={`${t('add_placeholder_steps')} ${index + 1}`}
                value={step}
                onChangeText={text => {
                  handleStepChange(text, index);
                  // Xóa lỗi khi người dùng nhập bước nấu
                  if (errorForm?.steps && text.trim()) {
                    const newErrorForm = { ...errorForm };
                    delete newErrorForm.steps;
                    setErrorForm(newErrorForm);
                  }
                }}
              />
              <Pressable
                onPress={() => handleRemoveStep(index)}
                disabled={steps.length === 1} // Không cho phép xóa khi chỉ còn 1 phần tử
              >
                <View style={styles.icon}>
                  <IconSvg
                    xml={ImagesSvg.icMinus}
                    width={22}
                    height={22}
                    color={colors.primary}
                  />
                </View>
              </Pressable>
            </View>
          ))}
          {errorForm?.steps && (
            <Text style={styles.errorText}>{errorForm.steps}</Text>
          )}
          <CustomButton
            title={t('add_add_step')}
            onPress={handleAddStep}
          />
        </View>
      </ScrollView>

      {/* Hiển thị lỗi chung nếu có */}
      {errorForm?.general && (
        <View style={styles.generalErrorContainer}>
          <Text style={styles.generalErrorText}>{errorForm.general}</Text>
        </View>
      )}

      <View style={styles.buttons}>
        <CustomButton title={t('add_add_food_btn')} onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default NewFoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    marginHorizontal: 18,
    marginVertical: 12,
    gap: 10,
  },
  imagePreview: {
    height: 180,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  foodNameTextInput: {
    width: '100%',
    height: 53,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    padding: 16,
  },
  foodDescriptionTextInput: {
    width: '100%',
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
    width: '80%',
    height: 53,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  icon: {
    padding: 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'red',
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
  generalErrorContainer: {
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ffeeee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: 'red',
  },
  generalErrorText: {
    color: 'red',
    fontSize: 14,
  },
});
