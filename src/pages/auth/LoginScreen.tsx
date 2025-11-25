import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState, useContext } from 'react';

//Customm components
import CustomButton from '../../components/customize/CustomButton';
import CustomInput from '../../components/customize/CustomInput';
import AuthFooter from './component/AuthFooter';
import AuthHeader from './component/AuthHeader';

import color from '../../utils/color';
import { URLS, FacebookIcon } from '../../utils/assets';
import { verifyEmail, verifyPassword } from '../../utils/validate';
import { useAppDispatch } from '../../redux/hooks';
import { userLoginAPI, facebookLoginAPI } from '../../redux/slices/auth/authThunk';
import { Settings, LoginManager, Profile } from 'react-native-fbsdk-next'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../android/types/StackNavType';

import { MMKV } from 'react-native-mmkv';
import messaging from '@react-native-firebase/messaging';
import { updateFcmTokenApi } from '../../api/updateFcmTokenApi';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ImagesSvg } from '../../utils/ImageSvg';

const storage = new MMKV();
const fbAppId = '1178286763959143'
Settings.setAppID(fbAppId)

interface LoginScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'LoginScreen'> { }

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
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
    try {
      const resultAction = await dispatch(userLoginAPI({ email, password }));
      if (userLoginAPI.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        if (user) {
          storage.set('userId', String(user.user.userId || ''));
          storage.set('accessToken', user.accessToken);
          storage.set('refreshToken', user.refreshToken);
          // Lấy FCM token và gửi lên server
          try {
            const fcmToken = await messaging().getToken();
            console.log('FCM Token lấy từ Firebase:', fcmToken);
            await updateFcmTokenApi(fcmToken, user.accessToken);
          } catch (err) {
            console.log('Gửi FCM token lên server thất bại:', err, user.accessToken);
          }
          signIn();
          
        } else {
          setIsErrorMessage(true);
          setErrorMessage('Email not verified, please check your email');
          console.log('Email not verified', user);
        }
      } else {
        setIsErrorMessage(true);
        setErrorMessage('Login failed, please try again');
        console.log('Login failed');
      }
    } catch (error) {
      setIsErrorMessage(true);
      setErrorMessage('An error occurred, please try again');
      console.log('An error occurred', error);
    }
  };

  const handleLoginWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile']);
      if (result.isCancelled) {
        console.log('Login cancelled');
      }
      else {
        const profile = await Profile.getCurrentProfile();
        if (profile) {
          const data = {
            userId: profile.userID || '',
            username: profile.name || 'Facebook User',
            email: profile.userID || '',
            avatar: profile.imageURL || '',
          }
          console.log('Login with Facebook success', data);
          const resultAction = await dispatch(facebookLoginAPI(data));
          if (facebookLoginAPI.fulfilled.match(resultAction)) {
            const user = resultAction.payload;
            if (user) {
              storage.set('userId', String(user.user.userId || ''));
              storage.set('accessToken', user.accessToken);
              storage.set('refreshToken', user.refreshToken);
              // Lấy FCM token và gửi lên server
              try {
                const fcmToken = await messaging().getToken();
                await updateFcmTokenApi(fcmToken, user.accessToken);
              } catch (err) {
                console.log('Gửi FCM token lên server thất bại:', err);
              }
              signIn();
            }
          } else {
            setIsErrorMessage(true);
            setErrorMessage('Login with Facebook failed, please try again');
          }
        }
      }
    } catch (error) {
      setIsErrorMessage(true);
      setErrorMessage('An error occurred, please try again');
      console.log('Login with Facebook error', error);
    }
  };

  return (
    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Title */}
        <AuthHeader img={URLS.Yummy} />
        {/* Content */}
        <View style={styles.body}>
          <CustomInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('login_email')}
          />
          {!isEmailValid ? (
            <Text style={styles.errorMessage}>{t('email_invalid')}</Text>
          ) : null}
          <CustomInput
            value={password}
            placeholder={t('login_pw')}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            showIcon={true}
            onPressIcon={handleShowPassword}
            iconXml={showPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
          />
          {isPasswordValid ? null : (
            <Text style={styles.errorMessage}>{t('pw_invalid')}</Text>
          )}
          {isErrorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          <CustomButton title={t('login_btn')} onPress={handleLoginWithEmail} fontSize={16} />

          {/* Nút đăng nhập bằng Google */}
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>{t('login_or')}</Text>
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
            <Text style={styles.googleButtonText}>{t('login_with_facebook')}</Text>
          </TouchableOpacity>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <AuthFooter
            content={t('login_register')}
            navigateTo={t('login_register_btn')}
            navigation={navigation}
            targetScreen="SignUpPage"
          />
          <AuthFooter
            navigateTo={t('login_forgot_pw')}
            navigation={navigation}
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
    backgroundColor: color.light,
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
    color: color.danger,
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
});

export default LoginScreen;
