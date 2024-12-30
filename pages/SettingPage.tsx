import {StyleSheet, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import CustomTitle from '../components/customize/Title';
import color from '../utils/color';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import SettingButton from '../components/customize/SettingButton';
import colors from '../utils/color';

interface SettingPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SettingPage'> {}
const SettingPage: React.FC<SettingPageProps> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesignIcon
          name="arrowleft"
          size={24}
          color={color.dark}
          style={styles.icon}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <CustomTitle style={styles.title1} title="Settings" />
      </View>
      <View style={styles.body}>
        <View style={styles.accountContainer}>
          <CustomTitle style={styles.title} title="Account" />
          <SettingButton
            title="Profile Setting"
            navigation={navigation}
            targetScreen="SettingProfilePage"
          />
          <SettingButton
            title="Password Setting"
            navigation={navigation}
            targetScreen="changePasswordPage"
          />
        </View>
        <View style={styles.SystemContainer}>
          <CustomTitle style={styles.title} title="System" />
          <SettingButton
            style={{color: colors.danger}}
            title="Log Out"
            navigation={navigation}
            targetScreen="LoginPage"
          />
        </View>
      </View>
    </View>
  );
};

export default SettingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: color.secondary,
  },
  title1: {
    color: color.dark,
    fontSize: 24,
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    borderBottomColor: color.dark,
    borderBottomWidth: 1,
    width: '100%',
    fontFamily: 'Roboto',
  },
  body: {
    padding: 12,
    gap: 14,
    justifyContent: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  accountContainer: {
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  SystemContainer: {
    marginBottom: 10,
  },
  icon: {
    padding: 12,
    paddingHorizontal: 14,
    marginRight: 84,
  },
});
