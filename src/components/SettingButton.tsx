import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {ImagesSvg} from '@/utils';
import {IconSvg} from '@/components';

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
      // Nếu là SettingProfileScreen hoặc ChangePasswordScreen thì navigate qua SettingNavigator
      if (targetScreen === 'SettingProfileScreen' || targetScreen === 'ChangePasswordScreen') {
        navigation.navigate('SettingNavigator', { screen: targetScreen });
      } else {
        navigation.navigate(targetScreen);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.accountSetting, style]}
      onPress={onPress || defaultOnPress}
    >
      <Text style={[styles.text, style]}>{title}</Text>
      <IconSvg xml={ImagesSvg.iconArrowRight} width={16} height={16} color='black' />
    </TouchableOpacity>
  );
};

export { SettingButton };
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
    fontSize: 16,
  },
});
