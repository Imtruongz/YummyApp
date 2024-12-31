import color from '../utils/color';
import CustomTitle from './customize/Title';

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Dialog from 'react-native-dialog';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {RootState} from '../redux/store';
import { food } from '../redux/slices/food/types';

import {deleteFoodAPI, getFoodByIdAPI} from '../redux/slices/food/foodThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
    <View style={[styles.container]}>
      <FlatList
        data={foodList}
        keyExtractor={(item) => item.foodId}
        renderItem={({item}) => (
          <TouchableOpacity onLongPress={() => showDialog(item)}style={styles.item}>
            {/* Left content */}
            <View style={styles.titleItemLeft}>
              <CustomTitle title={item.foodName} />
              <Text numberOfLines={5} ellipsizeMode="tail">
                {item.foodDescription}
              </Text>
            </View>
            {/* Right img */}
            <View style={styles.titleItemRight}>
              <Image style={styles.img} source={{uri: item.foodThumbnail}} />
            </View>
          </TouchableOpacity>
        )}
      />
      <Dialog.Container visible={visible}>
        <Dialog.Title>Delete</Dialog.Title>
        <Dialog.Description>
          Do you want to delete? You cannot undo this action.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Delete" onPress={handleDelete} />
      </Dialog.Container>
    </View>
  );
};

export default FirstRoute;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    gap: 14,
    padding: 10,
  },
  item: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    backgroundColor: color.light,
    marginBottom: 10,
  },
  titleItemLeft: {
    padding: 14,
    justifyContent: 'flex-start',
    gap: 14,
    width: '60%',
    height: '100%',
  },
  titleItemRight: {
    width: '40%',
  },
  img: {
    width: 140,
    height: 180,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: 'cover',
  },
});
