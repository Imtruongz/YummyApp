import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, ViewStyle, ImageStyle, StyleProp, Text } from 'react-native';
import { Typography } from '@/components'
import { colors } from '@/utils';

interface FoodItemProps {
  item: {
    foodId: string;
    foodName: string;
    foodThumbnail: string;
    userId: string;
  };
  onPress?: () => void;
  onLongPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  fontSize?: number;
}

/**
 * Component hiển thị một món ăn dạng card
 * Được sử dụng trong FirstRoute, UsersProfileScreen và các màn hình liên quan
 * 
 * @param item - Dữ liệu món ăn (foodId, foodName, foodThumbnail, userId)
 * @param onPress - Hàm xử lý khi nhấn vào card
 * @param onLongPress - Hàm xử lý khi nhấn giữ vào card
 * @param containerStyle - Style tùy chỉnh cho container
 * @param imageStyle - Style tùy chỉnh cho hình ảnh
 * @param textContainerStyle - Style tùy chỉnh cho phần chứa text
 * @param fontSize - Kích thước font chữ của tên món ăn
 */
const FoodItemCard: React.FC<FoodItemProps> = ({
  item,
  onPress,
  onLongPress,
  containerStyle,
  imageStyle,
  textContainerStyle,
  fontSize = 14,
}) => {
  return (
    <TouchableOpacity
      style={[styles.itemContainer, containerStyle]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}>
      {/* Top img */}
      <Image
        style={[styles.img, imageStyle]}
        source={{ uri: item.foodThumbnail }}
      />
      {/* Bottom info */}
      <View style={[styles.titleItemLeft, textContainerStyle]}>
        <Text numberOfLines={2} style={{ fontSize: fontSize, fontWeight: '500', color: colors.dark, textAlign: 'center' }}>
          {item.foodName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export { FoodItemCard };
export default FoodItemCard;

const styles = StyleSheet.create({
  itemContainer: {
    width: '47%',
    height: 160,
    backgroundColor: colors.light,
    borderRadius: 15,
    gap: 8,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 12,
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
});