import { StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {MMKV} from 'react-native-mmkv';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../android/types/StackNavType';

import {useAppSelector, useAppDispatch} from '@/redux/hooks';
import {RootState} from '@/redux/store';
import {food} from '@/redux/slices/food/types';
import { useNotification } from '@/contexts/NotificationContext';
import {deleteFoodAPI, getFoodByIdAPI} from '@/redux/slices/food/foodThunk';
import {ConfirmationModal, FoodItemCard} from '@/components'

const storage = new MMKV();

const FirstRoute = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  
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

  const { showNotification } = useNotification();
  
  const handleDelete = async () => {
    if (currentItem) {
      try {
        await dispatch(deleteFoodAPI(currentItem.foodId)).unwrap();
        showNotification({
          type: 'success',
          title: t('success_title'),
          message: t('delete_recipe_success_message'),
          duration: 3000,
        });
      } catch (error) {
        showNotification({
          type: 'error',
          title: t('error_title'),
          message: t('delete_recipe_error_message'),
          duration: 4000,
          actionText: t('try_again_button'),
          onAction: () => handleDelete(),
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
      <ConfirmationModal
        visible={visible}
        title={t('delete_recipe_title')}
        message={t('delete_recipe_confirmation_message')}
        type="warning"
        onClose={handleCancel}
        onConfirm={handleDelete}
        confirmText={t('delete_button')}
        cancelText={t('cancel_button')}
      />
    </>
  );
};

export { FirstRoute };
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
