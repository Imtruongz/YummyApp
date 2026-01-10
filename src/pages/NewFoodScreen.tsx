import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addFoodAPI } from '../redux/slices/food/foodThunk';
import { getAllCategoriesAPI } from '../redux/slices/category/categoryThunk';
import { getFoodByIdAPI } from '../redux/slices/food/foodThunk';
import { foodPayload } from '../redux/slices/food/types';
import { selectCategoryList } from '@/redux/selectors';
import { useLoading } from '@/hooks/useLoading';

import { CustomButton, HomeHeader, IconSvg, CustomInput, NumberSpinner, TimePicker, ImagePickerModal } from '@/components'
import { colors, ImagesSvg, showToast, handleAsyncAction, resetTo, pickImageFromLibrary, takePhotoWithCamera } from '@/utils'

const initialState: foodPayload = {
  foodName: '',
  categoryId: '',
  userId: '',
  foodDescription: '',
  foodIngredients: [],
  foodThumbnail: '',
  foodSteps: [],
  CookingTime: 0,
  difficultyLevel: 'medium',
  servings: 1,
};

const NewFoodScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { LoadingShow, LoadingHide } = useLoading();
  const [formData, setFormData] = useState<foodPayload>(initialState);
  const [errorForm, setErrorForm] = useState<null | { [key: string]: string }>(
    null,
  );

  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [originalImageUri, setOriginalImageUri] = useState<string>('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const categoryList = useAppSelector(selectCategoryList);
  // ⭐ Get userId from Redux auth state (always up-to-date after login)
  const currentUser = useAppSelector((state) => state.auth.user);
  const userId = currentUser?.userId || '';

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

  const handleImageSelection = () => {
    setShowImagePicker(true);
  };

  const handleCameraPress = async () => {
    try {
      const result = await takePhotoWithCamera({ maxWidth: 800, maxHeight: 800 });
      if (result) {
        setOriginalImageUri(result.imageUri);
        setFormData(prev => ({
          ...prev,
          foodThumbnail: result.base64Image,
        }));
      }
    } catch (err) {
      console.log('Error taking photo:', err);
      showToast.error(t('error'), t('toast_messages.image_picker_error'));
    }
  };

  const handleLibraryPress = async () => {
    try {
      const result = await pickImageFromLibrary({ maxWidth: 800, maxHeight: 800 });
      if (result) {
        setOriginalImageUri(result.imageUri);
        setFormData(prev => ({
          ...prev,
          foodThumbnail: result.base64Image,
        }));
      }
    } catch (err) {
      console.log('Error selecting image:', err);
      showToast.error(t('error'), t('toast_messages.image_picker_error'));
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

    // TimePicker ensures valid number, just check if selected
    if (!formData.CookingTime || formData.CookingTime === 0) {
      errors.CookingTime = t('time_picker.add_validation_cooking_time_required');
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

    // ⭐ Validate userId exists
    if (!userId) {
      setErrorForm({ general: t('general_error') });
      setIsSubmitting(false);
      LoadingHide();
      showToast.error(t('error'), 'User not logged in. Please login again.');
      return;
    }

    setIsSubmitting(true);
    LoadingShow();

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
          LoadingHide();
          showToast.success(t('success'), t('new_food_screen.add_success_message'));
          resetTo('HomeNavigator');
        },
        onError: (error: any) => {
          setErrorForm(error?.data?.errors || { general: t('general_error') });
          setIsSubmitting(false);
          LoadingHide();
          showToast.error(t('error'), t('new_food_screen.add_error_message'));
        },
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Image Upload Card */}
          <View style={styles.card}>
            <Pressable onPress={handleImageSelection} style={styles.imageCard}>
              {originalImageUri ? (
                <Image
                  source={{ uri: originalImageUri }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <IconSvg
                    xml={ImagesSvg.icCamera}
                    width={52}
                    height={52}
                    color={colors.dark}
                  />
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

            {/* 2x2 Grid: Category, Cooking Time, Difficulty, Servings */}
            <View style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Row 1: Category & Cooking Time */}
              <View style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
                {/* Category */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Text style={styles.label}>{t('new_food_screen.add_category')}</Text>
                  </View>
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
                          { height: 44 },
                          errorForm?.categoryId ? styles.inputError : {}
                        ]}>
                          <Text style={[styles.dropdownButtonTxtStyle, { fontSize: 13 }]}>
                            {(selectedItem && selectedItem.categoryName) || t('new_food_screen.add_category')}
                          </Text>
                          <IconSvg
                            xml={isOpened ? ImagesSvg.iconArrowDown : ImagesSvg.iconArrowRight}
                            width={16}
                            height={16}
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
                          <Text style={[styles.dropdownItemTxtStyle, { fontSize: 13 }]}>
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

                {/* Cooking Time */}
                <View style={{ flex: 1 }}>
                  <TimePicker
                    value={typeof formData.CookingTime === 'number' ? formData.CookingTime : (formData.CookingTime ? parseInt(formData.CookingTime, 10) : 0)}
                    onChange={(minutes) => {
                      setFormData(prev => ({ ...prev, CookingTime: minutes }));
                      if (errorForm?.CookingTime) {
                        const newErrorForm = { ...errorForm };
                        delete newErrorForm.CookingTime;
                        setErrorForm(newErrorForm);
                      }
                    }}
                    label={t('new_food_screen.add_cooking_time')}
                    minuteInterval={15}
                  />
                  {errorForm?.CookingTime && (
                    <Text style={styles.errorText}>{errorForm.CookingTime}</Text>
                  )}
                </View>
              </View>

              {/* Row 2: Difficulty & Servings */}
              <View style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
                {/* Difficulty Level */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Text style={styles.label}>{t('new_food_screen.difficulty_level')}</Text>
                  </View>
                  <SelectDropdown
                    data={['easy', 'medium', 'hard']}
                    onSelect={selectedItem => {
                      setFormData(prev => ({
                        ...prev,
                        difficultyLevel: selectedItem,
                      }));
                    }}
                    renderButton={(selectedItem, isOpened) => {
                      const displayText = selectedItem ? t(`new_food_screen.${selectedItem}`) : t('new_food_screen.difficulty_level');
                      return (
                        <View style={[styles.dropdownButtonStyle, { height: 44 }]}>
                          <Text style={[styles.dropdownButtonTxtStyle, { fontSize: 13 }]}>
                            {displayText}
                          </Text>
                          <IconSvg
                            xml={isOpened ? ImagesSvg.iconArrowDown : ImagesSvg.iconArrowRight}
                            width={16}
                            height={16}
                            color={colors.primary}
                          />
                        </View>
                      );
                    }}
                    renderItem={(item, isSelected) => {
                      const displayText = item ? t(`new_food_screen.${item}`) : '';
                      return (
                        <View
                          style={{
                            ...styles.dropdownItemStyle,
                            ...(isSelected && { backgroundColor: colors.primary + '20' }),
                          }}>
                          <Text style={[styles.dropdownItemTxtStyle, { fontSize: 13 }]}>
                            {displayText}
                          </Text>
                        </View>
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                  />
                </View>

                {/* Servings */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Text style={styles.label}>{t('new_food_screen.food_portions')}</Text>
                  </View>
                  <NumberSpinner
                    value={formData.servings || 1}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, servings: value }))}
                    min={1}
                    max={20}
                    step={1}
                  />
                  {errorForm?.servings && (
                    <Text style={styles.errorText}>{errorForm.servings}</Text>
                  )}
                </View>
              </View>
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
              title={t('new_food_screen.add_add_ingredient')}
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
              title={t('new_food_screen.add_add_step')}
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
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Submit Button */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title={t('new_food_screen.add_add_food_btn')}
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        />
      </View>

      {/* Image Picker Modal */}
      <ImagePickerModal
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onCameraPress={handleCameraPress}
        onLibraryPress={handleLibraryPress}
      />
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
    paddingHorizontal: 12,
  },
  descriptionInput: {
    height: 120,
    backgroundColor: colors.InputBg,
    paddingHorizontal: 14,
    textAlignVertical: 'top',
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
    flex: 1,
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 26,
    backgroundColor: 'transparent',
  },
  submitButton: {
    minHeight: 52,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});
