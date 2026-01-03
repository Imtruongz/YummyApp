import React from 'react';
import { Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle, ImageStyle } from 'react-native';
import { Typography, IconSvg, CustomAvatar } from '@/components';
import { ImagesSvg, colors, img } from '@/utils';
import { useTranslation } from 'react-i18next';

export type FoodCardItem = {
  foodId: string;
  foodName: string;
  foodThumbnail: string;
  userId: string;
  userDetail?: { username?: string; avatar?: string } | null;
  foodDescription?: string;
  averageRating?: number | null;
  CookingTime?: string | number;
  difficultyLevel?: 'easy' | 'medium' | 'hard' | string;
};

type Props = {
  item: FoodCardItem;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  showFavoriteIcon?: boolean;
};

const FoodCard: React.FC<Props> = ({ item, onPress, containerStyle, imageStyle, showFavoriteIcon = true }) => {
  const { t } = useTranslation();
  const difficultyLabel = ((): string | undefined => {
    if (!item.difficultyLevel) return undefined;
    const key = item.difficultyLevel === 'easy' ? 'easy' : item.difficultyLevel === 'medium' ? 'medium' : item.difficultyLevel === 'hard' ? 'hard' : undefined;
    return key ? t(key) : item.difficultyLevel;
  })();

  return (
    <Pressable style={[styles.itemContainer, containerStyle]} onPress={onPress}>
      <Image source={{ uri: item.foodThumbnail }} style={[styles.img, imageStyle]} />
      <View style={styles.titleItemLeft}>
        <Typography title={item.foodName} fontSize={18} fontWeight="700" numberOfLines={2} ellipsizeMode="tail" />
        {!!item.foodDescription && (
          <Typography title={item.foodDescription} fontSize={14} numberOfLines={2} ellipsizeMode="tail" style={{ color: colors.smallText }} />
        )}

        <View style={styles.infoRow}>
          {(item.averageRating !== undefined && item.averageRating !== null) && (
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>⭐ {(item.averageRating || 0).toFixed(1)}</Text>
            </View>
          )}
          {!!item.CookingTime && (
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>⏱️ {t('minutes_short', { count: Number(item.CookingTime) || 0 })}</Text>
            </View>
          )}
          {!!difficultyLabel && (
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>⚡ {difficultyLabel}</Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <CustomAvatar
            width={30}
            height={30}
            borderRadius={15}
            image={item.userDetail?.avatar || img.defaultAvatar}
          />
          <Typography title={item.userDetail?.username} numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1 }} />
        </View>
      </View>
    </Pressable>
  );
};

export default FoodCard;
export { FoodCard };

const styles = StyleSheet.create({
  itemContainer: {
    width: 300,
    height: 220,
    margin: 10,
    borderRadius: 20,
    backgroundColor: colors.light,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
  },
  img: {
    width: 140,
    height: 220,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    resizeMode: 'cover',
  },
  titleItemLeft: {
    padding: 14,
    justifyContent: 'flex-start',
    gap: 8,
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  infoBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  infoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  favoriteIcon: {
    position: 'absolute',
    bottom: 14,
    right: 14,
  },
});
