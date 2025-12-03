import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import color from '../utils/color';
import IconSvg from './IconSvg';

interface CustomButtonProps {
  title?: string;
  isText?: boolean;
  onPress?: () => void;
  style?: object;
  icon?: string;
  isIcon?: boolean;
  iconSize?: number;
  disabled?: boolean;
  fontSize?: number;
  isCancel?: boolean;
}

const customButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  isText = true,
  icon = '',
  isIcon = false,
  iconSize = 14,
  disabled = false,
  fontSize,
  isCancel = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, style]}
      disabled={disabled}>
      {isText && (
        <Text
          style={[styles.text, fontSize ? { fontSize } : {}, { color: isCancel ? color.dark : styles.text.color }]}
        >
          {title}
        </Text>
      )}
      {isIcon && <IconSvg xml={icon} width={iconSize} height={iconSize} />}
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
    color: color.white,
    fontWeight: 'bold',
  },
});

export { customButton };
export default customButton;
