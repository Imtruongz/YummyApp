import {Button, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import color from '../../utils/color';

interface CustomFoodItemProps {
  title?: string;
  image?: string;
  style?: object;
  onPress?: () => void;
}

const CustomFoodItem: React.FC<CustomFoodItemProps> = ({title, image, style, onPress}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      <Image style={styles.img} source={{uri: image}} />
      <Button title="add" onPress={onPress} />
    </View>
  );
};

export default CustomFoodItem;

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
    backgroundColor: color.light,
    shadowColor: color.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color.dark,
    paddingHorizontal: 6,
    paddingVertical: 12,
    textAlign: 'center',
  },
  img: {
    width: 100,
    height: 50,
    resizeMode: 'contain',

  },
});
