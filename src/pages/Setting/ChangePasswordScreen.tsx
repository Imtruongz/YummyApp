import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { CustomButton, HomeHeader, CustomInput, SettingHeaderCard, SettingFormCard, SettingFormGroup, SettingInfoCard, SettingDivider } from '@/components'
import { colors, ImagesSvg, verifyPassword, verifyConfirmPassword, handleAsyncAction, resetTo, getStorageString, deleteStorageKey, showToast, goBack } from '@/utils'
import { useLoading } from '@/hooks/useLoading';

import { changePasswordAPI } from '@/redux/slices/auth/authThunk';
import { useAppDispatch } from '@/redux/hooks';

const userId = getStorageString('userId') || '';

const ChangePasswordScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { LoadingShow, LoadingHide } = useLoading();
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

    LoadingShow();
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
        LoadingHide();
        goBack();
      },
      {
        onSuccess: () => {
          showToast.success(t('success'), t('settings_screen.change_pw_success'));
          LoadingHide();
        },
        onError: () => {
          showToast.error(t('error'), t('settings_screen.change_pw_error'));
          LoadingHide();
        }
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
        title={t('change_pw_screen.change_pw_header')}
        showGoBack={true}
        showNotification={false}
        isBackHome={true}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <SettingHeaderCard
          icon={ImagesSvg.icLockAccount}
          title={t('change_pw_screen.change_pw_header')}
          subtitle={t('change_pw_screen.change_pw_description')}
          iconSize={24}
        />

        {/* Form Card */}
        <SettingFormCard>
          {/* Old Password */}
          <SettingFormGroup
            label={t('change_pw_screen.change_old_pw')}
            error={!isOldPasswordValid ? t('login_screen.pw_invalid') : undefined}
          >
            <CustomInput
              style={[styles.input, !isOldPasswordValid && styles.inputError]}
              placeholder={t('change_pw_screen.change_old_pw')}
              value={oldPassword}
              onChangeText={(text) => {
                setOldPassword(text);
                setIsOldPasswordValid(true);
              }}
              secureTextEntry={!showOldPassword}
              showIcon={true}
              onPressIcon={handleShowOldPassword}
              iconXml={showOldPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
            />
          </SettingFormGroup>

          <SettingDivider />

          {/* New Password */}
          <SettingFormGroup
            label={t('change_pw_screen.change_new_pw')}
            error={!isNewPasswordValid ? t('login_screen.pw_not_match') : undefined}
            helper={t('change_pw_screen.pw_requirement')}
          >
            <CustomInput
              style={[styles.input, !isNewPasswordValid && styles.inputError]}
              placeholder={t('change_pw_screen.change_new_pw')}
              value={newPassword}
              secureTextEntry={!showNewPassword}
              showIcon={true}
              onChangeText={(text) => {
                setNewPassword(text);
                setIsNewPasswordValid(true);
              }}
              onPressIcon={handleShowNewPassword}
              iconXml={showNewPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
            />
          </SettingFormGroup>

          <SettingDivider />

          {/* Confirm Password */}
          <SettingFormGroup
            label={t('change_pw_screen.change_confirm_pw')}
            error={!isConfirmPasswordValid ? t('login_screen.pw_confirm_not_match') : undefined}
          >
            <CustomInput
              style={[styles.input, !isConfirmPasswordValid && styles.inputError]}
              placeholder={t('change_pw_screen.change_confirm_pw')}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setIsConfirmPasswordValid(true);
              }}
              secureTextEntry={!showConfirmPassword}
              showIcon={true}
              onPressIcon={handleShowConfirmPassword}
              iconXml={showConfirmPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
            />
          </SettingFormGroup>
        </SettingFormCard>

        {/* Security Tips */}
        <SettingInfoCard
          title={`💡 ${t('change_pw_screen.security_tips')}`}
          items={[
            t('change_pw_screen.pw_tip_1'),
            t('change_pw_screen.pw_tip_2'),
            t('change_pw_screen.pw_tip_3'),
            t('change_pw_screen.pw_tip_4'),
          ]}
        />

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Sticky Button */}
      <View style={styles.buttonContainer}>
        <CustomButton
          style={styles.button}
          title={t('change_pw_screen.change_pw_btn')}
          onPress={handleChangePassword}
        />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  input: {
    height: 50,
    backgroundColor: colors.InputBg,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderWidth: 2,
    borderColor: colors.danger,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 26,
    backgroundColor: 'transparent',
  },
  button: {
    height: 52,
  },
});
