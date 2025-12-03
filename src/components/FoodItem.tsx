import {Button, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import color from '../utils/color';

interface CustomFoodItemProps {
  title?: string;
  image?: string;
  style?: object;
  onPress?: () => void;
  isOnPressOpen?: boolean;
}

const CustomFoodItem: React.FC<CustomFoodItemProps> = ({
  title,
  image,
  style,
  onPress,
  isOnPressOpen,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      <Image style={styles.img} source={{uri: image}} />
      {isOnPressOpen && <Button title="Open" onPress={onPress} />}
    </View>
  );
};

export { CustomFoodItem };
export default CustomFoodItem;

const styles = StyleSheet.create({
  container: {
    minWidth: 100,
    minHeight: 100,
    margin: 10,
    borderRadius: 10,
    backgroundColor: color.light,
    shadowColor: color.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 14,
    color: color.dark,
    paddingHorizontal: 6,
    paddingVertical: 8,
    textAlign: 'center',
  },
  img: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
});
