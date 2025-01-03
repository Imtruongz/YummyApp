import color from '../utils/color';
import CustomTitle from './customize/Title';

import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Dialog from 'react-native-dialog';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {RootState} from '../redux/store';
import {food} from '../redux/slices/food/types';

import {deleteFoodAPI, getFoodByIdAPI} from '../redux/slices/food/foodThunk';
import colors from '../utils/color';

import {MMKV} from 'react-native-mmkv';
import Toast from 'react-native-toast-message';
const storage = new MMKV();

const FirstRoute = () => {
  const dispatch = useAppDispatch();
  const {userFoodList} = useAppSelector((state: RootState) => state.food);

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
        dispatch(getFoodByIdAPI(storage.getString('userId') || '')); // Reload danh sách
        setVisible(false);
        setCurrentItem(null);
      }
    }
  };

  useEffect(() => {
    console.log('Render');
    dispatch(getFoodByIdAPI(storage.getString('userId') || ''));
  }, [dispatch]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {userFoodList?.map(item => (
          <TouchableOpacity
            key={item.foodId}
            onLongPress={() => showDialog(item)}
            style={styles.itemContainer}>
            {/* Top img */}
            <Image style={styles.img} source={{uri: item.foodThumbnail}} />
            {/* Bottom info */}
            <View style={styles.titleItemLeft}>
              <CustomTitle style={styles.title} title={item.foodName} />
            </View>
          </TouchableOpacity>
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
  itemContainer: {
    width: '47%',
    height: 180,
    backgroundColor: colors.light,
    borderRadius: 15,
    gap: 8,
    shadowColor: color.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  titleItemLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 'auto',
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
