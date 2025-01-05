import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import colors from '../../utils/color';

interface GreetingProps {
  iconName: string;
  title?: string;
}

const Greeting: React.FC<GreetingProps> = ({iconName, title}) => {
  return (
    <View style={styles.container}>
      <FontAwesomeIcon name={iconName} size={18} color={colors.dark} />
      <Text>{title}</Text>
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
});
