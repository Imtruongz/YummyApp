import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

//Customm components
import CustomButton from '../components/customize/Button';
import CustomInput from '../components/customize/Input';
import CustomTextFooter from '../components/customize/TextFooter';
import CustomAuthHeader from '../components/customize/authHeader';

import auth from '@react-native-firebase/auth';
import color from '../utils/color';
import img from '../utils/urlImg';
import {verifyEmail, verifyPassword} from '../utils/validate';

interface LoginPageProps
  extends NativeStackScreenProps<RootStackParamList, 'LoginPage'> {}

const LoginPage: React.FC<LoginPageProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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
      const response = await auth().signInWithEmailAndPassword(email, password);
      if (response.user.emailVerified) {
        navigation.navigate('BottomTabs');
        console.log('Email verified', response.user);
      } else {
        setIsErrorMessage(true);
        setErrorMessage('Email not verified, please check your email');
        console.log('Email not verified');
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        setIsErrorMessage(true);
        setErrorMessage('User not found, please try again');
        console.log('User not found');
      }
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
});

export default LoginPage;
