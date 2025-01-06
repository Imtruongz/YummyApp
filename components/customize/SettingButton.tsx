import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

interface SettingButtonProps {
  navigation?: any;
  style?: object;
  targetScreen?: string;
  title?: string;
  onPress?: () => void;
}
const SettingButton: React.FC<SettingButtonProps> = ({
  navigation,
  targetScreen,
  title,
  style,
  onPress,
}) => {
  const defaultOnPress = () => {
    if (targetScreen) {
      navigation.navigate(targetScreen);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.accountSetting, style]}
      onPress={onPress || defaultOnPress}
    >
      <Text style={[styles.text, style]}>{title}</Text>
      <AntDesignIcon name="right" size={20} />
    </TouchableOpacity>
  );
};

export default SettingButton;

const styles = StyleSheet.create({
  accountSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 14,
  },
});
