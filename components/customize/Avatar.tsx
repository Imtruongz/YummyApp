import {Image, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../utils/color';

interface CustomAvatarProps {
  image?: string;
  style?: object;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({image, style}) => {
  return (
    <>
      <Image style={[styles.imgAvatar, style]} source={{uri: image}} />
    </>
  );
};

export default CustomAvatar;

const styles = StyleSheet.create({
  imgAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
