import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../utils/color';
import IconSvg from './IconSvg';

interface GreetingProps {
  iconName: string;
  title?: string;
}

const Greeting: React.FC<GreetingProps> = ({iconName, title}) => {
  return (
    <View style={styles.container}>
      <IconSvg xml={iconName} width={16} height={16} color={colors.dark} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default Greeting;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    color: colors.dark,
    fontSize: 14,
  },
});
