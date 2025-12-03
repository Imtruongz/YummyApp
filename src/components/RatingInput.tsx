import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import IconSvg from './IconSvg';
import { ImagesSvg } from '../utils/ImageSvg';
import colors from '../utils/color';

interface RatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  readonly?: boolean;
}

const RatingInput: React.FC<RatingInputProps> = ({
  rating,
  onRatingChange,
  readonly = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={readonly}
            onPress={() => onRatingChange(star)}
            style={styles.starButton}
          >
            <IconSvg
              xml={ImagesSvg.icStar}
              width={30}
              height={30}
              color={star <= rating ? colors.primary : colors.smallText}
            />
          </TouchableOpacity>
        ))}
      </View>
      {rating > 0 && (
        <Text style={styles.ratingText}>{rating} / 5 sao</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  starButton: {
    padding: 5,
  },
  ratingText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.smallText,
    textAlign: 'center',
  },
});

export { RatingInput };
export default RatingInput;
