import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '@/utils';

interface CustomFoodItemProps {
  title?: string;
  image?: string;
  style?: object;
  onPress?: () => void;
}

const CategoryItem: React.FC<CustomFoodItemProps> = ({
  title,
  image,
  style,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Image style={styles.img} source={{ uri: image }} />
      <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export { CategoryItem };
export default CategoryItem;

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'center',

    // shadowColor: colors.dark,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.12,
    // shadowRadius: 10,
    // elevation: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  img: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
    margin: 12,
  },
});
