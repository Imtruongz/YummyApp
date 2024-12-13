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
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  placeholder,
  secureTextEntry = false,
  onChangeText,
  showIcon = false,
  onPressIcon,
  iconName = 'eye',
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={placeholder}
      />
      {showIcon && (
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
    width: '80%',
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  icon: {
    padding: 10,
  },
});
