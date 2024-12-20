// Redux
import {useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';

import color from '../utils/color';
import CustomTitle from './customize/Title';

import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const FirstRoute = () => {
  const foodList = useAppSelector((state: RootState) => state.food.foods);

  return (
    <View style={[styles.container]}>
      <FlatList
        data={foodList}
        renderItem={({item}) => (
          <View style={styles.item}>
            {/* Left content */}
            <View style={styles.titleItemLeft}>
              <CustomTitle title={item.name} />
              <Text numberOfLines={5} ellipsizeMode="tail" >{item.description}</Text>
            </View>
            {/* Right img */}
            <View style={styles.titleItemRight}>
              <Image style={styles.img} source={{uri: item.image}} />
            </View>
          </View>
        )}
      />
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
