import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { CustomButton, HomeHeader, CustomInput } from '@/components'
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
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>🔐 {t('change_pw_screen.change_pw_header')}</Text>
          <Text style={styles.headerSubtitle}>{t('change_pw_screen.change_pw_description')}</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Old Password */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('change_pw_screen.change_old_pw')}</Text>
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
            {!isOldPasswordValid && (
              <Text style={styles.errorText}>
                {t('login_screen.pw_invalid')}
              </Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* New Password */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('change_pw_screen.change_new_pw')}</Text>
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
            {!isNewPasswordValid && (
              <Text style={styles.errorText}>{t('login_screen.pw_not_match')}</Text>
            )}
            <Text style={styles.helperText}>{t('change_pw_screen.pw_requirement')}</Text>
          </View>

          <View style={styles.divider} />

          {/* Confirm Password */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('change_pw_screen.change_confirm_pw')}</Text>
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
            {!isConfirmPasswordValid && (
              <Text style={styles.errorText}>
                {t('login_screen.pw_confirm_not_match')}
              </Text>
            )}
          </View>
        </View>

        {/* Security Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 {t('change_pw_screen.security_tips')}</Text>
          <Text style={styles.tipItem}>✓ {t('change_pw_screen.pw_tip_1')}</Text>
          <Text style={styles.tipItem}>✓ {t('change_pw_screen.pw_tip_2')}</Text>
          <Text style={styles.tipItem}>✓ {t('change_pw_screen.pw_tip_3')}</Text>
          <Text style={styles.tipItem}>✓ {t('change_pw_screen.pw_tip_4')}</Text>
        </View>

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
  headerCard: {
    backgroundColor: colors.primary + '15',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.smallText,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.light,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 10,
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
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 8,
    fontWeight: '500',
  },
  helperText: {
    color: colors.smallText,
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  tipsCard: {
    backgroundColor: '#fffbf0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 13,
    color: colors.smallText,
    marginBottom: 8,
    lineHeight: 18,
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
