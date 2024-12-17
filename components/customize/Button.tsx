import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';

interface CustomButtonProps {
  title?: string;
  onPress: () => void;
  style?: object;
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
}

const customButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  iconName,
  iconColor,
  iconSize,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.customBtnStyle, style]}>
      <Text style={styles.customBtnTextStyle}>{title}</Text>
      {iconName && (
        <AntDesignIcon
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
      )}
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
  icon: {
    marginRight: 10, // Thêm một chút khoảng cách giữa icon và text
  },
});

export default customButton;
