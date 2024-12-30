import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';

import CustomButton from '../components/customize/Button';
import CustomInput from '../components/customize/Input';
import CustomTextFooter from '../components/customize/TextFooter';

import Toast from 'react-native-toast-message';
import color from '../utils/color';
import {
  verifyEmail,
  verifyPassword,
  verifyConfirmPassword,
} from '../utils/validate';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

import CustomAuthHeader from '../components/customize/authHeader';
import img from '../utils/urlImg';

import {useAppDispatch} from '../redux/hooks.ts';
import {userRegisterAPI} from '../redux/slices/auth/authThunk'; // Import your thunk

interface SignUpPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SignUpPage'> {}
const SignupPage: React.FC<SignUpPageProps> = ({navigation}) => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
        userRegisterAPI({email, password, username, phoneNumber}),
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
            placeholder="Username"
            onChangeText={setUsername}
          />
          <CustomInput
            value={phoneNumber}
            placeholder="Phone Number"
            onChangeText={setPhoneNumber}
          />
          <CustomInput
            value={email}
            placeholder="Email"
            onChangeText={setEmail}
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
          <CustomInput
            value={confirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            onChangeText={setConfirmPassword}
            showIcon={true}
            onPressIcon={handleShowConfirmPassword}
            iconName={showConfirmPassword ? 'eye' : 'eyeo'}
          />

          {isConfirmPasswordValid ? null : (
            <Text style={styles.errorMessage}>
              Confirmation password invalid
            </Text>
          )}
          {
            // Error message
            isErrorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null
          }
          <CustomButton title="Sign Up" onPress={handleSignUp} />
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <CustomTextFooter
            content="Already have an account?"
            navigateTo="Login"
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
