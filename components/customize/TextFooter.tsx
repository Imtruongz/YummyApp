import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

interface TextFooterProps {
  content: string;
  navigateTo: string;
  navigation: any;
  targetScreen?: string;
}

const TextFooter: React.FC<TextFooterProps> = ({content, navigation, navigateTo, targetScreen}) => {
  return (
    <View style={styles.blockFooter}>
      <Text style={styles.textFooter}>{content}</Text>
      <TouchableOpacity onPress={() => navigation.navigate(targetScreen)}>
        <Text style={styles.signUpText}>{navigateTo}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TextFooter;

const styles = StyleSheet.create({
  signUpText: {
    color: 'orange',
    fontWeight: 'bold',
  },
  blockFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  textFooter: {
    color: 'black',
  },
});
