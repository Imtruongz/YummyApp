import {StyleSheet, View, Text} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../components/CustomInput.tsx';
import { ImagesSvg } from '../utils/ImageSvg';
import {changePasswordAPI} from '../redux/slices/auth/authThunk';
import {useAppDispatch} from '../redux/hooks';
import CustomButton from '../components/CustomButton.tsx';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {MMKV} from 'react-native-mmkv';
import colors from '../utils/color';
import HomeHeader from '../components/HomeHeader';

import {verifyPassword, verifyConfirmPassword} from '../utils/validate';
import Toast from 'react-native-toast-message';
import {RootStackParamList} from '../../android/types/StackNavType.ts';
import {useTranslation} from 'react-i18next';

const storage = new MMKV();

const userId = storage.getString('userId') || '';

interface ChangePasswordPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ChangePasswordPage'> {}

const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({
  navigation,
}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChangePassword = async () => {
    const isValidPassword = verifyPassword(newPassword);
    const isValidConfirmPassword = verifyConfirmPassword(
      newPassword,
      confirmPassword,
    );

    setIsOldPasswordValid(isValidPassword);
    setIsNewPasswordValid(isValidPassword);
    setIsConfirmPasswordValid(isValidConfirmPassword);

    if (!isValidPassword || !isValidConfirmPassword) {
      return;
    }

    try {
      const payload = {
        userId: userId,
        oldPassword: oldPassword,
        newPassword: newPassword,
      };

      await dispatch(changePasswordAPI(payload)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password successfully changed!',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      logout();
    } catch (error: any) {
      console.log('Error', error.message || 'Failed to change password.');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to change password.',
      });
    }
  };

  const logout = async () => {
    try {
      storage.delete('accessToken');
      console.log('Access Token removed', storage.getString('accessToken'));
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      });
    } catch (exception) {
      console.log('Error clearing accessToken', exception);
    }
  };

  return (
    <View style={styles.container}>
      <HomeHeader 
        mode="back" 
        title={t('change_pw_header')} 
        showGoBack={true}
        showNotification={false}
      />
      <View style={styles.body}>
        <CustomInput
          placeholder={t('change_old_pw')}
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!showOldPassword}
          showIcon={true}
          onPressIcon={handleShowOldPassword}
           iconXml={showOldPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
        />
        {!isOldPasswordValid && (
          <Text style={{color: 'red', fontSize: 12}}>
            Password must be at least 6 characters.
          </Text>
        )}
        <CustomInput
          placeholder={t('change_new_pw')}
          value={newPassword}
          secureTextEntry={!showNewPassword}
          showIcon={true}
          onChangeText={setNewPassword}
          onPressIcon={handleShowNewPassword}
          iconXml={showNewPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
        />
        {!isNewPasswordValid && (
          <Text style={{color: 'red', fontSize: 12}}>Password invalid</Text>
        )}
        <CustomInput
          placeholder={t('change_confirm_pw')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          showIcon={true}
          onPressIcon={handleShowConfirmPassword}
          iconXml={showConfirmPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
        />
        {!isConfirmPasswordValid && (
          <Text style={{color: 'red', fontSize: 12}}>
            Confirmation password invalid
          </Text>
        )}
        <CustomButton title={t('change_pw_btn')} onPress={handleChangePassword} />
      </View>
    </View>
  );
};

export default ChangePasswordPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  body: {
    paddingHorizontal: 12,
    paddingVertical: 24,
    gap: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
