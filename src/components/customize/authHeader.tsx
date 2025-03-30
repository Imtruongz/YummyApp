import {Image, StyleSheet, View} from 'react-native';
import React from 'react';

interface CustomAuthHeaderProps {
    style?: object;
    img: string;
}

const CustomAuthHeader: React.FC<CustomAuthHeaderProps> = ({img, style}) => {
  return (
    <View style={[styles.header, style]}>
      <Image style={[styles.imgStyle, style]} source={{uri: img}} />
    </View>
  );
};

export default CustomAuthHeader;

const styles = StyleSheet.create({
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  imgStyle: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
});
