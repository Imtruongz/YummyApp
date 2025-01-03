import {Image, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../utils/color';

interface CustomAvatarProps {
  image?: string;
  style?: object;
  width?: number;
  height?: number;
  borderRadius?: number;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  image,
  style,
  height,
  width,
  borderRadius,
}) => {
  return (
    <>
      <Image
        width={width}
        height={height}
        borderRadius={borderRadius}
        style={[styles.imgAvatar, style]}
        source={{uri: image}}
      />
    </>
  );
};

export default CustomAvatar;

const styles = StyleSheet.create({
  imgAvatar: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
