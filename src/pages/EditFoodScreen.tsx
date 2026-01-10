import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStack } from '@/navigation/types';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useLoading } from '@/hooks/useLoading';
import { updateFoodAPI, getDetailFoodAPI, getFoodByIdAPI } from '../redux/slices/food/foodThunk';
import { getAllCategoriesAPI } from '../redux/slices/category/categoryThunk';
import { foodPayload, food } from '../redux/slices/food/types';
import { selectCategoryList, selectSelectedFood } from '@/redux/selectors';

import { CustomButton, HomeHeader, IconSvg, CustomInput, NumberSpinner, TimePicker } from '@/components'
import { colors, ImagesSvg, showToast, handleAsyncAction, goBack, getStorageString, pickImageFromLibrary, parseCookingTime } from '@/utils'

interface EditFoodScreenProps
    extends NativeStackScreenProps<HomeStack, 'EditFoodScreen'> { }

const EditFoodScreen: React.FC<EditFoodScreenProps> = ({ route }) => {
    const { foodId } = route.params;
    const userId = getStorageString('userId') || '';
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { LoadingShow, LoadingHide } = useLoading();

    const [formData, setFormData] = useState<foodPayload>({
        foodName: '',
        categoryId: '',
        userId: userId,
        foodDescription: '',
        foodIngredients: [],
        foodThumbnail: '',
        foodSteps: [],
        CookingTime: 0,
        difficultyLevel: 'medium',
        servings: 1,
    });

    const [errorForm, setErrorForm] = useState<null | { [key: string]: string }>(null);
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [steps, setSteps] = useState<string[]>(['']);
    const [originalImageUri, setOriginalImageUri] = useState<string>('');

    const categoryList = useAppSelector(selectCategoryList);
    const selectedFood = useAppSelector(selectSelectedFood);

    // Load food details on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                LoadingShow();
                await Promise.all([
                    dispatch(getDetailFoodAPI(foodId)),
                    dispatch(getAllCategoriesAPI()),
                ]);
            } finally {
                LoadingHide();
            }
        };
        loadData();
    }, [dispatch, foodId, LoadingShow, LoadingHide]);

    // Pre-fill form when food data is loaded
    useEffect(() => {
        if (selectedFood && selectedFood.foodId === foodId) {
            setFormData({
                foodName: selectedFood.foodName,
                categoryId: selectedFood.categoryId,
                userId: selectedFood.userId,
                foodDescription: selectedFood.foodDescription,
                foodIngredients: selectedFood.foodIngredients,
                foodThumbnail: selectedFood.foodThumbnail,
                foodSteps: selectedFood.foodSteps,
                // Convert old string format to number for backward compatibility
                CookingTime: typeof selectedFood.CookingTime === 'string'
                    ? parseCookingTime(selectedFood.CookingTime)
                    : selectedFood.CookingTime,
                difficultyLevel: selectedFood.difficultyLevel || 'medium',
                servings: selectedFood.servings || 1,
            });

            setIngredients(selectedFood.foodIngredients || ['']);
            setSteps(selectedFood.foodSteps || ['']);
            setOriginalImageUri(selectedFood.foodThumbnail);
        }
    }, [selectedFood, foodId]);

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

    const requestCameraPermission = async () => {
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
            errors.foodName = t('edit_food_screen.add_validation_food_name');
        }

        if (!formData.foodThumbnail || !originalImageUri) {
            errors.foodThumbnail = t('edit_food_screen.add_validation_image');
        }

        if (!formData.categoryId) {
            errors.categoryId = t('edit_food_screen.add_validation_category');
        }

        if (!formData.foodDescription.trim()) {
            errors.foodDescription = t('edit_food_screen.add_validation_description');
        }

        // TimePicker ensures valid number, just check if selected
        if (!formData.CookingTime || formData.CookingTime === 0) {
            errors.CookingTime = t('time_picker.add_validation_cooking_time_required');
        }

        const validIngredients = ingredients.filter(item => item.trim() !== '');
        if (validIngredients.length === 0) {
            errors.ingredients = t('edit_food_screen.add_validation_ingredients');
        }

        const validSteps = steps.filter(item => item.trim() !== '');
        if (validSteps.length === 0) {
            errors.steps = t('edit_food_screen.add_validation_steps');
        }

        return { isValid: Object.keys(errors).length === 0, errors };
    };

    const handleSubmit = async () => {
        const { isValid, errors } = validateForm();
        if (!isValid) {
            setErrorForm(errors);
            showToast.error(t('error'), t('edit_food_screen.add_validation_form_error'));
            return;
        }

        const filteredIngredients = ingredients.filter(item => item.trim() !== '');
        const filteredSteps = steps.filter(item => item.trim() !== '');

        const updatedFormData = {
            foodId: foodId,
            userId: userId,
            foodName: formData.foodName,
            categoryId: formData.categoryId,
            foodDescription: formData.foodDescription,
            foodIngredients: filteredIngredients,
            foodThumbnail: formData.foodThumbnail,
            foodSteps: filteredSteps,
            CookingTime: formData.CookingTime,
            difficultyLevel: formData.difficultyLevel,
            servings: formData.servings,
        };

        LoadingShow();

        await handleAsyncAction(
            () => dispatch(updateFoodAPI(updatedFormData as any)).unwrap(),
            {
                onSuccess: async () => {
                    await dispatch(getFoodByIdAPI({ userId: userId }));
                    setErrorForm(null);
                    LoadingHide();
                    goBack();
                },
                onError: (error: any) => {
                    setErrorForm(error?.data?.errors || { general: t('general_error') });
                    LoadingHide();
                },
                successMessage: t('edit_food_screen.add_success_message'),
                errorMessage: t('edit_food_screen.add_error_message'),
            }
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <HomeHeader
                mode="back"
                title={t('edit_food_screen.edit_food_header')}
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
                                <Text style={styles.uploadText}>{t('edit_food_screen.add_choose_image')}</Text>
                                <Text style={styles.uploadSubtext}>{t('edit_food_screen.tap_to_add')}</Text>
                            </View>
                        )}
                    </Pressable>
                    {errorForm?.foodThumbnail && (
                        <Text style={styles.errorText}>{errorForm.foodThumbnail}</Text>
                    )}
                </View>

                {/* Food Name Input */}
                <View style={styles.card}>
                    <Text style={styles.label}>{t('edit_food_screen.add_food_name')}</Text>
                    <CustomInput
                        style={[styles.input, errorForm?.foodName ? styles.inputError : {}]}
                        placeholder={t('edit_food_screen.add_food_name_placeholder')}
                        value={formData.foodName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, foodName: text }))}
                    />
                    {errorForm?.foodName && <Text style={styles.errorText}>{errorForm.foodName}</Text>}
                </View>

                {/* Category Dropdown */}
                <View style={styles.card}>
                    <Text style={styles.label}>{t('edit_food_screen.add_category')}</Text>
                    <SelectDropdown
                        data={categoryList}
                        onSelect={(selectedItem) => setFormData(prev => ({ ...prev, categoryId: selectedItem.categoryId }))}
                        renderButton={(selectedItem, isOpened) => (
                            <View style={styles.dropdownButtonStyle}>
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {selectedItem?.categoryName || t('edit_food_screen.add_select_category')}
                                </Text>
                            </View>
                        )}
                        renderItem={(item, index, isSelected) => (
                            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                <Text style={styles.dropdownItemTxtStyle}>{item.categoryName}</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenuStyle}
                        defaultValueByIndex={categoryList.findIndex(cat => cat.categoryId === formData.categoryId)}
                    />
                    {errorForm?.categoryId && <Text style={styles.errorText}>{errorForm.categoryId}</Text>}
                </View>

                {/* Description Input */}
                <View style={styles.card}>
                    <Text style={styles.label}>{t('edit_food_screen.add_description')}</Text>
                    <CustomInput
                        placeholder={t('edit_food_screen.add_description_placeholder')}
                        value={formData.foodDescription}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, foodDescription: text }))}
                        multiline={true}
                        numberOfLines={4}
                        style={[styles.input, { height: 120 }, errorForm?.foodDescription ? styles.inputError : {}]}
                    />
                    {errorForm?.foodDescription && (
                        <Text style={styles.errorText}>{errorForm.foodDescription}</Text>
                    )}
                </View>

                {/* Cooking Time */}
                <View style={styles.card}>
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
                        label={t('edit_food_screen.add_cooking_time')}
                        minuteInterval={15}
                    />
                    {errorForm?.CookingTime && <Text style={styles.errorText}>{errorForm.CookingTime}</Text>}
                </View>

                {/* Ingredients */}
                <View style={styles.card}>
                    <Text style={styles.label}>{t('edit_food_screen.add_ingredients')}</Text>
                    {ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientItem}>
                            <View style={styles.itemNumber}>
                                <Text style={styles.itemNumberText}>{index + 1}</Text>
                            </View>
                            <CustomInput
                                placeholder={`${t('edit_food_screen.add_ingredient')} ${index + 1}`}
                                value={ingredient}
                                onChangeText={(text) => handleIngredientChange(text, index)}
                                style={styles.input}
                            />
                            {ingredients.length > 1 && (
                                <Pressable onPress={() => handleRemoveIngredient(index)} style={styles.removeButton}>
                                    <IconSvg xml={ImagesSvg.icAdd} width={20} height={20} color={'#FF3B30'} />
                                </Pressable>
                            )}
                        </View>
                    ))}
                    <Pressable onPress={handleAddIngredient} style={styles.addButton}>
                        <IconSvg xml={ImagesSvg.icPlus} width={18} height={18} color={colors.primary} />
                        <Text style={styles.addButtonText}>{t('edit_food_screen.add_ingredient')}</Text>
                    </Pressable>
                    {errorForm?.ingredients && <Text style={styles.errorText}>{errorForm.ingredients}</Text>}
                </View>

                {/* Steps */}
                <View style={styles.card}>
                    <Text style={styles.label}>{t('edit_food_screen.add_steps')}</Text>
                    {steps.map((step, index) => (
                        <View key={index} style={styles.stepItem}>
                            <View style={styles.itemNumber}>
                                <Text style={styles.itemNumberText}>{index + 1}</Text>
                            </View>
                            <CustomInput
                                placeholder={`${t('edit_food_screen.add_step')} ${index + 1}`}
                                value={step}
                                onChangeText={(text) => handleStepChange(text, index)}
                                multiline={true}
                                numberOfLines={2}
                                style={styles.input}
                            />
                            {steps.length > 1 && (
                                <Pressable onPress={() => handleRemoveStep(index)} style={styles.removeButton}>
                                    <IconSvg xml={ImagesSvg.icAdd} width={20} height={20} color={'#FF3B30'} />
                                </Pressable>
                            )}
                        </View>
                    ))}
                    <Pressable onPress={handleAddStep} style={styles.addButton}>
                        <IconSvg xml={ImagesSvg.icPlus} width={18} height={18} color={colors.primary} />
                        <Text style={styles.addButtonText}>{t('edit_food_screen.add_step')}</Text>
                    </Pressable>
                    {errorForm?.steps && <Text style={styles.errorText}>{errorForm.steps}</Text>}
                </View>

                {/* Difficulty Level & Servings */}
                <View style={styles.rowContainer}>
                    <View style={styles.halfCard}>
                        <Text style={styles.label}>{t('edit_food_screen.add_difficulty_level')}</Text>
                        <SelectDropdown
                            data={['easy', 'medium', 'hard']}
                            onSelect={(selectedItem) => setFormData(prev => ({ ...prev, difficultyLevel: selectedItem }))}
                            renderButton={(selectedItem, isOpened) => {
                                const displayText = selectedItem ? t(`${selectedItem}`) : t('edit_food_screen.add_difficulty_level');
                                return (
                                    <View style={styles.dropdownButtonStyle}>
                                        <Text style={styles.dropdownButtonTxtStyle}>
                                            {displayText}
                                        </Text>
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                const displayText = item ? t(`${item}`) : '';
                                return (
                                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                        <Text style={styles.dropdownItemTxtStyle}>{displayText}</Text>
                                    </View>
                                );
                            }}
                            dropdownStyle={styles.dropdownMenuStyle}
                            defaultValue={formData.difficultyLevel}
                        />
                    </View>

                    <View style={styles.halfCard}>
                        <Text style={styles.label}>{t('edit_food_screen.add_servings')}</Text>
                        <NumberSpinner
                            value={formData.servings || 1}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, servings: value }))}
                            min={1}
                            max={20}
                            step={1}
                        />
                    </View>
                </View>
            </ScrollView>
            {/* Submit Button */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    title={t('edit_food_screen.add_update_button')}
                    onPress={handleSubmit}
                    style={styles.submitButton}
                />
            </View>
        </SafeAreaView>
    );
};

export default EditFoodScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: 16,
        marginTop: 16,
        marginBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
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
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: 10,
    },
    errorText: {
        color: colors.danger,
        fontSize: 13,
        marginTop: 6,
        fontWeight: '500',
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary + '15',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 8,
    },
    addButtonText: {
        fontSize: 13,
        color: colors.primary,
        marginLeft: 6,
        fontWeight: '600',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    ingredientItem: {
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
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    stepNumber: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 0,
    },
    stepNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
    removeButton: {
        padding: 8,
    },
    input: {
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
    inputError: {
        borderWidth: 2,
        borderColor: colors.danger,
    },
    rowContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    halfCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
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
});

