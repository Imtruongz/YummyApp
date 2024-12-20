import { FlatList, Image, View, StyleSheet} from 'react-native';
import React from 'react';

import { useAppSelector } from '../redux/hooks';
import {RootState} from '../redux/store';

import CustomTitle from './customize/Title';
import color from '../utils/color';

const SecondRoute = () => {
  const recipes = useAppSelector((state: RootState) => state.recipes.recipes);
  return (
    <View style={[styles.container]}>
      <FlatList
        data={recipes}
        renderItem={({item}) => (
          <View style={styles.item}>
            {/* Left content */}
            <View style={styles.titleItemLeft}>
              <CustomTitle title={item.strMeal} />
              {/* <Text numberOfLines={5} ellipsizeMode="tail" >{item.description}</Text> */}
            </View>
            {/* Right img */}
            <View style={styles.titleItemRight}>
              <Image style={styles.img} source={{uri: item.strMealThumb}} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default SecondRoute;

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
  },
  titleItemRight: {
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
});

