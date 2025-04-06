import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
import { SafeAreaView } from 'react-native-safe-area-context';

//Customm components
import CustomButton from '../components/customize/Button';
import CustomInput from '../components/customize/Input';
import CustomTextFooter from '../components/customize/TextFooter';
import CustomAuthHeader from '../components/customize/authHeader';

import color from '../utils/color';
import img from '../utils/urlImg';
import { verifyEmail, verifyPassword } from '../utils/validate';
import { useAppDispatch } from '../redux/hooks';
import { userLoginAPI, facebookLoginAPI } from '../redux/slices/auth/authThunk';

import { Settings, LoginManager, Profile } from 'react-native-fbsdk-next'
import crashlytics from '@react-native-firebase/crashlytics';
import { logError, setCrashlyticsEnabled, logUserAction, forceFlushReports } from '../utils/crashlytics';

const fbAppId = '1178286763959143'
Settings.setAppID(fbAppId)

import { MMKV } from 'react-native-mmkv';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const storage = new MMKV();

interface LoginPageProps
  extends NativeStackScreenProps<RootStackParamList, 'LoginPage'> { }

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {
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

  console.log('render_login page')

  const handleLoginWithEmail = async () => {
    const isValidEmail = verifyEmail(email);
    const isValidPassword = verifyPassword(password);

    setIsEmailValid(isValidEmail);
    setIsPasswordValid(isValidPassword);

    if (!isValidEmail || !isValidPassword) {
      return;
    }
    try {
      // Ghi log hành động người dùng
      await logUserAction('login_attempt', `email: ${email.substring(0, 2)}***`);
      
      const resultAction = await dispatch(userLoginAPI({ email, password }));
      if (userLoginAPI.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        if (user) {
          storage.set('userId', String(user.user.userId || ''));
          storage.set('accessToken', user.accessToken);
          storage.set('refreshToken', user.refreshToken);
          signIn();
          
          // Ghi lại hành động đăng nhập thành công
          await logUserAction('login_success');
        } else {
          setIsErrorMessage(true);
          setErrorMessage('Email not verified, please check your email');
          console.log('Email not verified', user);
          
          // Ghi lại lỗi
          await logError('Email not verified', { 
            error_type: 'email_verification',
            action: 'login'
          });
        }
      } else {
        setIsErrorMessage(true);
        setErrorMessage('Login failed, please try again');
        console.log('Login failed');
        
        // Ghi lại lỗi
        await logError('Login failed', { 
          error_type: 'auth_failure',
          action: 'login'
        });
      }
    } catch (error) {
      setIsErrorMessage(true);
      setErrorMessage('An error occurred, please try again');
      console.log('An error occurred', error);
      
      // Ghi lại lỗi
      await logError(error, {
        action: 'login',
        error_type: 'exception'
      });
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

  const [enabled, setEnabled] = useState(crashlytics().isCrashlyticsCollectionEnabled);

  async function toggleCrashlytics() {
    // Sử dụng utility function mới
    const isEnabled = await setCrashlyticsEnabled(!enabled);
    setEnabled(isEnabled);
  }

  // Thêm hàm test API Error
  const testApiError = async () => {
    try {
      // Tạo ra một lỗi API cố ý
      throw new Error('API Error Test');
    } catch (error) {
      await logError(error, {
        error_type: 'test_api_error',
        action: 'test_button'
      });
      // Không cần gọi forceFlushReports vì logError đã tự động làm điều này
    }
  };

  // Thêm hàm test Manual Flush
  const testManualFlush = async () => {
    // Ghi log vài thông tin
    await crashlytics().log('Manual flush test log 1');
    await crashlytics().log('Manual flush test log 2');
    
    // Force flush logs ngay lập tức
    await forceFlushReports();
  };

  return (
    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Title */}
        <CustomAuthHeader img={img.Yummy} />
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
            iconName={showPassword ? 'eye' : 'eyeo'}
          />
          {isPasswordValid ? null : (
            <Text style={styles.errorMessage}>{t('pw_invalid')}</Text>
          )}
          {isErrorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          <CustomButton title={t('login_btn')} onPress={handleLoginWithEmail} />

          {/* Nút đăng nhập bằng Google */}
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>{t('login_or')}</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
          // onPress={handleLoginWithGoogle}
          >
            <Image
              source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>{t('login_with_google')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleLoginWithFacebook}
          >
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>{t('login_with_facebook')}</Text>
          </TouchableOpacity>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <CustomTextFooter
            content={t('login_register')}
            navigateTo={t('login_register_btn')}
            navigation={navigation}
            targetScreen="SignUpPage"
          />
          <CustomTextFooter
            navigateTo={t('login_forgot_pw')}
            navigation={navigation}
            targetScreen="ForgotPasswordPage"
          />
        </View>
        <View>
          <Button title="Toggle Crashlytics" onPress={toggleCrashlytics} />
          <Button title="Crash" onPress={() => crashlytics().crash()} />
          <Button title="Test API Error" onPress={testApiError} />
          <Button title="Manual Flush Logs" onPress={testManualFlush} />
          <Text>Crashlytics is currently {enabled ? 'enabled' : 'disabled'}</Text>
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
  imgStyle: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
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

export default LoginPage;
