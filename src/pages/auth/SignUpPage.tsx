import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { CustomInput, CustomButton } from '@/components'
import { verifyEmail, verifyPassword, verifyConfirmPassword, colors, img, ImagesSvg, navigate, handleAsyncAction } from '@/utils';

import { useAppDispatch } from '@/redux/hooks.ts';
import { userRegisterAPI } from '@/redux/slices/auth/authThunk.ts';
import { saveSignUpForm } from '@/redux/slices/auth/signupSlice.ts';
import { useLoading } from '@/hooks/useLoading';

import AuthFooter from './component/AuthFooter.tsx';
import AuthHeader from './component/AuthHeader.tsx';

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const { LoadingShow, LoadingHide } = useLoading();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignUp = async () => {
    // Clear previous error
    setIsErrorMessage(false);
    setErrorMessage('');

    // Validate input
    const isValidUsername = username.trim().length >= 3;
    const isValidEmail = verifyEmail(email);
    const isValidPassword = verifyPassword(password);
    const isValidConfirmPassword = verifyConfirmPassword(
      password,
      confirmPassword,
    );

    setIsUsernameValid(isValidUsername);
    setIsEmailValid(isValidEmail);
    setIsPasswordValid(isValidPassword);
    setIsConfirmPasswordValid(isValidConfirmPassword);

    if (!isValidUsername || !isValidEmail || !isValidPassword || !isValidConfirmPassword) {
      return;
    }

    LoadingShow();
    await handleAsyncAction(
      async () => {
        // ✅ Lưu form data vào Redux
        dispatch(saveSignUpForm({ username, email, password }));

        // Gửi email xác thực
        const resultAction = await dispatch(
          userRegisterAPI({ email, password, username }),
        );
        if (!userRegisterAPI.fulfilled.match(resultAction)) {
          const errorMsg = (resultAction.payload as string) || 'Registration failed';
          throw new Error(errorMsg);
        }
        navigate('VerifyEmailScreen', { email });
      },
      {
        onSuccess: () => {
          LoadingHide();
        },
        onError: (error) => {
          LoadingHide();
          const errorMsg = error?.message || t('login_screen.login_register_error_toast');
          setErrorMessage(errorMsg);
          setIsErrorMessage(true);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title */}
            <AuthHeader img={img.Yummy} />

            {/* Content */}
            <View style={styles.body}>
              <CustomInput
                style={styles.input}
                value={username}
                placeholder={t('login_screen.login_username')}
                onChangeText={setUsername}
              />
              {!isUsernameValid && (
                <Text style={styles.errorMessage}>{t('login_screen.username_invalid') || 'Username phải có ít nhất 3 ký tự'}</Text>
              )}

              <CustomInput
                style={styles.input}
                value={email}
                placeholder={t('login_screen.login_email')}
                onChangeText={setEmail}
              />
              {!isEmailValid && (
                <Text style={styles.errorMessage}>{t('login_screen.email_invalid')}</Text>
              )}

              <CustomInput
                style={styles.input}
                value={password}
                placeholder={t('login_screen.login_pw')}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                showIcon={true}
                onPressIcon={handleShowPassword}
                iconXml={showPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
              />
              {!isPasswordValid && (
                <Text style={styles.errorMessage}>{t('login_screen.pw_invalid')}</Text>
              )}

              <CustomInput
                style={styles.input}
                value={confirmPassword}
                placeholder={t('login_screen.change_confirm_pw')}
                secureTextEntry={!showConfirmPassword}
                onChangeText={setConfirmPassword}
                showIcon={true}
                onPressIcon={handleShowConfirmPassword}
                iconXml={showConfirmPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
              />
              {!isConfirmPasswordValid && (
                <Text style={styles.errorMessage}>{t('login_screen.confirm_pw_invalid') || t('login_screen.pw_invalid')}</Text>
              )}

              {/* API Error Message */}
              {isErrorMessage && errorMessage !== '' && (
                <Text style={styles.apiErrorMessage}>{errorMessage}</Text>
              )}

              <CustomButton title={t('login_screen.login_register_btn')} onPress={handleSignUp} />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <AuthFooter
                content={t('login_screen.login_already_accounted')}
                navigateTo={t('login_screen.login_btn')}
                targetScreen="LoginScreen"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  body: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 6,
    paddingHorizontal: 16,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  errorMessage: {
    color: colors.danger,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  apiErrorMessage: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  input: {
    height: 52,
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    margin: 12,
  },
});

export default SignupPage;
