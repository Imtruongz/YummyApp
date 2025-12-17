import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { CustomInput, CustomButton } from '@/components'
import { verifyEmail, verifyPassword, verifyConfirmPassword, colors, img, ImagesSvg, handleAsyncAction, navigate} from '@/utils';

import {useAppDispatch} from '@/redux/hooks.ts';
import {userRegisterAPI} from '@/redux/slices/auth/authThunk.ts';
import { saveSignUpForm } from '@/redux/slices/auth/signupSlice.ts';

import AuthFooter from './component/AuthFooter.tsx';
import AuthHeader from './component/AuthHeader.tsx';

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
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
    const isValidEmail = verifyEmail(email);
    const isValidPassword = verifyPassword(password);
    const isValidConfirmPassword = verifyConfirmPassword(
      password,
      confirmPassword,
    );

    setIsEmailValid(isValidEmail);
    setIsPasswordValid(isValidPassword);
    setIsConfirmPasswordValid(isValidConfirmPassword);

    if (!isValidEmail || !isValidPassword || !isValidConfirmPassword) {
      return;
    }

    await handleAsyncAction(
      async () => {
        // ✅ Lưu form data vào Redux (chưa gửi server tạo user)
        dispatch(saveSignUpForm({ username, email, password }));

        // Gửi email xác thực (backend chỉ gửi email, không lưu user)
        const resultAction = await dispatch(
          userRegisterAPI({email, password, username}),
        );
        if (!userRegisterAPI.fulfilled.match(resultAction)) {
          throw new Error('Registration failed');
        }
      },
      {
        successMessage: t('login_screen.login_register_success_toast'),
        errorMessage: t('login_screen.login_register_error_toast'),
        onSuccess: () => navigate('VerifyEmailScreen', { email })
      }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
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
          <CustomInput
            style={styles.input}
            value={email}
            placeholder={t('login_screen.login_email')}
            onChangeText={setEmail}
          />
          {!isEmailValid ? (
            <Text style={styles.errorMessage}>{t('login_screen.email_invalid')}</Text>
          ) : null}
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
          {isPasswordValid ? null : (
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

          {isConfirmPasswordValid ? null : (
            <Text style={styles.errorMessage}>
              {t('login_screen.pw_invalid')}
            </Text>
          )}
          {
            // Error message
            isErrorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null
          }
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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  body: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
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
  },
  input: {
    height: 52,
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    margin: 12,
  },
});

export default SignupPage;
