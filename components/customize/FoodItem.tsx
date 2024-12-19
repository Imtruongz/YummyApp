import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface CustomFoodItemProps {
  title?: string;
  image?: string;
}

const CustomFoodItem: React.FC<CustomFoodItemProps> = ({title, image}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Image style={styles.img} source={{uri: image}} />
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
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 6,
    paddingVertical: 12,
    width: '100%',
  },
  img: {
    width: 100,
    height: 50,
    resizeMode: 'contain',

  },
});
