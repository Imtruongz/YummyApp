import {StyleSheet, View} from 'react-native';
import React from 'react';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import color from '../../utils/color';
import CustomTitle from './Title';
import {useNavigation} from '@react-navigation/native';

interface CustomHeaderProps {
  title: string;
  iconName: string;
}
const Header: React.FC<CustomHeaderProps> = ({title, iconName}) => {
  const navigation = useNavigation();
  return (
      <View style={styles.header}>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.secondary,
  },
  icon: {
    position: 'absolute',
    left: 14,
  },
  headerTitle: {
    color: color.dark,
    fontSize: 22,
    textAlign: 'center',
    padding: 8,
  },
});
