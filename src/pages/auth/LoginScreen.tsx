import React, { useState, useContext } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View, TouchableOpacity, Image, ScrollView, } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Settings, LoginManager, Profile } from 'react-native-fbsdk-next'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../android/types/StackNavType';
import SelectDropdown from 'react-native-select-dropdown';

import { CustomInput, CustomButton } from '@/components'
import { colors, ImagesSvg, FacebookIcon, URLS, verifyEmail, verifyPassword, handleAsyncAction, setStorageString } from '@/utils';
import { changeLanguage } from '@/languages/i18n';
import IconSvg from '@/components/IconSvg';

import { useAppDispatch } from '@/redux/hooks';
import { userLoginAPI, facebookLoginAPI } from '@/redux/slices/auth/authThunk';

import { AuthContext } from '@/contexts/AuthContext';
import { useLoading } from '@/hooks/useLoading';
import AuthFooter from './component/AuthFooter';
import AuthHeader from './component/AuthHeader';

const fbAppId = '1178286763959143'
Settings.setAppID(fbAppId)

interface LoginScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'LoginScreen'> { }

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { LoadingShow, LoadingHide } = useLoading();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useContext(AuthContext);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'vn', label: 'Tiếng Việt' },
    { code: 'zh', label: '中文' },
  ];

  const handleChangeLanguage = async (selectedItem: any) => {
    await changeLanguage(selectedItem.code);
  };

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

    LoadingShow();
    try {
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

      signIn();
    } catch (error: any) {
      const errorMsg = error?.message || t('login_screen.login_error_toast');
      setErrorMessage(errorMsg);
      setIsErrorMessage(true);
    } finally {
      LoadingHide();
    }
  };

  const handleLoginWithFacebook = async () => {
    
    try {
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
      LoadingShow();
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

      signIn();
    } catch (error: any) {
      const errorMsg = error?.message || t('login_screen.login_error_toast');
      setErrorMessage(errorMsg);
      setIsErrorMessage(true);
    } finally {
      LoadingHide();
    }
  };

  return (
    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Language Selector */}
        <View style={styles.languageSelectorContainer}>
          <SelectDropdown
            data={languages}
            onSelect={handleChangeLanguage}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.label) || 'English'} 🌐
                  </Text>
                  <IconSvg
                    xml={isOpened ? ImagesSvg.iconArrowDown : ImagesSvg.iconArrowRight}
                    width={14}
                    height={14}
                    color={'white'}
                  />
                </View>
              );
            }}
            renderItem={(item, isSelected) => {
              return (
                <View style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: colors.primary + '20' }),
                }}>
                  <Text style={[styles.dropdownItemTxtStyle, {
                    color: isSelected ? colors.primary : colors.dark,
                    fontWeight: isSelected ? '600' : '400',
                  }]}>
                    {item.label}
                  </Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        </View>

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
  languageSelectorContainer: {
    paddingHorizontal: 20,
    paddingTop: 56,
    alignItems: 'flex-end',
  },
  dropdownButtonStyle: {
    width: 130,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    marginTop: -10,
  },
  dropdownItemStyle: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemTxtStyle: {
    fontSize: 13,
    fontWeight: '400',
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
