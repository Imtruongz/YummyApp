import {StyleSheet, Text} from 'react-native';
import React from 'react';
import colors from '../../utils/color';

interface CustomTitleProps {
  title?: string;
  style?: object;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

const CustomTitle: React.FC<CustomTitleProps> = ({
  title,
  style,
  ellipsizeMode,
  numberOfLines,
}) => {
  return (
    <>
      <Text
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        style={[styles.text, style]}>
        {title}
      </Text>
    </>
  );
};

export default CustomTitle;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: colors.primaryText,
    fontWeight: '700'
  },
});
