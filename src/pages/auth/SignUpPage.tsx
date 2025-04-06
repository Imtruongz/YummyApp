import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView
} from 'react-native';
import React, {useState} from 'react';

import CustomButton from '../../components/customize/CustomButton.tsx';
import CustomInput from '../../components/customize/CustomInput.tsx';
import CustomTextFooter from '../../components/customize/CustomTextFooter.tsx';
import CustomAuthHeader from '../../components/customize/CustomAuthHeader.tsx';

import {
  verifyEmail,
  verifyPassword,
  verifyConfirmPassword,
} from '../../utils/validate.ts';
import Toast from 'react-native-toast-message';
import color from '../../utils/color.ts';
import img from '../../utils/urlImg.ts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../android/types/StackNavType.ts';
import {useAppDispatch} from '../../redux/hooks.ts';
import {userRegisterAPI} from '../../redux/slices/auth/authThunk.ts';
import { useTranslation } from 'react-i18next';

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

    try {
      const resultAction = await dispatch(
        userRegisterAPI({email, password, username}),
      );
      if (userRegisterAPI.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: 'Sign up successfully',
          text2: 'Please check your email to verify your account',
        });
        navigation.navigate('LoginPage');
      } else {
        setIsErrorMessage(true);
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsErrorMessage(true);
      setErrorMessage('An error occurred during registration.');
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
            value={username}
            placeholder={t('login_username')}
            onChangeText={setUsername}
          />
          <CustomInput
            value={email}
            placeholder={t('login_email')}
            onChangeText={setEmail}
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
          <CustomInput
            value={confirmPassword}
            placeholder={t('change_confirm_pw')}
            secureTextEntry={!showConfirmPassword}
            onChangeText={setConfirmPassword}
            showIcon={true}
            onPressIcon={handleShowConfirmPassword}
            iconName={showConfirmPassword ? 'eye' : 'eyeo'}
          />

          {isConfirmPasswordValid ? null : (
            <Text style={styles.errorMessage}>
              {t('pw_invalid')}
            </Text>
          )}
          {
            // Error message
            isErrorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null
          }
          <CustomButton title={t('login_register_btn')} onPress={handleSignUp} />
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <CustomTextFooter
            content={t('login_already_accounted')}
            navigateTo={t('login_btn')}
            navigation={navigation}
            targetScreen="LoginPage"
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
    color: color.danger,
  },
});

export default SignupPage;
