import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

interface TextFooterProps {
  content?: string;
  navigateTo: string;
  navigation: any;
  targetScreen?: string;
}

const TextFooter: React.FC<TextFooterProps> = ({content, navigation, navigateTo, targetScreen}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{content}</Text>
      <TouchableOpacity onPress={() => navigation.navigate(targetScreen)}>
        <Text style={styles.textNavigate}>{navigateTo}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TextFooter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  textNavigate: {
    color: 'orange',
    fontWeight: 'bold',
  },
  text: {
    color: 'black',
  },
});
