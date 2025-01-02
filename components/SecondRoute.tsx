import {FlatList, Image, View, StyleSheet} from 'react-native';
import React from 'react';

import {useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';

import CustomTitle from './customize/Title';
import color from '../utils/color';

const SecondRoute = () => {
  return <View style={[styles.container]}></View>;
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
