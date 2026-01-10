import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, ViewStyle, ImageStyle, StyleProp, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Typography, IconSvg } from '@/components'
import { colors, ImagesSvg } from '@/utils';

interface FoodItemProps {
  item: {
    foodId: string;
    foodName: string;
    foodThumbnail: string;
    userId: string;
    userDetail?: { username?: string; avatar?: string } | null;
    Ingredients?: Array<{ ingredientName: string }>;
    averageRating?: number | null;
  };
  onPress?: () => void;
  onLongPress?: () => void;
  onMenuPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  fontSize?: number;
  showMenu?: boolean;
  showCreator?: boolean; // New: Hide/show creator info (default: true)
  showRating?: boolean; // New: Show rating badge at top-left (default: false)
  index?: number; // Optional: for staggered grid pattern
}

/**
 * Component hiển thị một món ăn dạng card với gradient overlay
 * Được sử dụng trong FirstRoute, UsersProfileScreen và các màn hình liên quan
 * 
 * @param item - Dữ liệu món ăn (foodId, foodName, foodThumbnail, userId, Ingredients, userDetail)
 * @param onPress - Hàm xử lý khi nhấn vào card
 * @param onLongPress - Hàm xử lý khi nhấn giữ vào card
 * @param onMenuPress - Hàm xử lý khi nhấn vào menu button (3 dots)
 * @param containerStyle - Style tùy chỉnh cho container
 * @param imageStyle - Style tùy chỉnh cho hình ảnh
 * @param textContainerStyle - Style tùy chỉnh cho phần chứa text
 * @param fontSize - Kích thước font chữ của tên món ăn
 * @param showMenu - Hiển thị menu button hay không (default: false)
 * @param showCreator - Hiển thị creator info hay không (default: true). Set false khi tất cả items đều của cùng 1 user
 */
const FoodItemCard: React.FC<FoodItemProps> = ({
  item,
  onPress,
  onLongPress,
  onMenuPress,
  containerStyle,
  imageStyle,
  textContainerStyle,
  fontSize = 14,
  showMenu = false,
  showCreator = true, // Default: show creator
  showRating = false, // Default: don't show rating badge
  index = 0, // For staggered grid
}) => {
  // Get missing ingredients (first 3)
  const missingIngredients = item.Ingredients?.slice(0, 3).map(ing => ing.ingredientName).join(', ');

  // Calculate staggered height for Pinterest/masonry-style grid
  const baseHeight = 220;

  // Pattern-based variation for natural staggered look
  const patternHeights = [0, 40, 20, 50, 10, 35, 25, 45, 15, 30];
  const patternVariation = patternHeights[index % patternHeights.length];

  // Content-based variation
  const nameLength = item.foodName?.length || 0;
  const ingredientsCount = item.Ingredients?.length || 0;
  const hasCreator = showCreator && item.userDetail?.username;
  const contentVariation = (nameLength > 40 ? 20 : 0) + (ingredientsCount > 5 ? 15 : 0) + (hasCreator ? 15 : 0);

  const cardHeight = baseHeight + patternVariation + contentVariation;

  return (
    <TouchableOpacity
      style={[styles.itemContainer, { height: cardHeight }, containerStyle]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}>
      {/* Background Image */}
      <Image
        style={[styles.img, imageStyle]}
        source={{ uri: item.foodThumbnail }}
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
        style={styles.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Rating Badge (Top-Left) */}
      {showRating && item.averageRating !== undefined && item.averageRating !== null && (
        <View style={styles.ratingBadge}>
          <IconSvg xml={ImagesSvg.icStar} width={14} height={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.averageRating.toFixed(1)}</Text>
        </View>
      )}

      {/* Menu Button (3 dots) */}
      {showMenu && (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress || onLongPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </TouchableOpacity>
      )}

      {/* Content on Image */}
      <View style={[styles.contentContainer, textContainerStyle]}>
        {/* Food Name */}
        <Text numberOfLines={2} style={[styles.foodName, { fontSize }]}>
          {item.foodName}
        </Text>

        {/* Missing Ingredients */}
        {missingIngredients && (
          <Text numberOfLines={1} style={styles.missingText}>
            Missing: {missingIngredients}
          </Text>
        )}

        {/* Creator Info */}
        {showCreator && item.userDetail?.username && (
          <View style={styles.creatorContainer}>
            <IconSvg xml={ImagesSvg.icUser} width={14} height={14} color="#fff" />
            <Text numberOfLines={1} style={styles.creatorName}>
              {item.userDetail.username}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export { FoodItemCard };
export default FoodItemCard;

const styles = StyleSheet.create({
  itemContainer: {
    width: '47%',
    backgroundColor: colors.dark,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 14,
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 10,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  menuButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 6,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    gap: 6,
  },
  foodName: {
    fontWeight: '700',
    color: '#fff',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  missingText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  creatorName: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    flex: 1,
  },
});