import { Button, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '@/utils';

interface CustomFoodItemProps {
  title?: string;
  image?: string;
  style?: object;
  onPress?: () => void;
  isOnPressOpen?: boolean;
}

const CategoryItem: React.FC<CustomFoodItemProps> = ({
  title,
  image,
  style,
  onPress,
  isOnPressOpen,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>
      <Image style={styles.img} source={{ uri: image }} />
      {isOnPressOpen && <Button title="Open" onPress={onPress} />}
    </View>
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
    backgroundColor: colors.light,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: colors.dark,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  img: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
    marginTop: 4,
  },
});
