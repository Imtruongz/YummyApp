import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
const MaterialIcons = require('react-native-vector-icons/MaterialIcons').default;
import colors from '../utils/color';

type NoDataProps = {
  message?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  textSize?: number;
};

const NoData: React.FC<NoDataProps> = ({
  message = 'No Data',
  width = 160,
  height = 160,
  borderRadius = 80,
  textSize = 24,
}) => {
  // Định nghĩa style của khối hình tròn
  const circleStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius,
    width,
    height,
   
  };

  return (
    <View style={styles.container}>
      <View style={circleStyle}>
        <MaterialIcons name='no-food' size={120} color={colors.gray} />
      </View>

      <Text style={[styles.text, { fontSize: textSize, color: colors.dark }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 20,
    color: colors.dark,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default NoData;
