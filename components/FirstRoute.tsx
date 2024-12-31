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
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../utils/color';

const FirstRoute = () => {
  const dispatch = useAppDispatch();
  const {foodList} = useAppSelector((state: RootState) => state.food);

  const [visible, setVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<food | null>(null);

  const showDialog = (item: food) => {
    setCurrentItem(item);
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = () => {
    if (currentItem) {
      dispatch(deleteFoodAPI(currentItem.foodId));
    }
    setVisible(false);
    setCurrentItem(null);
  };

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (userId) {
        dispatch(getFoodByIdAPI(userId));
      }
    } catch (error) {
      console.error('Error fetching data from AsyncStorage', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {foodList?.map(item => (
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
