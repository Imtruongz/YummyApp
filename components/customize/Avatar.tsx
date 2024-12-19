import {Image, StyleSheet} from 'react-native';
import React from 'react';

interface CustomAvatarProps {
  img: string;
  style?: object;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({img, style}) => {
  return (
    <>
      <Image style={[styles.imgAvatar, style]} source={{uri: img}} />
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
    borderColor: 'orange',
  },
});
