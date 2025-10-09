import {
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Dialog from 'react-native-dialog';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {RootState} from '../redux/store';
import {food} from '../redux/slices/food/types';

import {deleteFoodAPI, getFoodByIdAPI} from '../redux/slices/food/foodThunk';

import {MMKV} from 'react-native-mmkv';
import Toast from 'react-native-toast-message';
import FoodItemCard from './FoodItemCard';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../android/types/StackNavType';

const storage = new MMKV();

const FirstRoute = () => {
  const dispatch = useAppDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const {userFoodList} = useAppSelector((state: RootState) => state.food);
  const [userId, setUserId] = useState(storage.getString('userId') || '');

  const [visible, setVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<food | null>(null);

  const showDialog = (item: food) => {
    setCurrentItem(item);
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = async () => {
    if (currentItem) {
      try {
        await dispatch(deleteFoodAPI(currentItem.foodId)).unwrap();
        Toast.show({
          type: 'success',
          text1: 'Delete successfully',
          visibilityTime: 2000,
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete food!',
          visibilityTime: 2000,
        });
      } finally {
        if (userId) {
          dispatch(getFoodByIdAPI({userId}));
        }
        setVisible(false);
        setCurrentItem(null);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(getFoodByIdAPI({userId}));
      console.log('getFoodByIdAPI rendered successfully with userId:', userId);
    } else {
      console.log('userId is empty, skipping getFoodByIdAPI call');
    }
  }, [dispatch, userId]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {Array.isArray(userFoodList) && userFoodList.map(item => (
          <FoodItemCard
            key={item.foodId}
            item={item}
            onLongPress={() => showDialog(item)}
            onPress={() => {
              navigation.navigate('RecipeDetailPage', {
                foodId: item.foodId,
                userId: item.userId,
              });
            }}
            containerStyle={{ width: '47%' }}
          />
        ))}
      </ScrollView>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Delete</Dialog.Title>
        <Dialog.Description>
          Do you want to delete? You cannot undo this action.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Delete" onPress={handleDelete} />
      </Dialog.Container>
    </>
  );
};

export default FirstRoute;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
