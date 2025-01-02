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
import color from '../utils/color';
import SelectDropdown from 'react-native-select-dropdown';
import {addFoodAPI} from '../redux/slices/food/foodThunk';
import {getAllCategoriesAPI} from '../redux/slices/category/categoryThunk';
import {food} from '../redux/slices/food/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
      userId: user?.userId || '', // Lấy userId từ Redux store
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
    <View style={styles.container}>
      <Header title="Add Food" iconName="close" />
      <ScrollView style={styles.body}>
        <View>
          <Text style={styles.label}>Food Image</Text>
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

        <Text style={styles.label}>Food Name</Text>
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

        <Text style={styles.label}>Description</Text>
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

        <Text style={styles.label}>Category</Text>

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
                    'Select your mood'}
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

        <Text style={styles.label}>Ingredients</Text>
        <CustomInput
          placeholder="Enter ingredients"
          value={formData.foodIngredient}
          onChangeText={
            text => setFormData(prev => ({...prev, foodIngredient: text})) //6
          }
        />

        <Text style={styles.label}>Recipe Steps</Text>
        <CustomInput
          placeholder="Enter steps or recipe"
          value={formData.foodSteps}
          onChangeText={
            text => setFormData(prev => ({...prev, foodSteps: text})) //8
          }
        />
      </ScrollView>

      <View style={styles.buttons}>
        <CustomButton title="Add Food" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default AddFoodPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
  body: {
    padding: 20,
  },
  previewImg: {
    width: 100,
    height: 100,
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
    color: color.dark,
  },
  dropdownButtonStyle: {
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
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
});
