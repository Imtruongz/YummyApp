import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import color from '../../utils/color'


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
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '80%',
    height: 40,
    backgroundColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    color: color.light,
    fontWeight: 'bold',
  },
});

export default customButton;
