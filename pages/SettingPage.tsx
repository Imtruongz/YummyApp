import {Alert, StyleSheet, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import CustomTitle from '../components/customize/Title';
import SettingButton from '../components/customize/SettingButton';
import colors from '../utils/color';
import Header from '../components/customize/Header';
import { LoginManager } from 'react-native-fbsdk-next';

import {MMKV} from 'react-native-mmkv';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      // Đăng xuất Facebook
      LoginManager.logOut();
      
      // Xóa token và thông tin người dùng
      storage.delete('accessToken');
      storage.delete('refreshToken')
      storage.delete('userId');
      
      // Chuyển về màn hình đăng nhập
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginPage'}],
      });
    } catch (exception) {
      console.error('Error during logout:', exception);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" iconName="arrowleft" />
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
          targetScreen="ChangePasswordPage"
        />
      </View>
      <View style={styles.accountContainer}>
        <CustomTitle style={styles.title} title="System" />
        <SettingButton
          style={styles.button}
          title="Log Out"
          onPress={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};

export default SettingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  title: {
    borderBottomColor: colors.InputBg,
    borderBottomWidth: 1,
    width: '100%',
  },
  button: {
    color: colors.danger,
  },
  accountContainer: {
    marginVertical: 18,
    marginHorizontal: 12,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
