import { StyleSheet, ScrollView, FlatList, View } from 'react-native';
import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {MMKV} from 'react-native-mmkv';

import {useAppSelector, useAppDispatch} from '@/redux/hooks';
import {RootState} from '@/redux/store';
import {food} from '@/redux/slices/food/types';
import {deleteFoodAPI, getFoodByIdAPI} from '@/redux/slices/food/foodThunk';
import {ConfirmationModal, FoodItemCard, FoodListSkeleton} from '@/components'
import { handleAsyncAction, useModal, navigate, getStorageString } from '@/utils'

const FirstRoute = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const {userFoodList, isLoadingFood} = useAppSelector((state: RootState) => state.food);
  const [userId, setUserId] = useState(getStorageString('userId') || '');

  const [currentItem, setCurrentItem] = useState<food | null>(null);

  const { isVisible: isDeleteModalVisible, open: openDeleteModal, close: closeDeleteModal } = useModal();

  const showDialog = (item: food) => {
    setCurrentItem(item);
    openDeleteModal();
  };
  const handleCancel = () => {
    closeDeleteModal();
  };

  const handleDelete = async () => {
    closeDeleteModal();
    if (currentItem) {
      await handleAsyncAction(
        async () => {
          await dispatch(deleteFoodAPI(currentItem.foodId)).unwrap();
        },
        {
          successMessage: 'Xóa thành công',
          errorMessage: 'Không thể xóa, vui lòng thử lại'
        }
      );
      
      if (userId) {
        dispatch(getFoodByIdAPI({userId}));
      }
      setCurrentItem(null);
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(getFoodByIdAPI({userId}));
    }
  }, [dispatch, userId]);

  return (
    <>
      {isLoadingFood ? (
        <FoodListSkeleton count={userFoodList.length || 4} />
      ) : (
        <FlatList
          data={Array.isArray(userFoodList) ? userFoodList : []}
          renderItem={({ item }) => (
            <FoodItemCard
              item={item}
              onLongPress={() => showDialog(item)}
              onPress={() => {
                navigate('FoodDetailScreen', {
                  foodId: item.foodId,
                  userId: item.userId,
                });
              }}
              containerStyle={{ width: '47%' }}
            />
          )}
          keyExtractor={(item, index) => `${item.foodId}_${index}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false}
          contentContainerStyle={styles.container}
        />
      )}
      <ConfirmationModal
        visible={isDeleteModalVisible}
        title={t('delete_recipe_title')}
        message={t('delete_recipe_confirmation_message')}
        type="warning"
        onClose={handleCancel}
        onConfirm={handleDelete}
        confirmText={t('delete_button')}
        cancelText={t('cancel')}
      />
    </>
  );
};

export { FirstRoute };
export default FirstRoute;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
