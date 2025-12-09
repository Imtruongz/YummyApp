import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {RootStackParamList} from '../../../android/types/StackNavType.ts';

import { CustomInput, CustomButton } from '@/components'
import { verifyEmail, verifyPassword, verifyConfirmPassword, colors, img, ImagesSvg, showToast, handleAsyncAction} from '@/utils';

import {useAppDispatch} from '@/redux/hooks.ts';
import {userRegisterAPI} from '@/redux/slices/auth/authThunk.ts';

import AuthFooter from './component/AuthFooter.tsx';
import AuthHeader from './component/AuthHeader.tsx';

interface SignUpPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SignUpPage'> {}
const SignupPage: React.FC<SignUpPageProps> = ({navigation}) => {
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
        const resultAction = await dispatch(
          userRegisterAPI({email, password, username}),
        );
        if (!userRegisterAPI.fulfilled.match(resultAction)) {
          throw new Error('Registration failed');
        }
      },
      {
        successMessage: 'Sign up successfully',
        errorMessage: 'An error occurred during registration',
        onSuccess: () => navigation.navigate('LoginScreen')
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
            value={username}
            placeholder={t('login_screen.login_username')}
            onChangeText={setUsername}
          />
          <CustomInput
            value={email}
            placeholder={t('login_screen.login_email')}
            onChangeText={setEmail}
          />
          {!isEmailValid ? (
            <Text style={styles.errorMessage}>{t('login_screen.email_invalid')}</Text>
          ) : null}
          <CustomInput
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
            navigation={navigation}
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
});

export default SignupPage;
