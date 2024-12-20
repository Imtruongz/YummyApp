import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

interface CustomInputProps {
  value?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  showIcon?: boolean;
  onPressIcon?: () => void;
  iconName?: string;
  iconOnLeft?: boolean; // Thêm prop mới tùy chỉnh vị trí icon
  multiline?: boolean; // Thêm thuộc tính multiline
  numberOfLines?: number; // Thêm thuộc tính numberOfLines
  style?: object;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  placeholder,
  secureTextEntry = false,
  onChangeText,
  showIcon = false,
  onPressIcon,
  iconName = 'eye',
  iconOnLeft = false, // Giá trị mặc định là false: icon ở bên phải
  multiline = false,
  numberOfLines = 1,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {iconOnLeft && showIcon && (
        <AntDesignIcon
          onPress={onPressIcon}
          name={iconName}
          size={24}
          style={styles.icon}
        />
      )}
      <TextInput
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {!iconOnLeft && showIcon && (
        <AntDesignIcon
          onPress={onPressIcon}
          name={iconName}
          size={24}
          style={styles.icon}
        />
      )}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'grey',
    width: '90%',
  },
  input: {
    flex: 1,
    padding: 10,
  },
  icon: {
    padding: 10,
  },
});
