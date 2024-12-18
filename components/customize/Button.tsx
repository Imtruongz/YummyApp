import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

interface CustomButtonProps {
  title?: string;
  onPress: () => void;
  style?: object;
}

const customButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.customBtnStyle, style]}>
      <Text style={styles.customBtnTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customBtnStyle: {
    width: '80%',
    height: 40,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  customBtnTextStyle: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default customButton;
