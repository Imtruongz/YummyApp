import React, { useEffect, useState } from 'react';
import { Image, PermissionsAndroid, Pressable, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addFoodAPI } from '../redux/slices/food/foodThunk';
import { getAllCategoriesAPI } from '../redux/slices/category/categoryThunk';
import { getFoodByIdAPI } from '../redux/slices/food/foodThunk';
import { foodPayload } from '../redux/slices/food/types';
import { selectCategoryList } from '@/redux/selectors';

import { CustomButton, HomeHeader, IconSvg, CustomInput } from '@/components'
import { colors, ImagesSvg, showToast, handleAsyncAction, resetTo, getStorageString } from '@/utils'

const userId = getStorageString('userId') || '';

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

const NewFoodScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<foodPayload>(initialState);
  const [errorForm, setErrorForm] = useState<null | { [key: string]: string }>(
    null,
  );

  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [originalImageUri, setOriginalImageUri] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  useEffect(() => {
    dispatch(getAllCategoriesAPI());
  }, [dispatch]);

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission denied');
          return;
        }
      }

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
      } else if (result.errorCode) {
        console.log('Image picker error:', result.errorMessage);
      }
    } catch (err) {
      console.log('Error selecting image:', err);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.foodName.trim()) {
      errors.foodName = t('new_food_screen.add_validation_food_name');
    }

    if (!formData.foodThumbnail || !originalImageUri) {
      errors.foodThumbnail = t('new_food_screen.add_validation_image');
    }

    if (!formData.categoryId) {
      errors.categoryId = t('new_food_screen.add_validation_category');
    }

    if (!formData.foodDescription.trim()) {
      errors.foodDescription = t('new_food_screen.add_validation_description');
    }

    if (formData.CookingTime && isNaN(Number(formData.CookingTime))) {
      errors.CookingTime = t('new_food_screen.add_validation_cooking_time_number');
    }

    const validIngredients = ingredients.filter(item => item.trim() !== '');
    if (validIngredients.length === 0) {
      errors.ingredients = t('new_food_screen.add_validation_ingredients');
    }

    const validSteps = steps.filter(item => item.trim() !== '');
    if (validSteps.length === 0) {
      errors.steps = t('new_food_screen.add_validation_steps');
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async () => {
    const { isValid, errors } = validateForm();
    if (!isValid) {
      setErrorForm(errors);
      showToast.error(t('error'), t('new_food_screen.add_validation_form_error'));
      return;
    }

    const filteredIngredients = ingredients.filter(item => item.trim() !== '');
    const filteredSteps = steps.filter(item => item.trim() !== '');

    const updatedFormData = {
      ...formData,
      userId: userId,
      foodIngredients: filteredIngredients,
      foodSteps: filteredSteps,
    };

    setIsSubmitting(true);

    await handleAsyncAction(
      () => dispatch(addFoodAPI(updatedFormData)).unwrap(),
      {
        onSuccess: async () => {
          await dispatch(getFoodByIdAPI({ userId: userId }));

          setFormData(initialState);
          setIngredients(['']);
          setSteps(['']);
          setErrorForm(null);
          setOriginalImageUri('');
          setIsSubmitting(false);

          resetTo('HomeNavigator');
        },
        onError: (error: any) => {
          setErrorForm(error?.data?.errors || { general: t('general_error') });
          setIsSubmitting(false);
        },
        successMessage: t('new_food_screen.add_success_message'),
        errorMessage: t('new_food_screen.add_error_message'),
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <HomeHeader
        mode="back"
        title={t('new_food_screen.add_add_food_header')}
        showGoBack={true}
        showNotification={false}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Image Upload Card */}
        <View style={styles.card}>
          <Pressable onPress={requestCameraPermission} style={styles.imageCard}>
            {originalImageUri ? (
              <Image
                source={{ uri: originalImageUri }}
                style={styles.imagePreview}
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadIcon}>📷</Text>
                <Text style={styles.uploadText}>{t('new_food_screen.add_choose_image')}</Text>
                <Text style={styles.uploadSubtext}>{t('new_food_screen.tap_to_add')}</Text>
              </View>
            )}
          </Pressable>
          {errorForm?.foodThumbnail && (
            <Text style={styles.errorText}>{errorForm.foodThumbnail}</Text>
          )}
        </View>

        {/* Basic Information Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('new_food_screen.bacsic_info')}</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('new_food_screen.add_food_name')}</Text>
            <CustomInput
              style={[styles.input, errorForm?.foodName ? styles.inputError : {}]}
              placeholder={t('new_food_screen.add_placeholder_food_name')}
              value={formData.foodName}
              onChangeText={text => {
                setFormData(prev => ({ ...prev, foodName: text }));
                if (errorForm?.foodName) {
                  const newErrorForm = { ...errorForm };
                  delete newErrorForm.foodName;
                  setErrorForm(newErrorForm);
                }
              }}
            />
            {errorForm?.foodName && (
              <Text style={styles.errorText}>{errorForm.foodName}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('new_food_screen.add_category')}</Text>
            <SelectDropdown
              data={categoryList}
              onSelect={selectedItem => {
                setFormData(prev => ({
                  ...prev,
                  categoryId: selectedItem.categoryId,
                }));
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
                      {(selectedItem && selectedItem.categoryName) || t('new_food_screen.add_category')}
                    </Text>
                    <IconSvg
                      xml={isOpened ? ImagesSvg.iconArrowDown : ImagesSvg.iconArrowRight}
                      width={18}
                      height={18}
                      color={colors.primary}
                    />
                  </View>
                );
              }}
              renderItem={(item, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: colors.primary + '20' }),
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
              <Text style={styles.errorText}>{errorForm.categoryId}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('new_food_screen.add_cooking_time')}</Text>
            <CustomInput
              style={[styles.input, errorForm?.CookingTime ? styles.inputError : {}]}
              placeholder="30"
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
              <Text style={styles.errorText}>{errorForm.CookingTime}</Text>
            )}
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('new_food_screen.add_description')}</Text>
          <CustomInput
            style={[styles.descriptionInput, errorForm?.foodDescription ? styles.inputError : {}]}
            placeholder={t('new_food_screen.add_placeholder_description')}
            value={formData.foodDescription}
            numberOfLines={5}
            multiline={true}
            onChangeText={text => {
              setFormData(prev => ({ ...prev, foodDescription: text }));
              if (errorForm?.foodDescription) {
                const newErrorForm = { ...errorForm };
                delete newErrorForm.foodDescription;
                setErrorForm(newErrorForm);
              }
            }}
          />
          {errorForm?.foodDescription && (
            <Text style={styles.errorText}>{errorForm.foodDescription}</Text>
          )}
        </View>

        {/* Ingredients Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('new_food_screen.add_ingredients')}</Text>
            <Text style={styles.itemCount}>{ingredients.filter(i => i.trim()).length}</Text>
          </View>

          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.itemNumber}>
                <Text style={styles.itemNumberText}>{index + 1}</Text>
              </View>
              <CustomInput
                style={[
                  styles.listInput,
                  errorForm?.ingredients && !ingredient.trim() ? styles.inputError : {}
                ]}
                placeholder={t('new_food_screen.add_placeholder_ingredients')}
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
                disabled={ingredients.length === 1}
                style={{ padding: 8 }}
              >
                <Text style={{ fontSize: 18 }}>✕</Text>
              </Pressable>
            </View>
          ))}

          {errorForm?.ingredients && (
            <Text style={styles.errorText}>{errorForm.ingredients}</Text>
          )}

          <CustomButton
            title={`+ ${t('new_food_screen.add_add_ingredient')}`}
            onPress={handleAddIngredient}
            style={styles.addButton}
          />
        </View>

        {/* Steps Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('new_food_screen.add_steps')}</Text>
            <Text style={styles.itemCount}>{steps.filter(s => s.trim()).length}</Text>
          </View>

          {steps.map((step, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.itemNumber}>
                <Text style={styles.itemNumberText}>{index + 1}</Text>
              </View>
              <CustomInput
                style={[
                  styles.listInput,
                  errorForm?.steps && !step.trim() ? styles.inputError : {}
                ]}
                placeholder={t('new_food_screen.add_placeholder_steps')}
                value={step}
                onChangeText={text => {
                  handleStepChange(text, index);
                  if (errorForm?.steps && text.trim()) {
                    const newErrorForm = { ...errorForm };
                    delete newErrorForm.steps;
                    setErrorForm(newErrorForm);
                  }
                }}
              />
              <Pressable
                onPress={() => handleRemoveStep(index)}
                disabled={steps.length === 1}
                style={{ padding: 8 }}
              >
                <Text style={{ fontSize: 18 }}>✕</Text>
              </Pressable>
            </View>
          ))}

          {errorForm?.steps && (
            <Text style={styles.errorText}>{errorForm.steps}</Text>
          )}

          <CustomButton
            title={`+ ${t('new_food_screen.add_add_step')}`}
            onPress={handleAddStep}
            style={styles.addButton}
          />
        </View>

        {/* General Error */}
        {errorForm?.general && (
          <View style={styles.generalErrorContainer}>
            <Text style={styles.generalErrorText}>⚠️ {errorForm.general}</Text>
          </View>
        )}

        {/* Spacing for bottom button */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Sticky Submit Button */}
      <View style={styles.bottomBar}>
        <CustomButton
          title={isSubmitting ? `⏳ ${t('loading')}...` : `✨ ${t('new_food_screen.add_add_food_btn')}`}
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        />
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.light,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: colors.dark,
  },
  descriptionInput: {
    height: 120,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlignVertical: 'top',
    color: colors.dark,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 14,
  },
  imageCard: {
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: '#faf7f2',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 13,
    color: colors.smallText,
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 52,
    backgroundColor: colors.InputBg,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
  },
  dropdownMenuStyle: {
    backgroundColor: colors.light,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  dropdownItemTxtStyle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  listInput: {
    flex: 1,
    height: 46,
    backgroundColor: colors.InputBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    color: colors.dark,
  },
  addButton: {
    marginTop: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
  inputError: {
    borderWidth: 2,
    borderColor: colors.danger,
  },
  generalErrorContainer: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#ffe8e8',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  generalErrorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: colors.light,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButton: {
    minHeight: 52,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});
