import {StyleSheet, Text} from 'react-native';
import React from 'react';

interface CustomTitleProps {
  title?: string;
}

const CustomTitle: React.FC<CustomTitleProps> = ({title}) => {
  return (
    <>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>{title}</Text>
    </>
  );
};

export default CustomTitle;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
