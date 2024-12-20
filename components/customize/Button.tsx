import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import color from '../../utils/color';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';

interface CustomButtonProps {
  title?: string;
  isText?: boolean;
  onPress?: () => void;
  style?: object;
  icon?: string;
  isIcon?: boolean;
  iconSize?: number;
}

const customButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  isText = true,
  icon = '',
  isIcon = false,
  iconSize = 14,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]}>
      {isText && <Text style={styles.text}>{title}</Text>}
      {isIcon && <AntDesignIcon name={icon} size={iconSize} />}
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
