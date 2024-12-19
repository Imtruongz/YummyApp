import {StyleSheet, Text} from 'react-native';
import React from 'react';

interface CustomTitleProps {
  title: string;
}

const CustomTitle: React.FC<CustomTitleProps> = ({title}) => {
  return (
    <>
      <Text style={styles.titleCustom}>{title}</Text>
    </>
  );
};

export default CustomTitle;

const styles = StyleSheet.create({
  titleCustom: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});