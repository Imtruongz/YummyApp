import React, {useEffect, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import CustomInput from '../components/customize/Input';
import CustomButton from '../components/customize/Button';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import imgURL from '../utils/urlImg';
import Header from '../components/customize/Header';
import SelectDropdown from 'react-native-select-dropdown';
import {addFoodAPI} from '../redux/slices/food/foodThunk';
import {getAllCategoriesAPI} from '../redux/slices/category/categoryThunk';
import {food} from '../redux/slices/food/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../utils/color';
import CustomTitle from '../components/customize/Title';
import {SafeAreaView} from 'react-native-safe-area-context';

// Initial state
const initialState: food = {
  foodName: '',
  categoryId: '',
  userId: '',
  foodDescription: '',
  foodIngredient: '',
  foodThumbnail: '',
  foodSteps: '',
};

const AddFoodPage = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<food>(initialState);
  const [errorForm, setErrorForm] = useState<null | {[key: string]: string}>(
    null,
  );

  // Redux state
  const {categoryList} = useAppSelector((state: RootState) => state.categories);
  const {user} = useAppSelector((state: RootState) => state.auth);

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
      userId: user?.userId || '',
    };
    try {
      // Dispatch the add food action
      await dispatch(addFoodAPI(updatedFormData)).unwrap();
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'New food added successfully!',
        visibilityTime: 2000,
      });

      // Reset the form after successful submission
      setFormData(initialState);
      setErrorForm(null);
    } catch (error: any) {
      setErrorForm(error?.data?.errors || {general: 'Something went wrong!'});
    }
  };

  // Còn thiếu id, category id, user id , validate , giới hạn text

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Food" iconName="close" />
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.foodImg}>
            <CustomTitle title="Choose Image" />
            <Pressable onPress={requestCameraPermission}>
              <Image
                source={{uri: formData.foodThumbnail || imgURL.UndefineImg}} //7
                style={styles.previewImg}
              />
            </Pressable>
            {errorForm?.foodThumbnail && (
              <Text style={styles.errorText}>{errorForm.foodThumbnail}</Text>
            )}
          </View>

          <View style={styles.foodName}>
            <CustomTitle title="Food Name" />
            <CustomInput
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

          <View style={styles.foodDescription}>
            <CustomTitle title="Description" />
            <CustomInput
              placeholder="Enter description"
              value={formData.foodDescription}
              onChangeText={
                text => setFormData(prev => ({...prev, foodDescription: text})) //5
              }
            />
            {errorForm?.foodDescription && (
              <Text style={styles.errorText}>{errorForm.foodDescription}</Text>
            )}
          </View>

          <View style={styles.foodcategory}>
            <CustomTitle title="Category" />

            <SelectDropdown
              data={categoryList || []}
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
                        'Category Name'}
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

          <View style={styles.foodIngredient}>
            <CustomTitle title="Ingredient" />
            <CustomInput
              placeholder="Enter ingredients"
              value={formData.foodIngredient}
              onChangeText={
                text => setFormData(prev => ({...prev, foodIngredient: text})) //6
              }
            />
          </View>

          <View style={styles.foodSteps}>
            <CustomTitle title="Step" />
            <CustomInput
              placeholder="Enter steps or recipe"
              value={formData.foodSteps}
              onChangeText={
                text => setFormData(prev => ({...prev, foodSteps: text})) //8
              }
            />
          </View>
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
  body: {
    margin: 20,
    flexDirection: 'column',
    backgroundColor: colors.secondary,
    borderRadius: 12,
  },
  previewImg: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.dark,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },

  dropdownButtonStyle: {
    width: 140,
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
  ingredients: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },

  foodImg: {
    marginBottom: 20,
    //backgroundColor: 'blue',
    width: 300,
  },
  foodName: {
    marginBottom: 20,
    //backgroundColor: 'yellow',
  },
  foodDescription: {
    marginBottom: 20,
    //backgroundColor: 'green',
  },
  foodcategory: {
    marginBottom: 20,
    //backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodIngredient: {
    marginBottom: 20,
    //backgroundColor: 'pink',
  },
  foodSteps: {
    marginBottom: 20,
    //backgroundColor: 'purple',
  },
});
