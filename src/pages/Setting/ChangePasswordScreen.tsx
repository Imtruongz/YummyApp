import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { CustomButton, HomeHeader, CustomInput } from '@/components'
import { colors, ImagesSvg, verifyPassword, verifyConfirmPassword, showToast, handleAsyncAction, resetTo, getStorageString, deleteStorageKey } from '@/utils'

import { changePasswordAPI } from '@/redux/slices/auth/authThunk';
import { useAppDispatch } from '@/redux/hooks';

const userId = getStorageString('userId') || '';

const ChangePasswordScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
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

    await handleAsyncAction(
      async () => {
        const payload = {
          userId: userId,
          oldPassword: oldPassword,
          newPassword: newPassword,
        };

        await dispatch(changePasswordAPI(payload)).unwrap();
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        logout();
      },
      {
        successMessage: 'Password successfully changed',
        errorMessage: 'Failed to change password'
      }
    );
  };

  const logout = async () => {
    try {
      deleteStorageKey('accessToken');
      console.log('Access Token removed', getStorageString('accessToken'));
      resetTo('LoginScreen');
    } catch (exception) {
      console.log('Error clearing accessToken', exception);
    }
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        mode="back"
        title={t('settings_screen.change_pw_header')}
        showGoBack={true}
        showNotification={false}
        isBackHome={true}
      />
      <View style={styles.body}>
        <CustomInput
          style={styles.input}
          placeholder={t('settings_screen.change_old_pw')}
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!showOldPassword}
          showIcon={true}
          onPressIcon={handleShowOldPassword}
          iconXml={showOldPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
        />
        {!isOldPasswordValid && (
          <Text style={{ color: 'red', fontSize: 12 }}>
            Password must be at least 6 characters.
          </Text>
        )}
        <CustomInput
          style={styles.input}
          placeholder={t('settings_screen.change_new_pw')}
          value={newPassword}
          secureTextEntry={!showNewPassword}
          showIcon={true}
          onChangeText={setNewPassword}
          onPressIcon={handleShowNewPassword}
          iconXml={showNewPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
        />
        {!isNewPasswordValid && (
          <Text style={{ color: 'red', fontSize: 12 }}>Password invalid</Text>
        )}
        <CustomInput
          style={styles.input}
          placeholder={t('settings_screen.change_confirm_pw')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          showIcon={true}
          onPressIcon={handleShowConfirmPassword}
          iconXml={showConfirmPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
        />
        {!isConfirmPasswordValid && (
          <Text style={{ color: 'red', fontSize: 12 }}>
            Confirmation password invalid
          </Text>
        )}
        <CustomButton style={styles.button} title={t('settings_screen.change_pw_btn')} onPress={handleChangePassword} />
      </View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  body: {
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 52,
    backgroundColor: colors.InputBg,
    paddingHorizontal: 12,
    margin: 12
  },
  button: {
    height: 52,
    marginTop: 24,
  },
});
