import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
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

const fbAppId = '1178286763959143'
Settings.setAppID(fbAppId)

import { MMKV } from 'react-native-mmkv';
import { AuthContext } from '../contexts/AuthContext';

const storage = new MMKV();

interface LoginPageProps
  extends NativeStackScreenProps<RootStackParamList, 'LoginPage'> { }

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Title */}
        <CustomAuthHeader img={img.Yummy} />
        {/* Content */}
        <View style={styles.body}>
          <CustomInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          {!isEmailValid ? (
            <Text style={styles.errorMessage}>Email invalidd</Text>
          ) : null}
          <CustomInput
            value={password}
            placeholder="Password"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            showIcon={true}
            onPressIcon={handleShowPassword}
            iconName={showPassword ? 'eye' : 'eyeo'}
          />
          {isPasswordValid ? null : (
            <Text style={styles.errorMessage}>Password invalid</Text>
          )}
          {isErrorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          <CustomButton title="Login" onPress={handleLoginWithEmail} />

          {/* Nút đăng nhập bằng Google */}
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>HOẶC</Text>
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
            <Text style={styles.googleButtonText}>Đăng nhập bằng Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleLoginWithFacebook}
          >
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Đăng nhập bằng Facebook</Text>
          </TouchableOpacity>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <CustomTextFooter
            content="Don't have an account?"
            navigateTo="Sign up"
            navigation={navigation}
            targetScreen="SignUpPage"
          />
          <CustomTextFooter
            navigateTo="Forgot password"
            navigation={navigation}
            targetScreen="ForgotPasswordPage"
          />
        </View>
      </SafeAreaView>
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
