import React, { useState, useContext } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View, TouchableOpacity, Image, ScrollView, } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Settings, LoginManager, Profile } from 'react-native-fbsdk-next'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../android/types/StackNavType';

import { CustomInput, CustomButton } from '@/components'
import { colors, ImagesSvg, FacebookIcon, URLS, verifyEmail, verifyPassword, handleAsyncAction, setStorageString } from '@/utils';
import { getFCMTokenAndUpdate } from '@/utils/fcmHelper';

import { useAppDispatch } from '@/redux/hooks';
import { userLoginAPI, facebookLoginAPI } from '@/redux/slices/auth/authThunk';

import { AuthContext } from '@/contexts/AuthContext';
import AuthFooter from './component/AuthFooter';
import AuthHeader from './component/AuthHeader';

const fbAppId = '1178286763959143'
Settings.setAppID(fbAppId)

interface LoginScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'LoginScreen'> { }

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginWithEmail = async () => {
    const isValidEmail = verifyEmail(email);
    const isValidPassword = verifyPassword(password);

    setIsEmailValid(isValidEmail);
    setIsPasswordValid(isValidPassword);

    if (!isValidEmail || !isValidPassword) {
      return;
    }

    await handleAsyncAction(
      async () => {
        const resultAction = await dispatch(userLoginAPI({ email, password }));
        if (!userLoginAPI.fulfilled.match(resultAction)) {
          throw new Error('Login failed');
        }
        const user = resultAction.payload;
        if (!user) {
          throw new Error('Email not verified, please check your email');
        }
        setStorageString('userId', String(user.user.userId || ''));
        setStorageString('accessToken', user.accessToken);
        setStorageString('refreshToken', user.refreshToken);

        // Lấy FCM token
        await getFCMTokenAndUpdate(user.accessToken);
      },
      {
        successMessage: t('login_screen.login_success_toast'),
        errorMessage: t('login_screen.login_error_toast'),
        onSuccess: () => signIn()
      }
    );
  };

  const handleLoginWithFacebook = async () => {
    await handleAsyncAction(
      async () => {
        const result = await LoginManager.logInWithPermissions(['public_profile']);
        if (result.isCancelled) {
          throw new Error('Login cancelled');
        }

        const profile = await Profile.getCurrentProfile();
        if (!profile) {
          throw new Error('Failed to get profile');
        }

        const data = {
          userId: profile.userID || '',
          username: profile.name || 'Facebook User',
          email: profile.userID || '',
          avatar: profile.imageURL || '',
        }
        console.log('Login with Facebook success', data);
        const resultAction = await dispatch(facebookLoginAPI(data));

        if (!facebookLoginAPI.fulfilled.match(resultAction)) {
          throw new Error('Facebook login failed');
        }

        const user = resultAction.payload;
        if (!user) {
          throw new Error('Failed to get user data');
        }

        setStorageString('userId', String(user.user.userId || ''));
        setStorageString('accessToken', user.accessToken);
        setStorageString('refreshToken', user.refreshToken);

        // Lấy FCM token
        await getFCMTokenAndUpdate(user.accessToken);
      },
      {
        successMessage: t('login_screen.login_success_toast'),
        errorMessage: t('login_screen.login_error_toast'),
        onSuccess: () => signIn()
      }
    );
  };

  return (
    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Title */}
        <AuthHeader img={URLS.Yummy} />
        {/* Content */}
        <View style={styles.body}>
          <CustomInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={t('login_screen.login_email')}
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
          {isErrorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          <CustomButton title={t('login_screen.login_btn')} onPress={handleLoginWithEmail} fontSize={16} />

          {/* Nút đăng nhập bằng Google */}
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>{t('login_screen.login_or')}</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleLoginWithFacebook}
          >
            <Image
              source={FacebookIcon}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>{t('login_screen.login_with_facebook')}</Text>
          </TouchableOpacity>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <AuthFooter
            content={t('login_screen.login_register')}
            navigateTo={t('login_screen.login_register_btn')}
            targetScreen="SignUpPage"
          />
          <AuthFooter
            navigateTo={t('login_screen.login_forgot_pw')}
            targetScreen="ForgotPasswordPage"
          />
        </View>
      </ScrollView>
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
    gap: 14,
  },
  footer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: colors.danger,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    paddingHorizontal: 10,
    color: '#757575',
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '80%',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 52,
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    margin: 12,
  },
});

export default LoginScreen;
