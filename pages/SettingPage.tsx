import {Alert, StyleSheet, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import CustomTitle from '../components/customize/Title';
import color from '../utils/color';
import SettingButton from '../components/customize/SettingButton';
import colors from '../utils/color';
import Header from '../components/customize/Header';

import {MMKV} from 'react-native-mmkv';
const storage = new MMKV();

interface SettingPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SettingPage'> {}
const SettingPage: React.FC<SettingPageProps> = ({navigation}) => {
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: logout},
      ],
      {cancelable: false},
    );
  };

  const logout = async () => {
    try {
      storage.delete('accessToken');
      console.log('Access Token removed', storage.getString('accessToken'));
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginPage'}],
      });
    } catch (exception) {
      console.error('Error clearing accessToken', exception);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" iconName="arrowleft" />
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
            style={{color: colors.success}}
            title="Log Out"
            onPress={handleLogout}
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
  accountContainer: {
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SystemContainer: {
    marginBottom: 10,
  },
});
