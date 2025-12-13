import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import IconSvg from './IconSvg';
import { TouchableOpacity } from 'react-native';
import {colors} from '@/utils';

interface CustomInputProps {
  value?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  showIcon?: boolean;
  onPressIcon?: () => void;
  iconXml?: string;
  iconOnLeft?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: object;
  isDisabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  placeholder,
  secureTextEntry = false,
  onChangeText,
  showIcon = false,
  onPressIcon,
  iconXml,
  iconOnLeft = false,
  multiline = false,
  numberOfLines = 1,
  style,
  isDisabled = true,
}) => {
  return (
    <View style={[styles.container, style]}>
      {iconOnLeft && showIcon && iconXml && (
        <TouchableOpacity onPress={onPressIcon} style={{marginRight: 6}}>
          <IconSvg
            xml={iconXml}
            width={24}
            height={24}
            color={colors.dark}
          />
        </TouchableOpacity>
      )}
      <TextInput
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={'#888'}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={isDisabled}
      />
      {!iconOnLeft && showIcon && iconXml && (
        <TouchableOpacity onPress={onPressIcon}>
          <IconSvg
            xml={iconXml}
            width={24}
            height={24}
            color={colors.dark}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export { CustomInput };
export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.gray,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.dark,
  },
});
