import {StyleSheet, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';
import {colors} from '@/utils';
import { IconSvg } from '@/components'

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
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
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
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, style]}
      disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <>
          {isText && (
            <Text
              style={[styles.text, fontSize ? { fontSize } : {}, { color: isCancel ? colors.dark : styles.text.color }]}
            >
              {title}
            </Text>
          )}
          {isIcon && <IconSvg xml={icon} width={iconSize} height={iconSize} />}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '80%',
    height: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export { CustomButton };
export default CustomButton;
