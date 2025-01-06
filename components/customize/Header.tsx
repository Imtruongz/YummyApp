import {StyleSheet, View} from 'react-native';
import React from 'react';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import color from '../../utils/color';
import CustomTitle from './Title';
import {useNavigation} from '@react-navigation/native';

interface CustomHeaderProps {
  title: string;
  iconName: string;
  style?: object;
}
const Header: React.FC<CustomHeaderProps> = ({title, iconName, style}) => {
  const navigation = useNavigation();
  return (
      <View style={[styles.header, style]}>
        <AntDesignIcon
          name={iconName}
          size={24}
          color={color.dark}
          style={styles.icon}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <CustomTitle style={styles.headerTitle} title={title} />
      </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.light,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 10,
  },
  icon: {
    position: 'absolute',
    left: 14,
  },
  headerTitle: {
    color: color.dark,
    fontSize: 20,
    textAlign: 'center',
    padding: 8,
  },
});
