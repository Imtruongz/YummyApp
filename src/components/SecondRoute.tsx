import {
  FlatList,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {RootState} from '../redux/store';
import {RootStackParamList} from '../../android/types/StackNavType';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { useNotification } from '../contexts/NotificationContext';
import ConfirmationModal from './common/ConfirmationModal';
import { useTranslation } from 'react-i18next';

import CustomTitle from './customize/Title';
import colors from '../utils/color';
import {getAllFavoriteFoodsAPI, deleteFavoriteFoodAPI} from '../redux/slices/favorite/favoriteThunk';
import {MMKV} from 'react-native-mmkv';
import Toast from 'react-native-toast-message';
import Typography from './customize/Typography';
import {useNavigation} from '@react-navigation/native';
import NoData from './NoData';

const storage = new MMKV();

const SecondRoute = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const [userId, setUserId] = useState(storage.getString('userId') || '');
  const {favoriteFoodList, isLoadingFavorite} = useAppSelector(
    (state: RootState) => state.favorite,
  );
  const {foodList} = useAppSelector((state: RootState) => state.food);

  const [visible, setVisible] = useState<boolean>(false);
  const [currentFavoriteId, setCurrentFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(getAllFavoriteFoodsAPI(userId));
      console.log('getAllFavoriteFoodsAPI rendered successfully with userId:', userId);
    } else {
      console.log('userId is empty, skipping getAllFavoriteFoodsAPI call');
    }
  }, [dispatch, userId]);

  const showDialog = (favoriteFoodId: string) => {
    setCurrentFavoriteId(favoriteFoodId);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const { showNotification } = useNotification();

  const handleDeleteFavorite = async () => {
    if (currentFavoriteId && userId) {
      try {
        await dispatch(
          deleteFavoriteFoodAPI({
            userId,
            favoriteFoodId: currentFavoriteId,
          }),
        ).unwrap();
        showNotification({
          type: 'success',
          title: t('success_title'),
          message: t('delete_favorite_success_message'),
          duration: 3000,
        });
      } catch (error) {
        showNotification({
          type: 'error',
          title: t('error_title'),
          message: t('delete_favorite_error_message'),
          duration: 4000,
          actionText: t('try_again_button'),
          onAction: () => handleDeleteFavorite(),
        });
      } finally {
        setVisible(false);
        setCurrentFavoriteId(null);
      }
    }
  };

  // Tìm thông tin food dựa trên foodId từ favoriteFoodList
  const getFoodDetails = (foodId: string) => {
    return foodList.find(food => food.foodId === foodId);
  };

  if (isLoadingFavorite) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!favoriteFoodList || favoriteFoodList.length === 0) {
    return <NoData message="Không có công thức yêu thích nào" />;
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {favoriteFoodList.map(favorite => {
          const foodDetails = getFoodDetails(favorite.foodId);
          return (
            <TouchableOpacity
              key={favorite.favoriteFoodId}
              style={styles.item}
              onLongPress={() => showDialog(favorite.favoriteFoodId)}
              onPress={() => {
                navigation.navigate('RecipeDetailPage', {
                  foodId: favorite.foodId,
                  userId: favorite.userId,
                });
              }}>
              <Image
                style={styles.img}
                source={{
                  uri: foodDetails?.foodThumbnail || 'https://via.placeholder.com/100',
                }}
              />
              <View style={styles.titleItemLeft}>
                <Typography
                  title={foodDetails?.foodName || 'Không có tên'}
                  fontSize={16}
                  fontWeight="700"
                  numberOfLines={2}
                />
                <Typography
                  title={foodDetails?.foodDescription || 'Không có mô tả'}
                  fontSize={12}
                  numberOfLines={3}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ConfirmationModal
        visible={visible}
        title={t('delete_favorite_title')}
        message={t('delete_favorite_confirmation_message')}
        type="warning"
        onClose={handleCancel}
        onConfirm={handleDeleteFavorite}
        confirmText={t('delete_button')}
        cancelText={t('cancel_button')}
      />
    </>
  );
};

export default SecondRoute;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    gap: 14,
    padding: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 20,
    backgroundColor: colors.light,
    marginBottom: 10,
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  titleItemLeft: {
    padding: 14,
    justifyContent: 'flex-start',
    gap: 8,
    flex: 1,
  },
  img: {
    width: 100,
    height: 100,
  },
});
