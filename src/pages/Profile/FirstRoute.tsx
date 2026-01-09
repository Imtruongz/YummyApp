import { StyleSheet, FlatList, View, Modal, TouchableOpacity, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { food } from '@/redux/slices/food/types';
import { deleteFoodAPI, getFoodByIdAPI } from '@/redux/slices/food/foodThunk';
import { FoodItemCard, FoodListSkeleton, NoData } from '@/components'
import { handleAsyncAction, useModal, navigate, getStorageString, colors, showToast } from '@/utils'
import { navigationRef } from '@/utils/navigationHelper'
import { useLoading } from '@/hooks/useLoading';

const FirstRoute = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { LoadingShow, LoadingHide } = useLoading();

  const { userFoodList, isLoadingFood } = useAppSelector((state: RootState) => state.food);
  const [userId, setUserId] = useState(getStorageString('userId') || '');

  const [currentItem, setCurrentItem] = useState<food | null>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  const showActionModal = (item: food) => {
    setCurrentItem(item);
    setIsActionModalVisible(true);
  };

  const closeActionModal = () => {
    setIsActionModalVisible(false);
    setCurrentItem(null);
  };

  const handleEdit = () => {
    closeActionModal();
    if (currentItem) {
      navigationRef.navigate('HomeNavigator' as any, {
        screen: 'EditFoodScreen',
        params: { foodId: currentItem.foodId },
      });
    }
  };

  const handleDelete = async () => {
    closeActionModal();
    if (currentItem) {
      LoadingShow();
      await handleAsyncAction(
        async () => {
          await dispatch(deleteFoodAPI(currentItem.foodId)).unwrap();
        },
        {
          onSuccess: () => {
            showToast.success(t('success'), t('toast_messages.toast_delete_success'));
            LoadingHide();

          },
          onError: () => {
            showToast.error(t('error'), t('toast_messages.toast_delete_error'));
            LoadingHide();
          }
        }
      );

      if (userId) {
        dispatch(getFoodByIdAPI({ userId }));
      }
      setCurrentItem(null);
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(getFoodByIdAPI({ userId }));
    }
  }, [dispatch, userId]);

  return (
    <>
      {isLoadingFood ? (
        <FoodListSkeleton count={userFoodList.length || 4} />
      ) : !userFoodList || userFoodList.length === 0 ? (
        <NoData width={80} height={80} textSize={16} message={t('no_data')} />
      ) : (
        <FlatList
          data={Array.isArray(userFoodList) ? userFoodList : []}
          renderItem={({ item }) => (
            <FoodItemCard
              item={item}
              onLongPress={() => showActionModal(item)}
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
          contentContainerStyle={styles.container}
        />
      )}

      {/* Action Modal */}
      <Modal
        visible={isActionModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeActionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={handleEdit}
              >
                <Text style={styles.editButtonText}>{t('edit_button')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>{t('delete_button')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeActionModal}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFE5E5', // Light red - tạm thời
  },
  deleteButtonText: {
    color: '#FF3B30', // Red - tạm thời
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: '600',
  },
});
